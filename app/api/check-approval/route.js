// app/api/check-approval/route.js
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generatePDF } from '../../utils/pdf-generator';
import { sendEmail } from '../../utils/email-service';
import { getUnapprovedAttendees, updateAttendeeStatus, moveToApprovedSheet, getRecentlyProcessed } from '../../utils/sheets-service';

// Force dynamic execution
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

const BATCH_SIZE = 1;
const MAX_EXECUTION_TIME = 9000;

const PARTY_INFO = {
  'New York City': {
    venue: 'SELINA CHELSEA',
    address: '518 W 27th St, New York NY 10001',
    date: 'TUESDAY, 10TH SEPTEMBER 2024',
    hours: '10:00PM - 04:00AM'
  },
  'Milan': {
    venue: 'REPUBBLICA',
    address: 'Piazza della Repubblica, 12, 20124 Milano MI, Italy',
    date: 'WEDNESDAY, 18TH SEPTEMBER 2024',
    hours: '12:00AM - 05:00AM'
  },
  'Paris': {
    venue: 'CHEZ MOUNE',
    address: '54 Rue Jean-Baptiste Pigalle, 75009 Paris, France',
    date: 'TUESDAY, 24TH SEPTEMBER 2024',
    hours: '12:00AM - 05:00AM'
  },
  'London': {
    venue: 'PRINTWORKS LONDON',
    address: 'Surrey Quays Rd, London SE16 7PJ, United Kingdom',
    date: 'THURSDAY, 13TH FEBRUARY 2025',
    hours: '10:00PM - 06:00AM'
  }
};

export async function GET(req) {
  // Log request details
  console.log('🔄 Check-approval request received:', {
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  try {
    const startTime = Date.now();
    
    console.log('📊 Fetching current state...');
    const [unapprovedAttendees, recentlyProcessed] = await Promise.all([
      getUnapprovedAttendees(),
      getRecentlyProcessed()
    ]);
    
    // Only get attendees that are approved ('Y') but not yet processed ('S')
    const approvedAttendees = unapprovedAttendees.filter(row => row[8] === 'Y' && row[9] !== 'S');
    const pendingCount = unapprovedAttendees.filter(row => row[8] === '').length;
    
    console.log(`✨ Found ${approvedAttendees.length} approved attendees to process`);
    
    if (approvedAttendees.length === 0) {
      return NextResponse.json({
        message: 'No new approvals to process',
        pending: pendingCount,
        recentlyProcessed: recentlyProcessed.map(row => ({
          name: `${row[1]} ${row[2]}`,
          party: row[0],
          timestamp: row[11] || 'Recently'
        }))
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        }
      });
    }

    const processed = [];
    const errors = [];
    let processedCount = 0;

    // Process attendees one at a time with timeout check
    for (const attendee of approvedAttendees) {
      if (Date.now() - startTime > MAX_EXECUTION_TIME) {
        console.log('⚠️ Approaching timeout limit, stopping processing');
        break;
      }

      if (processedCount >= BATCH_SIZE) {
        console.log('✋ Batch size limit reached');
        break;
      }

      try {
        const [party, firstName, lastName, email, , , plusOneStatus, plusOneName] = attendee;
        console.log(`🎫 Processing: ${firstName} ${lastName} for ${party}`);

        const attendeeId = uuidv4();
        const qrCodeLink = `${process.env.BASE_URL}/checkin/${attendeeId}`;
        const timestamp = new Date().toISOString();
        
        const attendeeData = {
          firstName,
          lastName,
          party,
          plusOne: plusOneStatus === 'Yes' ? plusOneName : 'None',
          partyDetails: PARTY_INFO[party] || {
            venue: 'TBA',
            address: 'TBA',
            date: 'TBA',
            hours: 'TBA'
          }
        };

        console.log('📄 Generating PDF...');
        const pdfBuffer = await generatePDF(attendeeData, qrCodeLink);
        
        const htmlTemplate = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to the ${party} Party!</h2>
            <p>Dear ${firstName},</p>
            <p>Your attendance has been confirmed. Please find your invitation attached.</p>
            <h3>Event Details:</h3>
            <p><strong>Venue:</strong> ${partyDetails.venue}</p>
            <p><strong>Address:</strong> ${partyDetails.address}</p>
            <p><strong>Date:</strong> ${partyDetails.date}</p>
            <p><strong>Time:</strong> ${partyDetails.hours}</p>
            ${plusOneStatus === 'Yes' ? `<p><strong>Plus One:</strong> ${plusOneName}</p>` : ''}
            <p>Please keep this invitation safe and present it at the entrance.</p>
            <p>Looking forward to seeing you!</p>
          </div>
        `;

        console.log('📧 Sending email...');
        await sendEmail(email, `${party} Party Invitation`, pdfBuffer, htmlTemplate);
        
        console.log('📝 Updating sheets...');
        const rowIndex = unapprovedAttendees.indexOf(attendee) + 2;
        await updateAttendeeStatus(`UNAPPROVED!J${rowIndex}`, [['S']]);
        await moveToApprovedSheet([
          party, firstName, lastName, email, attendee[4], attendee[5], 
          plusOneStatus, plusOneName, 'Y', 'S', attendeeId, timestamp
        ]);
        
        processed.push(`${firstName} ${lastName} - ${party}`);
        processedCount++;
        console.log(`✅ Successfully processed ${firstName} ${lastName}`);

      } catch (error) {
        console.error('❌ Error processing attendee:', error);
        if (error.message.includes('Duplicate entry')) {
          const rowIndex = unapprovedAttendees.indexOf(attendee) + 2;
          await updateAttendeeStatus(`UNAPPROVED!J${rowIndex}`, [['S']]);
          errors.push(`${attendee[1]} ${attendee[2]} - Already approved for ${attendee[0]}`);
        } else {
          errors.push(`${attendee[1]} ${attendee[2]} - Processing failed: ${error.message}`);
        }
      }
    }

    console.log('🔄 Getting updated recently processed list...');
    const updatedRecentlyProcessed = await getRecentlyProcessed();

    const response = {
      message: processed.length > 0 
        ? 'Approval processing completed' 
        : 'Partial processing completed due to time constraints',
      processed: processed.length,
      pending: pendingCount,
      remainingToProcess: approvedAttendees.length - processed.length,
      duplicates: errors.length > 0 ? errors : undefined,
      timeElapsed: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      recentlyProcessed: updatedRecentlyProcessed.map(row => ({
        name: `${row[1]} ${row[2]}`,
        party: row[0],
        timestamp: row[11] || 'Recently'
      }))
    };

    console.log('✨ Processing complete:', response);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      }
    });
  } catch (error) {
    console.error('❌ Fatal error:', error);
    return NextResponse.json({ 
      error: error.message,
      errorDetail: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      }
    });
  }
}