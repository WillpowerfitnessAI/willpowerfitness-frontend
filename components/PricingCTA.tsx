// components/PricingCTA.tsx
import { useState } from 'react';
import { startCheckout } from '../lib/checkout'; // keep relative import

export default function PricingCTA() {
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-3">
      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={() => startCheckout(email)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Join WillpowerFitness AI
      </button>
    </div>
  );
}
