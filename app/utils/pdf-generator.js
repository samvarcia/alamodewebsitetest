import { pdf, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import QRCode from 'qrcode';

Font.register({
  family: 'Futura',
  src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/futuraregular.ttf',
});

Font.register({
  family: 'Sloop Script',
  src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/SloopScriptTwoBETAMedium.ttf',
});

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
    marginBottom: 5,
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  name: {
    fontFamily: 'Sloop Script',
    fontSize: 66,
    color: '#FFFFFF',
    borderBottom: '1px solid white',
  },
  nameLine: {
    width: '80%',
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  qrCode: {
    width: 170,
    height: 170,
    marginVertical: 20,
    marginBottom: 30,
    marginTop: 30,
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

const PDFDocument = ({ firstName, lastName, party, plusOne, partyDetails, qrCodeDataURL }) => (
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
        <Text style={[styles.text, { fontSize: 10 }]}>WOULD NOT BE THE SAME WITHOUT</Text>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{firstName} {lastName}</Text>
        </View>
        <View style={styles.nameLine}></View>
        {plusOne !== 'None' && (
          <Text style={[styles.text, {fontSize: 16, marginTop: 10 }]}>ATTENDING WITH: {plusOne.toUpperCase()}</Text>
        )}
        <Image style={styles.qrCode} src={qrCodeDataURL} />
        <Text style={styles.text}>JOIN US AT</Text>
        <View style={styles.centerText}>
          <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.venue}</Text>
          <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.address}</Text>
        </View>
        <Text style={[styles.text, { marginTop: 10 }]}>ON</Text>
        <View style={styles.centerText}>
          <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.date}</Text>
          <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.hours}</Text>
        </View>
        <Text style={[styles.text, { fontSize: 8, marginTop: 130 }]}>
          Please Party Responsibly: Attendees assume full responsibility for their own actions.
        </Text>
      </View>
    </Page>
  </Document>
);

export async function generatePDF(attendeeData, qrCodeLink) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeLink);
    const pdfBuffer = await pdf(
      <PDFDocument {...attendeeData} qrCodeDataURL={qrCodeDataURL} />
    ).toBuffer();
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}