import React, { useState, useEffect, useRef } from 'react';
import { Flame, Zap, Shield, Skull } from 'lucide-react';
import { Player } from '../types';

interface FinalBossProps {
  currentPlayer: Player;
  onComplete: (score: number) => void;
}

type SpellColor = 'red' | 'blue' | 'green' | 'yellow';

const SPELLS: { id: SpellColor; label: string; icon: React.ReactNode; color: string; ringColor: string }[] = [
  { id: 'red', label: 'Expelliarmus', icon: <Flame size={32} />, color: 'bg-red-600', ringColor: 'ring-red-500' },
  { id: 'blue', label: 'Stupefy', icon: <Zap size={32} />, color: 'bg-blue-600', ringColor: 'ring-blue-500' },
  { id: 'green', label: 'Avada...', icon: <Skull size={32} />, color: 'bg-green-600', ringColor: 'ring-green-500' },
  { id: 'yellow', label: 'Protego', icon: <Shield size={32} />, color: 'bg-yellow-500', ringColor: 'ring-yellow-500' },
];

export const FinalBossDuel: React.FC<FinalBossProps> = ({ currentPlayer, onComplete }) => {
  const [sequence, setSequence] = useState<SpellColor[]>([]);
  const [playerSequence, setPlayerSequence] = useState<SpellColor[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeSpell, setActiveSpell] = useState<SpellColor | null>(null);
  const [visualEffect, setVisualEffect] = useState<{ color: SpellColor, id: number } | null>(null);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState("Voldemort bereitet einen Zauber vor...");
  const [score, setScore] = useState(0);

  const MAX_ROUNDS = 5;
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Init Audio Context on user interaction usually, but here on mount for game flow
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    audioContext.current = new AudioCtx();
    
    startNewRound();
    return () => {
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playSpellSound = (spellId: SpellColor) => {
    if (!audioContext.current) return;
    const ctx = audioContext.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (spellId) {
        case 'red': // Expelliarmus - Fire/Blast (Pitch drop)
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
        case 'blue': // Stupefy - Zap (High freq blip)
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.linearRampToValueAtTime(200, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
        case 'green': // Avada - Ominous (Low rumble)
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.6);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
            break;
        case 'yellow': // Protego - Shield (Harmonious sine)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.linearRampToValueAtTime(880, now + 0.4);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
    }
  };

  const playErrorSound = () => {
    if (!audioContext.current) return;
    const ctx = audioContext.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  const startNewRound = () => {
    setPlayerSequence([]);
    setMessage(`Runde ${round}: Merk dir die Formel!`);
    setIsPlayingSequence(true);
    setVisualEffect(null);
    
    // Add new random spell to sequence
    const randomSpell = SPELLS[Math.floor(Math.random() * SPELLS.length)].id;
    setSequence(prev => {
      const newSeq = [...prev, randomSpell];
      playSequenceAnimation(newSeq);
      return newSeq;
    });
  };

  const playSequenceAnimation = async (seq: SpellColor[]) => {
    await new Promise(r => setTimeout(r, 1000)); // Initial delay

    for (let i = 0; i < seq.length; i++) {
      const color = seq[i];
      
      setActiveSpell(color);
      setVisualEffect({ color, id: Date.now() });
      playSpellSound(color);
      
      await new Promise(r => setTimeout(r, 600)); // Light up duration
      setActiveSpell(null);
      await new Promise(r => setTimeout(r, 200)); // Gap between notes
    }
    
    setVisualEffect(null);
    setIsPlayingSequence(false);
    setMessage("Jetzt du! Wiederhole den Zauber!");
  };

  const handlePlayerClick = (color: SpellColor) => {
    if (isPlayingSequence) return;

    playSpellSound(color);
    
    // Visual feedback
    setActiveSpell(color);
    setVisualEffect({ color, id: Date.now() });
    setTimeout(() => setActiveSpell(null), 200);

    const newPlayerSeq = [...playerSequence, color];
    setPlayerSequence(newPlayerSeq);

    // Check Logic
    const currentIndex = newPlayerSeq.length - 1;
    if (color !== sequence[currentIndex]) {
      // Game Over / Fail logic
      playErrorSound();
      setMessage("Falscher Zauber! Der Fluch trifft dich!");
      setScore(s => Math.max(0, s - 50));
      setVisualEffect({ color: 'green', id: Date.now() }); // Enemy hits you with green spell visual
      setTimeout(() => {
         setPlayerSequence([]);
         setMessage("Versuch es noch einmal...");
         playSequenceAnimation(sequence);
      }, 1500);
      return;
    }

    // Correct input so far
    if (newPlayerSeq.length === sequence.length) {
      // Round Complete
      setScore(s => s + 50);
      setTimeout(() => setVisualEffect(null), 500); // Clear effect

      if (round >= MAX_ROUNDS) {
        setMessage("Voldemort ist besiegt!");
        setTimeout(() => onComplete(score + 100), 1500);
      } else {
        setMessage("Gut gemacht! Es wird schneller...");
        setRound(r => r + 1);
        setTimeout(startNewRound, 1000);
      }
    }
  };

  // Render Visual Effect
  const renderVisualEffect = () => {
    if (!visualEffect) return null;
    const { color, id } = visualEffect;
    
    let effectClass = "";
    let innerContent = null;

    switch(color) {
        case 'red': 
            // Expanding Fireball
            effectClass = "bg-red-500/60 shadow-[0_0_50px_red] animate-[ping_0.5s_ease-out] rounded-full";
            break;
        case 'blue': 
            // Lightning Flash
            effectClass = "bg-blue-400/80 shadow-[0_0_60px_blue] animate-[pulse_0.2s_ease-in-out_infinite] rounded-full skew-x-12";
            innerContent = <Zap className="text-white w-full h-full animate-bounce" />;
            break;
        case 'green': 
            // Skull Smoke
            effectClass = "bg-green-600/50 shadow-[0_0_50px_#22c55e] animate-bounce rounded-full blur-md";
            innerContent = <Skull className="text-green-900 w-full h-full opacity-50" />;
            break;
        case 'yellow': 
            // Shield Expansion
            effectClass = "border-4 border-yellow-400 bg-yellow-200/20 shadow-[0_0_40px_yellow] animate-[spin_1s_linear_infinite] rounded-full";
            break;
    }

    return (
        <div key={id} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
             <div className={`w-48 h-48 ${effectClass} flex items-center justify-center`}>
                {innerContent}
             </div>
        </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-900 rounded-xl border-4 border-purple-900 shadow-[0_0_50px_rgba(88,28,135,0.5)] relative flex flex-col items-center min-h-[500px] overflow-hidden">
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-50 pointer-events-none rounded-lg"></div>

      <h2 className="text-3xl font-cinzel text-purple-400 mb-2 drop-shadow-lg z-30 relative">Das letzte Duell</h2>
      <p className="text-gray-300 font-serif mb-4 min-h-[1.5em] text-center z-30 animate-pulse relative">{message}</p>

      {/* Visual Effects Layer */}
      {renderVisualEffect()}

      {/* Voldemort / Enemy Visual */}
      <div className="mb-10 relative z-10 mt-4">
         <div className={`w-32 h-32 bg-black rounded-full border-4 border-purple-600 shadow-[0_0_40px_rgba(147,51,234,0.6)] flex items-center justify-center transition-transform duration-300 ${visualEffect ? 'scale-90' : 'scale-100'}`}>
            <div className="absolute inset-0 rounded-full border border-purple-400/30 animate-ping"></div>
            {visualEffect && visualEffect.color === 'green' ? (
                <Skull className="text-green-500 w-16 h-16 animate-pulse" />
            ) : (
                <Zap className={`text-purple-500 w-16 h-16 ${isPlayingSequence ? 'animate-pulse' : ''}`} />
            )}
         </div>
      </div>

      {/* Spells Grid */}
      <div className="grid grid-cols-2 gap-8 relative z-30">
        {SPELLS.map((spell) => {
          const isActive = activeSpell === spell.id;
          return (
            <button
              key={spell.id}
              onClick={() => handlePlayerClick(spell.id)}
              disabled={isPlayingSequence}
              className={`
                w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center gap-2 transition-all duration-150 relative overflow-hidden group
                ${isActive 
                  ? `${spell.color} border-white scale-110 shadow-[0_0_30px_white]` 
                  : `bg-gray-800 border-gray-600 hover:border-gray-400 hover:bg-gray-750 opacity-90`
                }
              `}
            >
              {/* Button inner glow on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${spell.color}`}></div>

              <div className={`transition-transform duration-200 ${isActive ? 'scale-125 text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                {spell.icon}
              </div>
              <span className={`font-cinzel text-xs font-bold tracking-widest ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                {spell.label}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="z-10 text-purple-300 font-cinzel mt-auto pt-6">
         Runde {round} / {MAX_ROUNDS} | Punkte: {score}
      </div>
    </div>
  );
};