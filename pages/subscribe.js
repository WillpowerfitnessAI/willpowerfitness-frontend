// pages/subscribe.js
import Head from 'next/head';

export default function Subscribe() {
  return (
    <>
      <Head>
        <title>Join WillpowerFitness AI</title>
        <script async src="https://js.stripe.com/v3/buy-button.js"></script>
      </Head>
      <main style={{ textAlign: 'center', padding: '60px', fontFamily: 'sans-serif' }}>
        <h1>Join WillpowerFitness AI</h1>
        <p>Train smarter. Think stronger. Move better.</p>
        <stripe-buy-button
          buy-button-id="buy_btn_1Rk2wbIaTzDVx8188tvj2Tk4"
          publishable-key="pk_live_5iRiU4wd13zTDvX8183cm2HQH2wTmktK0v0D2nKfKfHfKIDX7Ad1lcWQ5DxLoV08j3RzMLPE0oK1IwPTf9M6EAZ5Qey1xj6tAS">
        </stripe-buy-button>
      </main>
    </>
  );
}
