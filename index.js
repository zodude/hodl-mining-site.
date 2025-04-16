import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
        HODL MINING
      </h1>
      <p className="mt-4 text-lg">Mine $HODL with trippy vibes, XP, and rewards.</p>
      <Link href="/mine" className="mt-8 bg-green-600 px-6 py-3 rounded-full hover:bg-green-500">
        Start Mining
      </Link>
    </main>
  );
}
