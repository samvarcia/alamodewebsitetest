import { pdf, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import QRCode from 'qrcode';

Font.register({
  family: 'Futura',
  src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/futuraregular.ttf',
});

Font.register({
  family: 'LTRailway',
  src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/LTRailway-Regular.otf',
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#01044C',
    flexDirection: 'row',
    padding: 20,
  },
  leftSection: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    marginBottom: 10,
  },
  worldMap: {
    width: 320,
    marginBottom: 10,
  },
  textGroup: {
    alignItems: 'center',
  },
  season: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 0,
  },
  city: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 30,
    marginBottom: 0,
  },
  name: {
    fontFamily: 'LTRailway',
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  plusOneText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  venueInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  venueLabel: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 5,
    marginTop: 15,
    textAlign: 'center',
  },
  venueText: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  qrCode: {
    width: 140,
    height: 140,
    marginTop: 30,
  },
  disclaimer: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 20,
  },
});

const cityMaps = {
  'New York City': 'https://h8b8ligav2.ufs.sh/f/1HacuqBhXBpbyEmlQBupzoah5itw7Pd8O0sEAxSuC4lqrVBg',
  'Milan': 'https://h8b8ligav2.ufs.sh/f/1HacuqBhXBpboYMNqugwq0OplGu7W4PmbjzJr5kUC8L9TyEF',
  'Paris': 'https://h8b8ligav2.ufs.sh/f/1HacuqBhXBpbsGwfqmUjxKg6pPHaZI5dBo3hEvfjNeV1yOi7',
  'London': 'https://h8b8ligav2.ufs.sh/f/1HacuqBhXBpb5oCDrlze6uGOJ0BtMc4DiVwkNHZjKhgndCAl',
};

const PDFDocument = ({ firstName, lastName, party, plusOne, partyDetails, qrCodeDataURL }) => (
  <Document>
    <Page orientation="landscape" style={styles.page}>
      <View style={styles.leftSection}>
        <Image 
          style={styles.logo} 
          src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1" 
        />
        <Image
          style={styles.worldMap}
          src={cityMaps[party]}
        />
        <View style={styles.textGroup}>
          <Text style={styles.season}>FALL/WINTER 25</Text>
          <Text style={styles.city}>{party.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.name}>{`${firstName} ${lastName}`.toUpperCase()}</Text>
        {plusOne !== 'None' && (
          <Text style={styles.plusOneText}>ATTENDING WITH: {plusOne.toUpperCase()}</Text>
        )}

        <View style={styles.venueInfo}>
          <Text style={styles.venueLabel}>JOIN US AT</Text>
          <Text style={styles.venueText}>{partyDetails.venue}</Text>
          <Text style={styles.venueText}>{partyDetails.address}</Text>
          <Text style={styles.venueLabel}>ON</Text>
          <Text style={styles.venueText}>{partyDetails.date}</Text>
          <Text style={styles.venueText}>{partyDetails.hours}</Text>
          <Image style={styles.qrCode} src={qrCodeDataURL} />
          <Text style={styles.disclaimer}>
            Please Party Responsibly: Attendees assume full responsibility for their own actions.
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function generatePDF(attendeeData, qrCodeLink) {
  console.log('PDF Generator received:', { attendeeData, qrCodeLink });
  
  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeLink, {
      color: {
        dark: '#FFFFFF',
        light: '#00000000'
      },
      width: 140,
      margin: 1,
    });
    
    const pdfBuffer = await pdf(
      <PDFDocument {...attendeeData} qrCodeDataURL={qrCodeDataURL} />
    ).toBuffer();
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}