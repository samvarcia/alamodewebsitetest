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
  }
};

export async function GET() {
  try {
    // Get current state
    const [unapprovedAttendees, recentlyProcessed] = await Promise.all([
      getUnapprovedAttendees(),
      getRecentlyProcessed()
    ]);
    
    const approvedAttendees = unapprovedAttendees.filter(row => row[8] === 'Y');
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

    // Process approved attendees in batches
    for (let i = 0; i < approvedAttendees.length; i += BATCH_SIZE) {
      const batch = approvedAttendees.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (attendee) => {
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
        const htmlTemplate = `...`; // Your existing HTML template

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
      }));
    }

    // Get updated recently processed list
    const updatedRecentlyProcessed = await getRecentlyProcessed();

    return NextResponse.json({ 
      message: 'Approval processing completed',
      processed: approvedAttendees.length,
      pending: pendingCount,
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