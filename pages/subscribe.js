// pages/subscribe.js

import Head from 'next/head'
import Script from 'next/script'

export default function Subscribe() {
  return (
    <>
      <Head>
        <title>Join WillpowerFitness AI</title>
      </Head>

      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="afterInteractive"
      />

      <main style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Join WillpowerFitness AI</h1>
        <p>Train smarter. Think stronger. Move better.</p>

        <stripe-buy-button
          buy-button-id="buy_btn_1Rk2WbIw2TDvX8i08lvj2TXd"
          publishable-key="pk_live_51iRw4diw2TDvX8i03cm21OH32WfTmtkK0voD2mKifHkIZDK7AdiLCWQSDxLoVO8jZR1MLPe0oK1Iw1PTF9MGGEAZS0ey1xj6tAS"
        ></stripe-buy-button>
      </main>
    </>
  )
}
