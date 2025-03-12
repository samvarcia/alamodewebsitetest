// /api/subscribe-miami/route.js
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email || !email.length) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const LIST_ID = process.env.MAILCHIMP_LIST_ID3
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const DATACENTER = API_KEY.split('-')[1]

    const url = `https://us21.api.mailchimp.com/3.0/lists/${LIST_ID}/members/`

    const data = {
      email_address: email,
      status: 'subscribed',
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    const response = await fetch(url, options)
    const responseData = await response.json()
    
    if (!response.ok) {
      // Handle specific Mailchimp errors
      if (responseData.title === 'Member Exists') {
        return NextResponse.json(
          { error: 'You are already subscribed to our newsletter' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: responseData.detail || 'There was an issue with the request' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}