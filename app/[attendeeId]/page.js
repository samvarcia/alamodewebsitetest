'use client';

import { useState, useEffect } from 'react';
import styles from './checkin.module.css';
import Image from 'next/image';


export default function CheckIn({ params }) {
  const { attendeeId } = params;
  const [attendee, setAttendee] = useState(null);
  const [error, setError] = useState(null);

  console.log(attendeeId)
  useEffect(() => {
    if (attendeeId) {
      fetch(`/api/check-in/${attendeeId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
            console.log(data)
        } else {
            setAttendee(data.attendee);
            console.log(data)

          }
        })
        .catch(err => setError('Failed to fetch attendee data'));
    }
  }, [attendeeId]);

  if (error) return <div style={{ color: "#BC0123"}}>Error: {error}</div>;
  if (!attendee) return <div style={{ color: "#BC0123"}}>Loading...</div>;

  return (
    <div className={styles.checkin}>
      <div style={{color: "#BC0123"}}>
        <h1>Attendee Check-In</h1>
        <p>Name: {attendee.name}</p>
        <p>Email: {attendee.email}</p>
        <p>Party: {attendee.party}</p>
        <p>Plus One: {attendee.plusOne}</p>
        <Image 
            src="/alamodered.svg"
            width={160}
            height={150}
            priority
            className={styles.logo}
          />
        {/* <p>Status: {attendee.checkInStatus}</p> */}
      </div>
    </div>
  );
}