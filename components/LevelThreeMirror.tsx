import React, { useState, useEffect, useRef } from 'react';
import { Gem, Gift, Trophy, Wand2, Eye } from 'lucide-react';
import { Player } from '../types';

interface LevelThreeProps {
  currentPlayer: Player;
  onComplete: (score: number) => void;
}

const ITEMS = [
  { id: 'stone', icon: <Gem size={80} className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />, label: "Stein der Weisen" },
  { id: 'wand', icon: <Wand2 size={80} className="text-gray-400" />, label: "Mächtigster Zauberstab" },
  { id: 'trophy', icon: <Trophy size={80} className="text-yellow-500" />, label: "Quidditch Pokal" },
  { id: 'fame', icon: <Gift size={80} className="text-purple-500" />, label: "Ruhm & Ehre" },
];

export const LevelThreeMirror: React.FC<LevelThreeProps> = ({ currentPlayer, onComplete }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("Klicke 'WÜNSCHEN', wenn du den Stein siehst!");
  const [isSpinning, setIsSpinning] = useState(false);
  const [flash, setFlash] = useState(false);

  const magicSound = useRef(new Audio('https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg'));
  const failSound = useRef(new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'));

  const MAX_SUCCESSES = 3;

  useEffect(() => {
    magicSound.current.volume = 0.5;
    failSound.current.volume = 0.4;
    startCycle();
    return () => stopCycle();
  }, []);

  const intervalRef = useRef<number | null>(null);

  const startCycle = () => {
    setIsSpinning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Geschwindigkeit variiert
    const speed = 600 - (attempts * 50); 
    
    intervalRef.current = window.setInterval(() => {
      setCurrentItemIndex(prev => (prev + 1) % ITEMS.length);
    }, Math.max(200, speed));
  };

  const stopCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSpinning(false);
  };

  const handleAction = () => {
    if (!isSpinning) return;
    
    stopCycle();
    const currentItem = ITEMS[currentItemIndex];

    if (currentItem.id === 'stone') {
      setFlash(true);
      magicSound.current.currentTime = 0;
      magicSound.current.play().catch(() => {});
      setMessage("Ich sehe... den Stein! Er ist in meiner Tasche!");
      setScore(s => s + 100);
      
      setTimeout(() => {
        setFlash(false);
        if (attempts + 1 >= MAX_SUCCESSES) {
          onComplete(score + 100);
        } else {
          setAttempts(a => a + 1);
          setMessage("Der Spiegel verschwimmt...");
          setTimeout(startCycle, 1000);
        }
      }, 1500);

    } else {
      failSound.current.currentTime = 0;
      failSound.current.play().catch(() => {});
      setMessage(`Nein! Ich sehe nur ${currentItem.label}...`);
      setScore(s => Math.max(0, s - 20));
      
      setTimeout(() => {
        setMessage("Konzentriere dich auf dein tiefstes Begehren!");
        startCycle();
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 relative">
       {/* Mirror Frame */}
       <div className="relative bg-gray-800 rounded-t-full rounded-b-lg border-[12px] border-hogwarts-gold shadow-2xl p-10 h-[500px] flex flex-col items-center justify-between overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
          
          {/* Reflection Surface */}
          <div className={`absolute inset-4 rounded-t-full rounded-b-md bg-gradient-to-b from-blue-900/30 to-black border border-white/10 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${flash ? 'bg-white/80' : ''}`}>
             
             {/* The Item */}
             <div className="transform scale-125 transition-all duration-200">
               {ITEMS[currentItemIndex].icon}
             </div>

             {/* Mirror Shine Effect */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
          </div>

          <div className="z-10 mt-auto w-full text-center space-y-4">
            <h3 className="font-cinzel text-hogwarts-gold text-xl drop-shadow-md tracking-wider border-b border-white/10 pb-2">
              Der Spiegel Nerhegeb
            </h3>
            <p className="text-gray-300 font-serif min-h-[50px]">{message}</p>
            
            <div className="flex justify-between items-center px-4 mb-2">
               <span className="text-hogwarts-gold font-bold">{score} Pkt</span>
               <span className="text-gray-400 text-sm">Runde {attempts + 1}/{MAX_SUCCESSES}</span>
            </div>

            <button
              onClick={handleAction}
              disabled={!isSpinning}
              className="w-full py-4 bg-hogwarts-gold/90 hover:bg-white text-hogwarts-dark font-cinzel font-bold text-xl rounded shadow-[0_0_20px_rgba(211,166,37,0.4)] transition-all flex items-center justify-center gap-2 border border-white/20"
            >
              <Eye size={20} /> DAS WÜNSCHE ICH MIR!
            </button>
          </div>

          {/* Inscription */}
          <div className="absolute top-2 text-[8px] text-hogwarts-gold/40 font-serif tracking-[0.2em] w-3/4 text-center uppercase">
            Erised stra ehru oyt ube cafru oyt on wohsi
          </div>
       </div>
    </div>
  );
};