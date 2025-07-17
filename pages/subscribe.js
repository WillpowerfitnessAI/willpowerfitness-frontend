return (
  <>
    <Head>
      <title>Join WillpowerFitness AI</title>
      <script async src="https://js.stripe.com/v3/buy-button.js"></script>
    </Head>

    <main style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Join WillpowerFitness AI</h1>
      <p>Train smarter. Think stronger. Move better.</p>

      <div
        dangerouslySetInnerHTML={{
          __html: `
            <stripe-buy-button
              buy-button-id="buy_btn_1kRzWbIw2TDvX8i08vIj2fXd"
              publishable-key="pk_live_51RWp4dIw2TDvX8i03cm2t0H32WTmtkK0voD2mKifHkIZDK7AdiLCWQSDxLoV0BjZR1MLPe0o0Kt1lW1PTF9MGGEAZS0y1xj6tAS">
            </stripe-buy-button>
          `,
        }}
      />
    </main>
  </>
);
