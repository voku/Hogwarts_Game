import React, { useState, useEffect, useRef } from 'react';
import { Music, Dog } from 'lucide-react';
import { Player } from '../types';

interface LevelOneProps {
  currentPlayer: Player;
  onComplete: (score: number) => void;
}

export const LevelOneFluffy: React.FC<LevelOneProps> = ({ currentPlayer, onComplete }) => {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [targetZone, setTargetZone] = useState({ start: 40, width: 20 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("Drücke 'SPIELEN', wenn der Balken im Grünen ist!");
  
  const requestRef = useRef<number>();
  const speedRef = useRef(1.5);
  
  // Sounds
  const growlSound = useRef(new Audio('https://actions.google.com/sounds/v1/animals/dog_growl.ogg'));
  const chimeSound = useRef(new Audio('https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg'));

  const MAX_ATTEMPTS = 5;

  useEffect(() => {
    setIsPlaying(true);
    // Preload sounds
    growlSound.current.volume = 0.5;
    chimeSound.current.volume = 0.5;
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  const animate = () => {
    setPosition(prev => {
      let next = prev + speedRef.current * direction;
      if (next > 100 || next < 0) {
        setDirection(d => d * -1);
        next = prev + speedRef.current * (direction * -1);
      }
      return next;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current!);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, direction]);

  const handleStop = () => {
    if (!isPlaying) return;
    
    setIsPlaying(false);
    const hitStart = targetZone.start;
    const hitEnd = targetZone.start + targetZone.width;
    
    let points = 0;
    if (position >= hitStart && position <= hitEnd) {
      points = 100;
      setMessage("Perfekt! Die Harfe spielt sanft...");
      chimeSound.current.currentTime = 0;
      chimeSound.current.play().catch(() => {});
    } else if (position >= hitStart - 10 && position <= hitEnd + 10) {
      points = 50;
      setMessage("Knapp! Er blinzelt...");
      // Soft chime or nothing
    } else {
      points = 0;
      setMessage("Falscher Ton! Fluffy knurrt!");
      growlSound.current.currentTime = 0;
      growlSound.current.play().catch(() => {});
    }

    setScore(s => s + points);

    setTimeout(() => {
      if (attempts + 1 >= MAX_ATTEMPTS) {
        onComplete(score + points);
      } else {
        setAttempts(a => a + 1);
        // Randomize next target
        const newStart = Math.random() * 80;
        setTargetZone({ start: newStart, width: 15 + Math.random() * 10 });
        speedRef.current += 0.2; // Increase difficulty
        setPosition(0);
        setIsPlaying(true);
        setMessage("Bereit für die nächste Note...");
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-hogwarts-parchment rounded-xl border-4 border-hogwarts-gold shadow-2xl relative">
       <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-hogwarts-dark"></div>
       <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-hogwarts-dark"></div>

      <div className="flex justify-between items-center mb-6 border-b border-hogwarts-dark/20 pb-4">
        <h3 className="text-2xl font-cinzel font-bold text-hogwarts-dark flex items-center gap-3">
          <PlayerIcon player={currentPlayer} /> 
          {currentPlayer === 'Spieler 1' ? 'Hermine' : 'Ron'}
        </h3>
        <div className="text-2xl font-cinzel font-bold text-hogwarts-red">{score} PKT</div>
      </div>

      <div className="text-center mb-10 relative">
        <div className="flex justify-center mb-6">
           {/* Visual Representation of Fluffy */}
           <div className={`transition-all duration-500 ${score > 300 ? 'opacity-40 grayscale blur-sm' : ''} relative`}>
             <Dog size={80} className="text-hogwarts-dark drop-shadow-lg" />
             <div className="absolute -right-6 top-0 animate-bounce">
               <Music size={24} className="text-hogwarts-gold" />
             </div>
           </div>
           {score > 300 && <span className="absolute top-0 right-1/3 text-6xl animate-pulse">💤</span>}
        </div>
        <p className="text-xl font-serif font-bold text-hogwarts-dark mb-2 min-h-[30px]">{message}</p>
        <p className="text-sm font-cinzel text-gray-600 tracking-widest">VERSUCH {attempts + 1} / {MAX_ATTEMPTS}</p>
      </div>

      {/* Rhythm Bar */}
      <div className="relative h-14 bg-black/80 rounded-lg overflow-hidden border-2 border-hogwarts-gold mb-10 shadow-inner">
        {/* Target Zone */}
        <div 
          className="absolute top-0 bottom-0 bg-gradient-to-r from-green-600 to-green-400 opacity-70 shadow-[0_0_15px_rgba(74,222,128,0.5)]"
          style={{ left: `${targetZone.start}%`, width: `${targetZone.width}%` }}
        />
        {/* Marker */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10 transition-transform duration-75"
          style={{ left: `${position}%` }}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleStop}
          disabled={!isPlaying}
          className="px-16 py-4 bg-hogwarts-red text-white font-cinzel font-bold text-xl rounded shadow-[0_0_20px_rgba(116,0,1,0.5)] hover:bg-red-800 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 border border-red-900"
        >
          <Music /> SPIELEN
        </button>
      </div>
    </div>
  );
};

const PlayerIcon: React.FC<{player: Player}> = ({player}) => (
  <span className={`inline-block w-4 h-4 rotate-45 border border-black ${player === 'Spieler 1' ? 'bg-red-700' : 'bg-blue-700'}`}></span>
);