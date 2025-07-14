'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem' }}>
      <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(45deg, #ccc, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        WillpowerFitness AI
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Your Personal AI Fitness Coach</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <stripe-buy-button
          buy-button-id="buy_btn_1Rk2WBIw2TDvX8i08lvj2TXd"
          publishable-key="pk_live_51RWp4dIw2TDvX8i0Jcm21OH32WTmtKkOvoD2mKiHfkIZDK7AdiLCWQSDxLoVOBJzR1MLP0O0kIIw1PTF9MGGEAZS00ylxj6tAS"
        >
        </stripe-buy-button>
      </div>
    </div>
  );
}
