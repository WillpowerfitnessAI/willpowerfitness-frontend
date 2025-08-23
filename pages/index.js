// pages/index.js (or wherever those buttons live)
const trialUrl = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

function goToTrial() {
  if (typeof window !== 'undefined' && trialUrl) {
    window.location.href = trialUrl;
  }
}

export default function Home() {
  return (
    <>
      {/* Keep this pointing to your consultation page */}
      <a href="/consultation" className="btn">Start free consultation</a>

      {/* Trial / membership go to Stripe Payment Link */}
      <button onClick={goToTrial} className="btn">Start Trial</button>

      {/* If you want “See membership” to also go to the same link: */}
      {/* <button onClick={goToTrial} className="btn">See membership</button> */}
    </>
  );
}
