import { pdf, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import QRCode from 'qrcode';

// Register the fonts
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
    backgroundColor: '#000033',
    flexDirection: 'row',
    padding: 40,
  },
  leftSection: {
    width: '60%',
    position: 'relative',
  },
  rightSection: {
    width: '40%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    marginBottom: 20,
  },
  worldMap: {
    width: '80%',
    height: 200,
    marginBottom: 20,
  },
  season: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 10,
  },
  city: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 48,
    marginBottom: 30,
  },
  nameSection: {
    marginTop: 'auto',
  },
  preNameText: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 10,
  },
  name: {
    fontFamily: 'LTRailway',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 1,
  },
  plusOneText: {
    fontFamily: 'LTRailway',
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 5,
  },
  venueInfo: {
    alignItems: 'flex-end',
  },
  venueLabel: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 5,
    marginTop: 15,
    textAlign: 'right',
  },
  venueText: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'right',
  },
  qrCode: {
    width: 120,
    height: 120,
    marginTop: 30,
  },
  disclaimer: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 8,
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
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
    <Page size={[842, 595]} orientation="landscape" style={styles.page}>
      <View style={styles.leftSection}>
        <Image 
          style={styles.logo} 
          src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1" 
        />
        <Image
          style={styles.worldMap}
          src={cityMaps[party] || cityMaps['Paris']}
        />
        <Text style={styles.season}>FALL/WINTER 25</Text>
        <Text style={styles.city}>{party.toUpperCase()}</Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.nameSection}>
          <Text style={styles.preNameText}>WOULD NOT BE THE SAME WITHOUT</Text>
          <Text style={styles.name}>{`${firstName} ${lastName}`.toUpperCase()}</Text>
          {plusOne !== 'None' && (
            <Text style={styles.plusOneText}>ATTENDING WITH: {plusOne.toUpperCase()}</Text>
          )}
        </View>

        <View style={styles.venueInfo}>
          <Text style={styles.venueLabel}>JOIN US AT</Text>
          <Text style={styles.venueText}>{partyDetails.venue}</Text>
          <Text style={styles.venueText}>{partyDetails.address}</Text>
          <Text style={styles.venueLabel}>ON</Text>
          <Text style={styles.venueText}>{partyDetails.date}</Text>
          <Text style={styles.venueText}>{partyDetails.hours}</Text>
          <Image style={styles.qrCode} src={qrCodeDataURL} />
        </View>
      </View>

      <Text style={styles.disclaimer}>
        Please Party Responsibly: Attendees assume full responsibility for their own actions.
      </Text>
    </Page>
  </Document>
);

export async function generatePDF(attendeeData, qrCodeLink) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeLink, {
      color: {
        dark: '#FFFFFF',
        light: '#00000000'
      },
      width: 120,
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