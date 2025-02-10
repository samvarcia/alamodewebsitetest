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
    flexDirection: 'row', // Changed to row for horizontal layout
    width: '100%',
  },
  leftSection: {
    width: '50%',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    width: '50%',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'flex-end', // Align items to the right
  },
  backgroundMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  logo: {
    width: 150,
    marginBottom: 40,
    alignSelf: 'flex-start', // Align logo to the left
  },
  season: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  city: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 48,
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  preNameText: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  name: {
    fontFamily: 'LTRailway',
    fontSize: 48,
    color: '#FFFFFF',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  plusOneText: {
    fontFamily: 'LTRailway',
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  venueInfo: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  venueLabel: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 5,
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
    width: 150,
    height: 150,
    marginBottom: 30,
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
    <Page size={[842, 595]} orientation="landscape" style={styles.page}> {/* A4 landscape dimensions */}
      <Image
        style={styles.backgroundMap}
        src={cityMaps[party] || cityMaps['Paris']}
      />
      
      {/* Left Section */}
      <View style={styles.leftSection}>
        <Image 
          style={styles.logo} 
          src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1" 
        />
        <Text style={styles.season}>FALL/WINTER 25</Text>
        <Text style={styles.city}>{party.toUpperCase()}</Text>
        <Text style={styles.preNameText}>WOULD NOT BE THE SAME WITHOUT</Text>
        <Text style={styles.name}>{`${firstName} ${lastName}`.toUpperCase()}</Text>
        {plusOne !== 'None' && (
          <Text style={styles.plusOneText}>ATTENDING WITH: {plusOne.toUpperCase()}</Text>
        )}
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <View style={styles.venueInfo}>
          <Text style={styles.venueLabel}>JOIN US AT</Text>
          <Text style={styles.venueText}>{partyDetails.venue}</Text>
          <Text style={styles.venueText}>{partyDetails.address}</Text>
          <Text style={styles.venueLabel}>ON</Text>
          <Text style={styles.venueText}>{partyDetails.date}</Text>
          <Text style={styles.venueText}>{partyDetails.hours}</Text>
        </View>
        <Image style={[styles.qrCode, { marginTop: 30 }]} src={qrCodeDataURL} />
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
        dark: '#FFFFFF',  // QR code color (white)
        light: '#00000000'  // Background (transparent)
      }
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