export const metadata = {
  title: 'WillpowerFitness AI',
  description: 'Your personal AI training assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
