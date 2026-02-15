import React, { useState, useEffect } from 'react';
import { Shield, Ghost, Box, DoorOpen, Footprints, Eye } from 'lucide-react';
import { Player } from '../types';

interface HidingGameProps {
  onComplete: (scoreP1: number, scoreP2: number) => void;
}

const SPOTS = [
  { id: 'armor', label: 'Rüstung', icon: <Shield size={48} /> },
  { id: 'cloak', label: 'Tarnumhang', icon: <Ghost size={48} /> },
  { id: 'chest', label: 'Truhe', icon: <Box size={48} /> },
  { id: 'closet', label: 'Besenschrank', icon: <DoorOpen size={48} /> },
];

export const HidingGame: React.FC<HidingGameProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'P1_CHOOSE' | 'P2_CHOOSE' | 'SEARCHING' | 'RESULT'>('P1_CHOOSE');
  const [p1Spot, setP1Spot] = useState<string | null>(null);
  const [p2Spot, setP2Spot] = useState<string | null>(null);
  const [dumbledoreSpots, setDumbledoreSpots] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("Hermine (P1), wähle ein Versteck!");

  const handleSpotClick = (spotId: string) => {
    if (phase === 'P1_CHOOSE') {
      setP1Spot(spotId);
      setPhase('P2_CHOOSE');
      setStatusMessage("Ron (P2), schnell! Wähle dein Versteck!");
    } else if (phase === 'P2_CHOOSE') {
      // Prevent choosing same spot? Let's allow simple logic for now, but usually hiding needs distinct spots or they crash into each other.
      // Let's enforce distinct spots for better gameplay.
      if (spotId === p1Spot) {
        setStatusMessage("Da versteckt sich schon Hermine! Such dir was anderes!");
        return;
      }
      setP2Spot(spotId);
      startDumbledoreSearch();
    }
  };

  const startDumbledoreSearch = () => {
    setPhase('SEARCHING');
    setStatusMessage("Pscht! Dumbledore kommt...");
    
    // Simulate searching delay
    setTimeout(() => {
      // Dumbledore checks 1 or 2 random spots
      const numChecks = Math.random() > 0.5 ? 1 : 2;
      const shuffled = [...SPOTS].sort(() => 0.5 - Math.random());
      const checked = shuffled.slice(0, numChecks).map(s => s.id);
      
      setDumbledoreSpots(checked);
      setPhase('RESULT');
      calculateResults(checked);
    }, 3000);
  };

  const calculateResults = (checkedSpots: string[]) => {
    // Need to access the state values, but inside timeout closure they might be stale if not careful.
    // However, since we transition phases, we can do calculation here based on what we passed or just re-read state in render logic.
    // We need to pass scores back up.
    
    // BUT: p2Spot isn't set in state immediately for this closure execution context if we used the variable directly from scope? 
    // Actually, we are calling this function *from* the handler where we set P2 spot. 
    // To be safe, let's pass P2 spot as arg or rely on React updating.
    // Better: split calculation to a useEffect or immediate execution.
  };

  // Use Effect to handle result calculation once phase changes to RESULT
  useEffect(() => {
    if (phase === 'RESULT' && p1Spot && p2Spot) {
      let p1Score = 0;
      let p2Score = 0;
      let msg = "";

      const p1Caught = dumbledoreSpots.includes(p1Spot);
      const p2Caught = dumbledoreSpots.includes(p2Spot);

      if (p1Caught) {
        p1Score = -20;
        msg += "Hermine wurde entdeckt! (-20 Pkt). ";
      } else {
        p1Score = 50;
        msg += "Hermine ist sicher (+50 Pkt). ";
      }

      if (p2Caught) {
        p2Score = -20;
        msg += "Ron wurde entdeckt! (-20 Pkt).";
      } else {
        p2Score = 50;
        msg += "Ron ist sicher (+50 Pkt).";
      }

      setStatusMessage(msg);

      // Auto proceed after showing result
      setTimeout(() => {
        onComplete(p1Score, p2Score);
      }, 5000);
    }
  }, [phase, dumbledoreSpots, p1Spot, p2Spot, onComplete]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-hogwarts-dark/90 rounded-xl border-4 border-hogwarts-gold shadow-2xl relative min-h-[500px] flex flex-col items-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden rounded-lg opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-900/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-900/40 rounded-full blur-3xl"></div>
      </div>

      <h2 className="text-3xl font-cinzel text-hogwarts-gold mb-8 z-10 drop-shadow-lg text-center">
        {phase === 'RESULT' ? 'Das Urteil' : 'Versteck dich!'}
      </h2>

      <div className="flex-1 w-full flex flex-col items-center z-10">
        
        {/* Status Area */}
        <div className="bg-black/60 px-8 py-4 rounded-lg border border-hogwarts-gold/30 mb-8 backdrop-blur-md">
          <p className="text-xl font-serif text-hogwarts-parchment animate-pulse">{statusMessage}</p>
        </div>

        {/* Dumbledore Searching Animation */}
        {phase === 'SEARCHING' && (
           <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center flex-col gap-6 rounded-lg backdrop-blur-sm">
              <Footprints className="text-hogwarts-parchment w-20 h-20 animate-bounce opacity-50" />
              <p className="text-2xl font-cinzel text-hogwarts-gold">Dumbledore sucht...</p>
           </div>
        )}

        {/* Spots Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {SPOTS.map((spot) => {
            const isP1Selected = p1Spot === spot.id;
            const isP2Selected = p2Spot === spot.id;
            const isCheckedByDumbledore = dumbledoreSpots.includes(spot.id);
            const isRevealed = phase === 'RESULT';

            let borderClass = "border-hogwarts-gold/30";
            let bgClass = "bg-hogwarts-parchment/10";
            
            if (isP1Selected) {
               borderClass = "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
               bgClass = "bg-red-900/30";
            }
            if (isP2Selected) {
               borderClass = "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
               bgClass = "bg-blue-900/30";
            }

            if (isRevealed && isCheckedByDumbledore) {
               borderClass = "border-hogwarts-gold shadow-[0_0_30px_rgba(255,255,255,0.8)]";
               bgClass = "bg-white/20";
            }

            return (
              <button
                key={spot.id}
                onClick={() => handleSpotClick(spot.id)}
                disabled={phase !== 'P1_CHOOSE' && phase !== 'P2_CHOOSE'}
                className={`
                  relative h-48 rounded-lg border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300
                  ${borderClass} ${bgClass}
                  ${(phase === 'P1_CHOOSE' || phase === 'P2_CHOOSE') ? 'hover:scale-105 hover:bg-hogwarts-parchment/20 cursor-pointer' : 'cursor-default'}
                `}
              >
                <div className={`text-hogwarts-parchment transition-all ${isCheckedByDumbledore && isRevealed ? 'scale-125 text-white' : ''}`}>
                  {spot.icon}
                </div>
                <span className="font-cinzel text-hogwarts-gold font-bold tracking-wider">{spot.label}</span>

                {/* Markers */}
                {isP1Selected && !isRevealed && <div className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full shadow-lg"></div>}
                {isP2Selected && !isRevealed && <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full shadow-lg"></div>}

                {/* Result Overlay */}
                {isRevealed && isCheckedByDumbledore && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                      <Eye className="text-white w-16 h-16 drop-shadow-[0_0_10px_white]" />
                   </div>
                )}
                
                {isRevealed && !isCheckedByDumbledore && (isP1Selected || isP2Selected) && (
                   <div className="absolute bottom-2 right-2">
                      <span className="text-green-400 font-bold text-xl">✓</span>
                   </div>
                )}

              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};