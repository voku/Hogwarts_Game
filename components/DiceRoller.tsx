import React, { useState } from 'react';
import { Dices } from 'lucide-react';
import { DiceEffect } from '../types';

interface DiceRollerProps {
  onRollComplete: (effect: DiceEffect) => void;
}

const EFFECTS: DiceEffect[] = [
  { label: 'Felix Felicis', effect: 'bonus', description: 'Du hast Glück! +10 Startpunkte.' },
  { label: 'Nebel', effect: 'malus', description: 'Es ist dunkel. Du hast weniger Zeit!' },
  { label: 'Normaler Tag', effect: 'neutral', description: 'Nichts passiert.' },
  { label: 'Schoko-Frosch', effect: 'bonus', description: 'Ein Energieschub! Die Musik fällt dir leichter.' },
  { label: 'Peeves', effect: 'malus', description: 'Peeves nervt dich. Es wird schwieriger!' },
  { label: 'Hauspunkte', effect: 'bonus', description: '5 Punkte für Gryffindor!' },
];

export const DiceRoller: React.FC<DiceRollerProps> = ({ onRollComplete }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState<number>(1);

  const rollDice = () => {
    setIsRolling(true);
    let rolls = 0;
    const interval = setInterval(() => {
      setCurrentFace(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 15) {
        clearInterval(interval);
        setIsRolling(false);
        const randomEffect = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
        onRollComplete(randomEffect);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 border-4 border-hogwarts-gold rounded-xl bg-hogwarts-parchment/90 shadow-2xl">
      <h2 className="text-2xl font-serif text-hogwarts-red font-bold">Der Zufalls-Würfel</h2>
      
      <div className={`transition-transform duration-200 ${isRolling ? 'animate-spin' : ''}`}>
        <div className="w-24 h-24 bg-white border-4 border-black rounded-xl flex items-center justify-center text-4xl font-bold shadow-inner">
          {currentFace}
        </div>
      </div>

      <button
        onClick={rollDice}
        disabled={isRolling}
        className="flex items-center gap-2 px-6 py-3 bg-hogwarts-red text-white font-bold rounded-lg shadow hover:bg-red-800 disabled:opacity-50"
      >
        <Dices />
        Würfeln
      </button>
    </div>
  );
};
