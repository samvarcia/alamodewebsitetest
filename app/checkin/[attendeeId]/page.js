'use client';

import { useState, useEffect } from 'react';

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

  if (error) return <div>Error: {error}</div>;
  if (!attendee) return <div>Loading...</div>;

  return (
    <div style={{color: "#000"}}>
      <h1>Attendee Check-In</h1>
      <p>Name: {attendee.name}</p>
      <p>Email: {attendee.email}</p>
      <p>Party: {attendee.party}</p>
      <p>Plus One: {attendee.plusOne}</p>
      <p>Status: {attendee.checkInStatus}</p>
    </div>
  );
}