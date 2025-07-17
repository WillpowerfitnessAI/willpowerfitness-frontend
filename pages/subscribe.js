'use client';
import React, { useEffect } from 'react';

export default function SubscribePage() {
  useEffect(() => {
    if (!window.customElements.get('stripe-buy-button')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Join WillpowerFitness AI</h1>
      <p>Train smarter. Think stronger. Move better.</p>

      <stripe-buy-button
        buy-button-id="buy_btn_1Rk2BwIW2TDvX8i08lvj2TXd"
        publishable-key="pk_live_51RWp4dIw2TDvX8i03Cm21H03ZhWTmtkK0voD2mKiHfKIZDK7AdILcWQSDxLOv0BJzR1MLP00Kt1IW1PTf9MGGEAZS00y1xj6tAS">
      </stripe-buy-button>
    </div>
  );
}
