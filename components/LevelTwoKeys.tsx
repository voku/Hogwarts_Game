import React, { useState, useEffect, useRef } from 'react';
import { Key } from 'lucide-react';
import { Player } from '../types';

interface LevelTwoProps {
  currentPlayer: Player;
  onComplete: (score: number) => void;
}

interface FlyingObject {
  id: number;
  x: number;
  y: number;
  isTarget: boolean;
  rotation: number;
}

export const LevelTwoKeys: React.FC<LevelTwoProps> = ({ currentPlayer, onComplete }) => {
  const [keys, setKeys] = useState<FlyingObject[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(false);
  const [message, setMessage] = useState("Fange den goldenen Flügel-Schlüssel!");
  
  const catchSound = useRef(new Audio('https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg'));
  const missSound = useRef(new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg')); // Subtle miss sound

  useEffect(() => {
    catchSound.current.volume = 0.4;
    missSound.current.volume = 0.3;
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGame = () => {
    setGameActive(true);
    generateKeys();
  };

  const generateKeys = () => {
    const newKeys: FlyingObject[] = [];
    // 1 Target key
    newKeys.push({
      id: 0,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      isTarget: true,
      rotation: Math.random() * 360
    });
    // Distraction keys
    for (let i = 1; i < 7; i++) {
      newKeys.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        isTarget: false,
        rotation: Math.random() * 360
      });
    }
    setKeys(newKeys);
  };

  // Game Loop for movement and timer
  useEffect(() => {
    if (!gameActive) return;

    const moveInterval = setInterval(() => {
      setKeys(prevKeys => prevKeys.map(k => ({
        ...k,
        x: Math.max(5, Math.min(90, k.x + (Math.random() - 0.5) * 15)), // Rapid erratic movement
        y: Math.max(5, Math.min(90, k.y + (Math.random() - 0.5) * 15)),
        rotation: k.rotation + (Math.random() * 40 - 20)
      })));
    }, 400);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          clearInterval(moveInterval);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(moveInterval);
      clearInterval(timerInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameActive]);

  const endGame = () => {
    setGameActive(false);
    setMessage("Die Zeit ist um!");
    setTimeout(() => {
      onComplete(score);
    }, 2000);
  };

  const handleKeyClick = (isTarget: boolean) => {
    if (!gameActive) return;

    if (isTarget) {
      catchSound.current.currentTime = 0;
      catchSound.current.play().catch(() => {});
      setScore(s => s + 50); // Big points for target
      // Respawn instantly
      generateKeys();
    } else {
      missSound.current.currentTime = 0;
      missSound.current.play().catch(() => {});
      setScore(s => Math.max(0, s - 10)); // Penalty
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 bg-black/40 rounded-xl border-4 border-hogwarts-gold shadow-2xl relative overflow-hidden h-[550px] cursor-crosshair backdrop-blur-sm">
      
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-20 text-white bg-black/60 p-3 rounded-lg border border-white/10 backdrop-blur-md">
        <div className="font-cinzel font-bold text-lg text-hogwarts-gold">{currentPlayer === 'Spieler 1' ? 'Hermine' : 'Ron'}</div>
        <div className="font-serif italic text-white/90">{message}</div>
        <div className="font-cinzel text-xl text-hogwarts-red font-bold flex gap-4">
          <span>{timeLeft}s</span>
          <span className="text-white">|</span>
          <span>{score} Pkt</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="w-full h-full relative">
        {gameActive && keys.map((keyObj) => (
          <button
            key={keyObj.id}
            onMouseDown={(e) => {
                e.stopPropagation(); // Prevent drag issues
                handleKeyClick(keyObj.isTarget);
            }}
            className="absolute transition-all duration-500 ease-out transform hover:scale-110 active:scale-90 touch-manipulation"
            style={{
              left: `${keyObj.x}%`,
              top: `${keyObj.y}%`,
              transform: `rotate(${keyObj.rotation}deg)`
            }}
          >
            <div className={`relative p-3 rounded-full ${keyObj.isTarget ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-[0_0_25px_rgba(250,204,21,0.6)]' : 'bg-gray-500/30 blur-[0.5px]'}`}>
               <Key 
                 className={`${keyObj.isTarget ? 'text-white w-8 h-8 drop-shadow-md' : 'text-gray-400 w-6 h-6'}`} 
               />
               
               {/* Wings */}
               {/* Left Wing */}
               <div 
                 className={`absolute top-1 -left-3 w-6 h-3 bg-white/40 rounded-[100%_0_0_100%] origin-right 
                 ${keyObj.isTarget ? 'animate-[wingLeftFast_0.08s_ease-in-out_infinite]' : 'animate-[wingLeft_0.15s_ease-in-out_infinite]'}`} 
               />
               {/* Right Wing */}
               <div 
                 className={`absolute top-1 -right-3 w-6 h-3 bg-white/40 rounded-[0_100%_100%_0] origin-left 
                 ${keyObj.isTarget ? 'animate-[wingRightFast_0.08s_ease-in-out_infinite]' : 'animate-[wingRight_0.15s_ease-in-out_infinite]'}`} 
               />
            </div>
          </button>
        ))}
      </div>
      
      <style>{`
        @keyframes wingLeft {
          0%, 100% { transform: rotate(10deg) scaleY(1); }
          50% { transform: rotate(-30deg) scaleY(0.85); }
        }
        @keyframes wingRight {
          0%, 100% { transform: rotate(-10deg) scaleY(1); }
          50% { transform: rotate(30deg) scaleY(0.85); }
        }
        @keyframes wingLeftFast {
          0%, 100% { transform: rotate(15deg) scaleY(1); }
          50% { transform: rotate(-45deg) scaleY(0.7); }
        }
        @keyframes wingRightFast {
          0%, 100% { transform: rotate(-15deg) scaleY(1); }
          50% { transform: rotate(45deg) scaleY(0.7); }
        }
      `}</style>
    </div>
  );
};