import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { pdf, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { content } from 'googleapis/build/src/apis/content';

async function sendEmail(to, subject,pdfBuffer) {
  let transporter = nodemailer.createTransport({
    host: 'smtp0001.neo.space',
    port: 465,
    secure: true,
    auth: {
      user: "checkin@locationalamode.com",
      pass: '@lamodecheckin3005',
    },
  });

  let info = await transporter.sendMail({
    from: '"CHECK IN ALAMODE" <checkin@locationalamode.com>',
    to: to,
    subject: subject,
    attachments: [
      {
        filename: 'invitation.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      },
      // {
      //   filename: 'qrcode.png',
      //   content: qrCodeBuffer,
      //   cid: 'qrcode@alamode.com'
      // }
    ]
  });

  console.log("Message sent: %s", info.messageId);
}

export async function GET(request) {
  try {
    console.log(request)
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    Font.register({
      family: 'Futura',
      src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/futuraregular.ttf',
    });
    
    Font.register({
      family: 'Sloop Script',
      src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/SloopScriptTwoBETAMedium.ttf',
    });
    
    // Create styles
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      },
      backgroundImage: {
        position: 'absolute',
        minWidth: '100%',
        minHeight: '100%',
        display: 'block',
        height: '100vh',
        width: '100vw',
      },
      content: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
      },
      logo: {
        width: 60,
        marginTop: 30,
        marginBottom: 20,
      },
      text: {
        fontFamily: 'Futura',
        color: '#FFFFFF',
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 10,
      },
      nameContainer: {
        alignItems: 'center',
        marginTop: 30,
      },
      name: {
        fontFamily: 'Sloop Script',
        fontSize: 76,
        color: '#FFFFFF',
      },
      nameLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#FFFFFF',
        marginTop: -10, // Adjust this value to position the line closer to the name
      },
      qrCode: {
        width: 150,
        height: 150,
        marginVertical: 20,
        marginBottom: 30,
      },
      dateTimeText: {
        fontFamily: 'Futura',
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 0,
        lineHeight: 1.2,
      },
      centerText: {
        textAlign: 'center',
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
      },
   
    });
    
    // Create PDF Document component
    const MyDocument = ({ firstName, lastName, party, plusOne, partyDetails, qrCodeDataURL }) => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.content}>
          <Image
            style={styles.backgroundImage}
            src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/gradient-background.png"
          />
            <Image style={styles.logo} src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/logoalamode.png" />
            <View style={[styles.centerText, { marginTop: 15 }]}>
              <Text style={[styles.dateTimeText, { fontSize: 14 }]}>SPRING/SUMMER 25</Text>
              <Text style={[styles.dateTimeText, { fontSize: 26, marginBottom: 30 }]}>{party.toUpperCase()}</Text>
            </View>
            <Text style={[styles.text, { fontSize: 8 }]}>WOULD NOT BE THE SAME WITHOUT</Text>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{firstName} {lastName}</Text>
              <View style={styles.nameLine} />
            </View>
            {plusOne !== 'None' && (
              <Text style={[styles.text, { marginTop: 10 }]}>ATTENDING WITH: {plusOne.toUpperCase()}</Text>
            )}
            <Image style={styles.qrCode} src={qrCodeDataURL} />
            <Text style={styles.text}>JOIN US AT</Text>
            <View style={styles.centerText}>
              <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.venue}</Text>
              <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.address}</Text>
            </View>
            <Text style={[styles.text, { marginTop: 20 }]}>ON</Text>
            <View style={styles.centerText}>
              <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.date}</Text>
              <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.hours}</Text>
            </View>
            <Text style={[styles.text, { fontSize: 8, marginTop: 80 }]}>Please Party Responsibly: Attendees assume full responsibility for their own actions</Text>
          </View>
        </Page>
      </Document>
    );
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'UNAPPROVED!A2:J',
    });

    const rows = response.data.values;
    const partyInfo = {
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
        date: 'WEDNESDAY, 25TH SEPTEMBER 2024',
        hours: '12:00AM - 05:00AM'
      }
    };
    if (rows.length) {
      for (const row of rows) {
        if (row[8] === 'Y') { // Assuming "Approved" is the 9th column (index 8)
          const email = row[3];
          const firstName = row[1];
          const lastName = row[2];
          const party = row[0];
          const plusOne = row[6] === 'Yes' ? row[7] : 'None';

          const partyDetails = partyInfo[party] || {
            venue: 'TBA',
            address: 'TBA',
            date: 'TBA',
            hours: 'TBA'
          };
          // Generate unique identifier
          const attendeeId = uuidv4();

          // Generate QR code
        

          // Check if the email or attendeeId already exists in the approved sheet
          const approvedRowsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'APPROVED!D:J',
          });

          const approvedRows = approvedRowsResponse.data.values || [];
          const existingRow = approvedRows.find((r) => r[0] === email || r[9] === attendeeId);

          if (!existingRow) {
            // Get the current number of rows in the APPROVED sheet
            const currentRowsResponse = await sheets.spreadsheets.values.get({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: 'APPROVED!A:A',
            });

            const nextRow = currentRowsResponse.data.values ? currentRowsResponse.data.values.length + 1 : 1;

            // Add to approved sheet
            await sheets.spreadsheets.values.update({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: `APPROVED!A${nextRow}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [[
                  row[0],  // Party
                  row[1],  // First Name
                  row[2],  // Last Name
                  row[3],  // Email
                  row[4],  // Models Link
                  row[5],  // Instagram Link
                  row[6],  // Plus One (Yes/No)
                  row[7],  // Plus One Name
                  row[8],  // Approval Status
                  attendeeId,  // Unique Attendee ID
                  'Not Checked In'  // Initial Check-In Status
                ]]
              }
            });

            const qrCodeLink = `${process.env.BASE_URL}/checkin/${attendeeId}`;
          const qrCodeBuffer = await QRCode.toBuffer(qrCodeLink);
          const qrCodeDataURL = await QRCode.toDataURL(qrCodeLink);

          // Generate PDF
          const pdfBuffer = await pdf(
            <MyDocument
              firstName={firstName}
              lastName={lastName}
              party={party}
              plusOne={plusOne}
              partyDetails={partyDetails}
              qrCodeDataURL={qrCodeDataURL}
            />
          ).toBuffer();

        
          await sendEmail(
            email,
            `${party} Party Invitation`,
            pdfBuffer,
            // qrCodeBuffer
          );

            // Update the "Approved" status to 'S' for "Sent" in the UNAPPROVED sheet
            await sheets.spreadsheets.values.update({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: `UNAPPROVED!J${rows.indexOf(row) + 2}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [['S']]
              }
            });
          } else {
            console.log(`Skipping row for email ${email} or attendeeId ${attendeeId} as it already exists in the approved sheet.`);
          }
        }
      }
    }

    return NextResponse.json({ message: 'Approval check completed' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error checking approvals' }, { status: 500 });
  }
}