// pages/subscribe.js
import Head from "next/head";
import Script from "next/script";

export default function Subscribe() {
  return (
    <>
      <Head>
        <title>Join WillpowerFitness AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Script async src="https://js.stripe.com/v3/buy-button.js" />

      <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}>
        <h1>Join WillpowerFitness AI</h1>
        <p>Train smarter. Think stronger. Move better.</p>
        <stripe-buy-button
          buy-button-id="buy_btn_1Rk2WBIw2TDvX8iO8lvj2TXd"
          publishable-key="pk_live_51RWp4dIw2TDvX8iOJcm21OH32WTmtKkOvoD2mKiHfkIZDK7AdiLCWQSDxLoVOBjZR1MLP0OoKIlW1PTF9MGGEAZS00ylxj6tAS"
        ></stripe-buy-button>
      </div>
    </>
  );
}
