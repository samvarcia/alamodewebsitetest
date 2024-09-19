
// app/api/create-checkout-session/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(request) {
  try {
    const { amount } = await request.json();
    
    console.log('SOY REQ' + request)

    const session = await stripe.checkout.sessions.create({
      submit_type: "donate",
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            unit_amount: amount * 100, // Stripe uses cents
            currency: 'usd',
            product_data: {
              name: 'Donation',
            },
          },
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success`,
      cancel_url: `${request.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}