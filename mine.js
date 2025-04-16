import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Howl } from 'howler';

export default function Mine() {
  const [mined, setMined] = useState(0);
  const [mining, setMining] = useState(false);
  const [hashRate, setHashRate] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [referrer, setReferrer] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const mineSound = new Howl({ src: ['/sounds/mine.mp3'], volume: 0.5 });

  const treasury = '0x5685fC3E9Bc12e0a6FC7CC751746047D494dDF3f';
  const basicCost = ethers.parseEther("0.01");
  const proCost = ethers.parseEther("0.1");

  const mine = async (isPro) => {
    try {
      setMining(true);
      mineSound.play();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: treasury,
        value: isPro ? proCost : basicCost
      });
      await tx.wait();

      const gained = isPro ? 10 : 3;
      const rate = isPro ? 300 : 100;

      setXp(xp + gained);
      setMined((prev) => prev + gained);
      setHashRate(rate);

      const newLevel = Math.floor((xp + gained) / 20) + 1;
      setLevel(newLevel);
      updateLeaderboard(newLevel);

      setMining(false);
    } catch (e) {
      alert("Mining failed");
      setMining(false);
    }
  };

  const updateLeaderboard = (level) => {
    const address = window.ethereum.selectedAddress;
    const existing = leaderboard.find((entry) => entry.address === address);
    if (existing) {
      existing.level = level;
    } else {
      leaderboard.push({ address, level });
    }
    setLeaderboard([...leaderboard].sort((a, b) => b.level - a.level));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setReferrer(ref);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-black to-indigo-900 opacity-40 blur-xl animate-pulse z-0" />

      <div className="z-10 relative max-w-xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
          Mine $HODL
        </h2>
        <p className="text-sm text-gray-300 mb-4">Ref: {referrer || 'None'}</p>

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => mine(false)}
            disabled={mining}
            className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-full"
          >
            Basic Rig (0.01 ETH)
          </button>
          <button
            onClick={() => mine(true)}
            disabled={mining}
            className="bg-yellow-400 hover:bg-yellow-300 px-6 py-3 rounded-full"
          >
            Pro Rig (0.1 ETH)
          </button>
        </div>

        <p className="mb-2">Hashrate: {hashRate} H/s</p>
        <p>XP: {xp} | Level: {level}</p>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Top Miners</h3>
          <ul className="text-sm text-left max-h-40 overflow-y-auto bg-gray-900 p-4 rounded-lg">
            {leaderboard.map((entry, i) => (
              <li key={i}>{entry.address.slice(0, 6)}...{entry.address.slice(-4)} – Level {entry.level}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
