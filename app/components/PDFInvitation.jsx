import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Jost',
  src: 'path/to/Jost-Regular.ttf',
});

Font.register({
  family: 'Luxurious Script',
  src: '/futura55regular-webfont.woff',
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#BC0123',
    padding: 20,
    alignItems: 'center',
    color: '#FAFBF5',
    fontFamily: 'Jost',
  },
  logo: {
    width: 80,
    marginBottom: 20,
  },
  upperInfo: {
    marginBottom: 30,
    alignItems: 'center',
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  would: {
    fontSize: 12,
    marginBottom: 10,
  },
  name: {
    fontSize: 36,
    fontFamily: 'Luxurious Script',
    marginBottom: 10,
  },
  attending: {
    fontSize: 12,
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  join: {
    fontSize: 12,
    marginBottom: 10,
  },
  venueInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  on: {
    fontSize: 12,
    marginBottom: 10,
  },
  dateInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 8,
    marginTop: 20,
  },
});

const PDFInvitation = ({ firstName, lastName, party, plusOne, partyDetails, qrCodePath }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.logo} src="/path/to/logoalamode.png" />
      <View style={styles.upperInfo}>
        <Text>SPRING/SUMMER 25</Text>
        <Text style={styles.city}>{party.toUpperCase()}</Text>
      </View>
      <Text style={styles.would}>WOULD NOT BE THE SAME WITHOUT</Text>
      <Text style={styles.name}>{firstName.toUpperCase()} {lastName.toUpperCase()}</Text>
      {plusOne !== 'None' && (
        <Text style={styles.attending}>ATTENDING WITH: {plusOne.toUpperCase()}</Text>
      )}
      <Image style={styles.qrCode} src={qrCodePath} />
      <Text style={styles.join}>JOIN US AT</Text>
      <View style={styles.venueInfo}>
        <Text>{partyDetails.venue}</Text>
        <Text>{partyDetails.address}</Text>
      </View>
      <Text style={styles.on}>ON</Text>
      <View style={styles.dateInfo}>
        <Text>{partyDetails.date}</Text>
        <Text>{partyDetails.hours}</Text>
      </View>
      <Text style={styles.disclaimer}>Please Party Responsibly: Attendees assume full responsibility for their own actions</Text>
    </Page>
  </Document>
);

export default PDFInvitation;