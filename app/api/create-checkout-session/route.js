// app/api/create-checkout-session/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(request) {
  try {
    const { amount } = await request.json();
    const origin = request.headers.get('origin');

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
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}