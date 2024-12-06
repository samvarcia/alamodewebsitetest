import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const LIST_ID = process.env.MAILCHIMP_LIST_ID2
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const DATACENTER = API_KEY.split('-')[1]

    const url = `https://us21.api.mailchimp.com/3.0/lists/${LIST_ID}`

    const response = await fetch(url, {
      headers: {
        Authorization: `apikey ${API_KEY}`,
      },
    })

    const data = await response.json()
    const totalMembers = data.stats.member_count
    const maxSeats = 50 // Set your maximum seats
    const availableSeats = Math.max(0, maxSeats - totalMembers)

    return NextResponse.json({ availableSeats }, { status: 200 })
  } catch (error) {
    console.error('Error fetching seats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available seats' },
      { status: 500 }
    )
  }
}