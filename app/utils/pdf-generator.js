import { pdf, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import QRCode from 'qrcode';

// Register the fonts
Font.register({
  family: 'Futura',
  src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/futuraregular.ttf',
});

Font.register({
  family: 'LTRailway',
  src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/LTRailway-Regular.otf', // You'll need to add this font
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#000033', // Dark blue background
  },
  backgroundMap: {
    position: 'absolute',
    minWidth: '100%',
    minHeight: '100%',
    opacity: 0.1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    width: '100%',
    padding: 40,
  },
  logo: {
    width: 120,
    marginTop: 30,
    marginBottom: 20,
  },
  season: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  city: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 30,
  },
  preNameText: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  nameContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  name: {
    fontFamily: 'LTRailway',
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  plusOneText: {
    fontFamily: 'LTRailway',
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  venueContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  venueLabel: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 10,
  },
  venueText: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginTop: 30,
    marginBottom: 30,
  },
  disclaimer: {
    fontFamily: 'Futura',
    color: '#FFFFFF',
    fontSize: 8,
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
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
    <Page size="A4" style={styles.page}>
      <Image
        style={styles.backgroundMap}
        src={cityMaps[party] || cityMaps['Paris']} // Default to Paris map if city not found
      />
      <View style={styles.content}>
        <Image 
          style={styles.logo} 
          src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1" 
        />
        
        <Text style={styles.season}>FALL/WINTER 25</Text>
        <Text style={styles.city}>{party.toUpperCase()}</Text>
        
        <Text style={styles.preNameText}>WOULD NOT BE THE SAME WITHOUT</Text>
        
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{`${firstName} ${lastName}`.toUpperCase()}</Text>
        </View>
        
        {plusOne !== 'None' && (
          <View>
            <Text style={styles.plusOneText}>ATTENDING WITH: {plusOne.toUpperCase()}</Text>
          </View>
        )}
        
        <Image style={styles.qrCode} src={qrCodeDataURL} />
        
        <View style={styles.venueContainer}>
          <Text style={styles.venueLabel}>JOIN US AT</Text>
          <Text style={styles.venueText}>{partyDetails.venue}</Text>
          <Text style={styles.venueText}>{partyDetails.address}</Text>
          <Text style={styles.venueLabel}>ON</Text>
          <Text style={styles.venueText}>{partyDetails.date}</Text>
          <Text style={styles.venueText}>{partyDetails.hours}</Text>
        </View>
        
        <Text style={styles.disclaimer}>
          Please Party Responsibly: Attendees assume full responsibility for their own actions.
        </Text>
      </View>
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