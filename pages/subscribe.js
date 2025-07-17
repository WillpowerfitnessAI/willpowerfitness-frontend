// pages/subscribe.js

import Head from 'next/head';

export default function Subscribe() {
  return (
    <>
      <Head>
        <title>Join WillpowerFitness AI</title>
        <script async src="https://js.stripe.com/v3/buy-button.js"></script>
      </Head>

      <main style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Join WillpowerFitness AI</h1>
        <p>Train smarter. Think stronger. Move better.</p>

        {/* Stripe Buy Button */}
        <stripe-buy-button
          buy-button-id="buy_btn_1Rk2WbIW2TDvX8i08lvj2TXd"
          publishable-key="pk_live_51RWp4dIw2TDvX8i03cm21OH32tWmttKk0voD2mKiHfKIZDK7AdiLCWQSDxLvo0BJzR1MLP0o0K1Iw1PTF9MGGEAZS00ylxj6tAS">
        </stripe-buy-button>
      </main>
    </>
  );
}
