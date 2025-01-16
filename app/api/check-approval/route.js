import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generatePDF } from '../../utils/pdf-generator';
import { sendEmail } from '../../utils/email-service';
import { getUnapprovedAttendees, updateAttendeeStatus, moveToApprovedSheet, getRecentlyProcessed } from '../../utils/sheets-service';

const BATCH_SIZE = 5;
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
    venue: 'TBA',
    address: 'TBA',
    date: 'TBA',
    hours: 'TBA'
  }
};

export async function GET() {
  try {
    // Get current state
    const [unapprovedAttendees, recentlyProcessed] = await Promise.all([
      getUnapprovedAttendees(),
      getRecentlyProcessed()
    ]);
    
    // Only get attendees that are approved ('Y') but not yet processed ('S')
    const approvedAttendees = unapprovedAttendees.filter(row => row[8] === 'Y' && row[9] !== 'S');
    const pendingCount = unapprovedAttendees.filter(row => row[8] === '').length;
    
    // If there are no new approvals, return current status
    if (approvedAttendees.length === 0) {
      return NextResponse.json({
        message: 'No new approvals to process',
        pending: pendingCount,
        recentlyProcessed: recentlyProcessed.map(row => ({
          name: `${row[1]} ${row[2]}`,
          party: row[0],
          timestamp: row[11] || 'Recently'
        }))
      });
    }

    const processed = [];
    const errors = [];

    // Process approved attendees in batches
    for (let i = 0; i < approvedAttendees.length; i += BATCH_SIZE) {
      const batch = approvedAttendees.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (attendee) => {
        try {
          const [party, firstName, lastName, email, , , plusOneStatus, plusOneName] = attendee;
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

          const pdfBuffer = await generatePDF(attendeeData, qrCodeLink);
          
          // Your existing HTML template
          const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Welcome to the ${party} Party!</h2>
              <p>Dear ${firstName},</p>
              <p>Your attendance has been confirmed. Please find your invitation attached.</p>
              <h3>Event Details:</h3>
              <p><strong>Venue:</strong> ${attendeeData.partyDetails.venue}</p>
              <p><strong>Address:</strong> ${attendeeData.partyDetails.address}</p>
              <p><strong>Date:</strong> ${attendeeData.partyDetails.date}</p>
              <p><strong>Time:</strong> ${attendeeData.partyDetails.hours}</p>
              ${plusOneStatus === 'Yes' ? `<p><strong>Plus One:</strong> ${plusOneName}</p>` : ''}
              <p>Please keep this invitation safe and present it at the entrance.</p>
              <p>Looking forward to seeing you!</p>
            </div>
          `;

          await sendEmail(email, `${party} Party Invitation`, pdfBuffer, htmlTemplate);
          
          // Update sheets status and move to approved sheet
          const rowIndex = unapprovedAttendees.indexOf(attendee) + 2;
          await Promise.all([
            updateAttendeeStatus(`UNAPPROVED!J${rowIndex}`, [['S']]),
            moveToApprovedSheet([
              party, firstName, lastName, email, attendee[4], attendee[5], 
              plusOneStatus, plusOneName, 'Y', 'S', attendeeId, timestamp
            ])
          ]);
          
          processed.push(`${firstName} ${lastName} - ${party}`);
        } catch (error) {
          if (error.message.includes('Duplicate entry')) {
            // Mark as processed in UNAPPROVED sheet to prevent future processing
            const rowIndex = unapprovedAttendees.indexOf(attendee) + 2;
            await updateAttendeeStatus(`UNAPPROVED!J${rowIndex}`, [['S']]);
            errors.push(`${attendee[1]} ${attendee[2]} - Already approved for ${attendee[0]}`);
          } else {
            throw error;
          }
        }
      }));
    }

    // Get updated recently processed list
    const updatedRecentlyProcessed = await getRecentlyProcessed();

    console.log(updatedRecentlyProcessed)

    return NextResponse.json({ 
      message: 'Approval processing completed',
      processed: processed.length,
      pending: pendingCount,
      duplicates: errors.length > 0 ? errors : undefined,
      recentlyProcessed: updatedRecentlyProcessed.map(row => ({
        name: `${row[1]} ${row[2]}`,
        party: row[0],
        timestamp: row[11] || 'Recently'
      }))
    });
  } catch (error) {
    console.error('Error processing approvals:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}