// pages/subscribe.js
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import supabase from "../utils/supabaseClient";

export default function Subscribe() {
  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase.from("user_profiles").select("*");
      console.log("🚀 Supabase test result:", { data, error });
    }
    testSupabase();
  }, []);

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
          buy-button-id="buy_btn_1Rk2WB1w2TDvX8i03vytJ2fXd"
          publishable-key="pk_live_51RWp4dIw2TDvX8i03cm210H32WTmtKkOvoD2mKiHfKIZDK7AdiLCWQSDxLoV0BjZR1MLP00k1IW1PTF9MGGEAZS0yLxj6tAS"
        ></stripe-buy-button>
      </div>
    </>
  );
}
