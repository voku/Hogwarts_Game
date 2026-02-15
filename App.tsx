import React, { useState } from 'react';
import { GameState, Player, Scores, DiceEffect } from './types';
import { DiceRoller } from './components/DiceRoller';
import { LevelOneFluffy } from './components/LevelOneFluffy';
import { LevelTwoKeys } from './components/LevelTwoKeys';
import { LevelThreeMirror } from './components/LevelThreeMirror';
import { FinalBossDuel } from './components/FinalBossDuel';
import { HidingGame } from './components/HidingGame';
import { HogwartsMap } from './components/HogwartsMap';
import { generateStorySegment } from './services/geminiService';
import { PLAYER_ASSETS } from './services/imageService';
import { Scroll, Trophy, Wand2, Sparkles, Castle, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Spieler 1');
  const [scores, setScores] = useState<Scores>({ p1: 0, p2: 0 });
  const [storyText, setStoryText] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // Game state handlers
  const handleStartGame = async () => {
    setIsLoadingAI(true);
    // Simple sound for start
    new Audio('https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg').play().catch(() => {});
    
    const intro = await generateStorySegment(
      'INTRO', 
      { p1: 0, p2: 0 }, 
      "Spielstart vor der verbotenen Tür."
    );
    setStoryText(intro);
    setIsLoadingAI(false);
    setGameState('INTRO_STORY');
  };

  const handleNextLevel = async () => {
    if (gameState === 'INTRO_STORY') {
      setIsLoadingAI(true);
      const text = await generateStorySegment('HIDING_INTRO', scores, "Dumbledore kommt!");
      setStoryText(text);
      setIsLoadingAI(false);
      setGameState('HIDING_INTRO');
    } else if (gameState === 'HIDING_INTRO') {
      setGameState('HIDING_GAME');
    } else if (gameState === 'LEVEL_1_GAME') {
      setGameState('DICE_ROLL');
    } else if (gameState === 'DICE_ROLL') {
       setIsLoadingAI(true);
       const text = await generateStorySegment('LEVEL_2_INTRO', scores, "Schlüssel");
       setStoryText(text);
       setIsLoadingAI(false);
       setGameState('LEVEL_2_INTRO');
    } else if (gameState === 'LEVEL_2_GAME') {
      setIsLoadingAI(true);
      const text = await generateStorySegment('LEVEL_3_INTRO', scores, "Spiegel");
      setStoryText(text);
      setIsLoadingAI(false);
      setGameState('LEVEL_3_INTRO');
    } else if (gameState === 'LEVEL_3_INTRO') {
      setGameState('LEVEL_3_GAME');
    } else if (gameState === 'LEVEL_3_GAME') {
       // NEXT: Final Boss Intro instead of Victory
       setIsLoadingAI(true);
       const text = await generateStorySegment('FINAL_BOSS_INTRO', scores, "Das Finale");
       setStoryText(text);
       setIsLoadingAI(false);
       setGameState('FINAL_BOSS_INTRO');
    } else if (gameState === 'FINAL_BOSS_INTRO') {
      setGameState('FINAL_BOSS_GAME');
    } else if (gameState === 'FINAL_BOSS_GAME') {
       setIsLoadingAI(true);
       const text = await generateStorySegment(
        'VICTORY', 
        scores, 
        `${scores.p1 > scores.p2 ? 'Spieler 1' : 'Spieler 2'} hat gewonnen.`
      );
      setStoryText(text);
      setIsLoadingAI(false);
      setGameState('VICTORY');
    }
  };

  const handleHidingComplete = (scoreP1: number, scoreP2: number) => {
    setScores(prev => ({ p1: prev.p1 + scoreP1, p2: prev.p2 + scoreP2 }));
    setGameState('LEVEL_1_INTRO');
  };

  const handleLevel1Complete = (score: number) => {
    setScores(prev => ({ ...prev, [currentPlayer === 'Spieler 1' ? 'p1' : 'p2']: prev[currentPlayer === 'Spieler 1' ? 'p1' : 'p2'] + score }));
    
    if (currentPlayer === 'Spieler 1') {
      setCurrentPlayer('Spieler 2');
      alert("Spieler 2 ist dran!");
    } else {
      setCurrentPlayer('Spieler 1');
      handleNextLevel();
    }
  };

  const handleLevel2Complete = (score: number) => {
    setScores(prev => ({ ...prev, [currentPlayer === 'Spieler 1' ? 'p1' : 'p2']: prev[currentPlayer === 'Spieler 1' ? 'p1' : 'p2'] + score }));
    
    if (currentPlayer === 'Spieler 1') {
      setCurrentPlayer('Spieler 2');
      alert("Spieler 2 ist dran!");
    } else {
      handleNextLevel();
    }
  };

  const handleLevel3Complete = (score: number) => {
    setScores(prev => ({ ...prev, [currentPlayer === 'Spieler 1' ? 'p1' : 'p2']: prev[currentPlayer === 'Spieler 1' ? 'p1' : 'p2'] + score }));
    
    if (currentPlayer === 'Spieler 1') {
      setCurrentPlayer('Spieler 2');
      alert("Spieler 2 ist dran!");
    } else {
      handleNextLevel();
    }
  };

  const handleFinalBossComplete = (score: number) => {
    setScores(prev => ({ ...prev, [currentPlayer === 'Spieler 1' ? 'p1' : 'p2']: prev[currentPlayer === 'Spieler 1' ? 'p1' : 'p2'] + score }));
    
    if (currentPlayer === 'Spieler 1') {
      setCurrentPlayer('Spieler 2');
      alert("Spieler 2 ist dran! Rette den Stein!");
    } else {
      handleNextLevel(); // To Victory
    }
  };

  const handleDiceComplete = (effect: DiceEffect) => {
    alert(`Der Würfel hat entschieden: ${effect.label}\n${effect.description}`);
    if (effect.effect === 'bonus') {
      setScores(s => ({ ...s, [currentPlayer === 'Spieler 1' ? 'p1' : 'p2']: s[currentPlayer === 'Spieler 1' ? 'p1' : 'p2'] + 20 }));
    }
    handleNextLevel();
  };

  // Render Helpers
  const renderStoryScreen = (nextAction: () => void, btnLabel: string) => {
    // Detect Speaker
    const isHermine = storyText.startsWith('Hermine:');
    const isRon = storyText.startsWith('Ron:');
    
    // Clean text by removing name prefix if present
    const cleanText = storyText.replace(/^(Hermine:|Ron:)\s*/, '');
    
    const speakerName = isHermine ? 'Hermine' : isRon ? 'Ron' : 'Hogwarts';
    const speakerImage = isHermine ? PLAYER_ASSETS.HERMINE : isRon ? PLAYER_ASSETS.RON : null;

    return (
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-end gap-6 animate-fade-in p-6 relative z-10 mt-10">
        
        {/* Character Portrait (Left/Bottom on mobile) */}
        {speakerImage && (
          <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full border-4 border-hogwarts-gold shadow-[0_0_25px_rgba(211,166,37,0.5)] overflow-hidden bg-black relative z-20 md:-mb-8 md:-mr-8 animate-float">
            <img src={speakerImage} alt={speakerName} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Bubble */}
        <div className="relative flex-1">
          <div className="absolute inset-0 bg-black/60 rounded-xl -z-10 border border-hogwarts-gold/30 blur-sm transform translate-y-2"></div>
          
          <div className={`bg-hogwarts-parchment p-8 rounded-2xl shadow-2xl border-4 border-double border-hogwarts-gold relative ${speakerImage ? 'md:rounded-bl-none' : ''}`}>
             
             {/* Name Tag */}
             {speakerImage && (
               <div className="absolute -top-4 left-6 bg-hogwarts-red text-white px-4 py-1 font-cinzel font-bold text-sm rounded shadow border border-red-900 tracking-wider">
                 {speakerName}
               </div>
             )}

             {isLoadingAI ? (
               <div className="flex items-center gap-3 text-hogwarts-dark/60 font-serif italic">
                 <Sparkles className="animate-spin" size={16} />
                 <span>Die Tinte erscheint...</span>
               </div>
             ) : (
               <p className="text-xl md:text-2xl font-serif leading-relaxed text-hogwarts-dark font-medium drop-shadow-sm">
                 "{cleanText}"
               </p>
             )}
          </div>
          
          <div className="mt-6 flex justify-end">
             <button 
              onClick={nextAction} 
              className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-hogwarts-gold to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-hogwarts-dark font-cinzel font-bold rounded-full shadow-[0_0_15px_rgba(211,166,37,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(211,166,37,0.6)] uppercase tracking-wider text-lg border border-yellow-300"
            >
              {btnLabel} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    );
  };

  const PlayerCard = ({ name, score, image, color }: { name: string, score: number, image: string, color: string }) => (
    <div className={`p-4 rounded-lg border-2 ${name === currentPlayer ? 'border-yellow-400 bg-hogwarts-parchment scale-105 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'border-hogwarts-gold/30 bg-hogwarts-parchment/80'} transition-all duration-300`}>
      <div className="aspect-square mb-3 rounded border border-hogwarts-dark overflow-hidden bg-[#1a1a1a] flex items-center justify-center relative shadow-inner">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        {name === currentPlayer && (
          <div className="absolute top-2 right-2 animate-pulse">
            <Sparkles className="text-yellow-400 fill-yellow-400 w-5 h-5 drop-shadow-md" />
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="font-bold font-cinzel text-hogwarts-dark text-lg tracking-wide">{name}</h3>
        <p className="text-2xl font-bold text-hogwarts-red font-serif mt-1">{score} <span className="text-sm text-hogwarts-dark/70">Pkt</span></p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] text-hogwarts-parchment p-4 font-serif selection:bg-hogwarts-gold selection:text-black">
      
      {/* Header */}
      <header className="text-center mb-10 pt-6 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-hogwarts-gold/10 blur-[100px] rounded-full"></div>
        <h1 className="text-5xl md:text-7xl font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-hogwarts-gold via-yellow-200 to-yellow-600 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-widest mb-3 uppercase">
          Hogwarts Trials
        </h1>
        <div className="flex items-center justify-center gap-4 text-hogwarts-parchmentDark/80">
          <span className="h-[1px] w-12 bg-hogwarts-gold/50"></span>
          <p className="italic font-serif text-lg tracking-wide">Ein magisches Duell</p>
          <span className="h-[1px] w-12 bg-hogwarts-gold/50"></span>
        </div>
      </header>

      <div className="container mx-auto flex flex-col md:flex-row gap-8 max-w-7xl relative">
        
        {/* Left Sidebar: Player Portraits */}
        <aside className="w-full md:w-1/4 md:min-w-[280px] space-y-6 order-2 md:order-1 relative z-20">
           <div className="bg-black/60 p-6 rounded-xl border border-hogwarts-gold/30 backdrop-blur-sm shadow-xl">
              <h3 className="text-hogwarts-gold font-cinzel font-bold text-xl mb-6 text-center border-b border-hogwarts-gold/20 pb-4 tracking-wider">TEILNEHMER</h3>
              <div className="space-y-6">
                <PlayerCard name="Hermine (P1)" score={scores.p1} image={PLAYER_ASSETS.HERMINE} color="red" />
                <PlayerCard name="Ron (P2)" score={scores.p2} image={PLAYER_ASSETS.RON} color="blue" />
              </div>
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 order-1 md:order-2 relative min-h-[600px] flex flex-col">
          
          {/* Map Background Layer */}
          <HogwartsMap gameState={gameState} />

          {/* Actual Game Content */}
          <div className="relative z-10">
            {gameState === 'MENU' && (
              <div className="flex flex-col items-center justify-center space-y-10 bg-black/40 p-12 rounded-xl border border-hogwarts-gold/20 shadow-2xl backdrop-blur-sm min-h-[500px]">
                
                <div className="relative group cursor-default">
                  <div className="absolute inset-0 bg-hogwarts-gold blur-[60px] opacity-10 animate-pulse group-hover:opacity-20 transition-opacity"></div>
                  <Castle size={120} className="text-hogwarts-parchment drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
                </div>
                
                <div className="flex flex-col gap-6 w-full max-w-sm">
                  <button 
                    onClick={handleStartGame}
                    className="group relative px-8 py-5 bg-hogwarts-red text-white text-xl font-cinzel font-bold rounded border border-red-900 shadow-[0_0_20px_rgba(116,0,1,0.4)] hover:bg-red-800 hover:shadow-[0_0_30px_rgba(116,0,1,0.6)] transition-all overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Wand2 className="group-hover:rotate-12 transition-transform" /> 
                      SPIEL STARTEN
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  </button>
                </div>
                
                <p className="max-w-md text-center text-hogwarts-parchmentDark/60 text-sm font-serif italic border-t border-white/10 pt-6">
                  "Nur wer den Mut besitzt, sich Fluffy zu stellen, die Geschicklichkeit, den Schlüssel zu fangen und die Weisheit für den Spiegel besitzt, wird triumphieren."
                </p>
              </div>
            )}

            {gameState === 'INTRO_STORY' && renderStoryScreen(() => handleNextLevel(), "Weiter in die Dunkelheit")}
            
            {gameState === 'HIDING_INTRO' && renderStoryScreen(() => setGameState('HIDING_GAME'), "Verstecken!")}

            {gameState === 'HIDING_GAME' && (
              <HidingGame onComplete={handleHidingComplete} />
            )}

            {gameState === 'LEVEL_1_INTRO' && (
              <div className="text-center space-y-8 bg-black/60 p-12 rounded-xl border border-hogwarts-gold/30 backdrop-blur-sm shadow-2xl">
                <h2 className="text-4xl font-cinzel text-hogwarts-gold drop-shadow-md">Der verbotene Korridor</h2>
                <p className="text-xl leading-relaxed text-hogwarts-parchment">
                  Ein riesiger dreiköpfiger Hund versperrt den Weg. <br/>
                  <span className="text-yellow-400 italic">Spiele Musik</span>, um ihn in den Schlaf zu wiegen.
                </p>
                <button 
                  onClick={() => setGameState('LEVEL_1_GAME')}
                  className="px-10 py-3 bg-hogwarts-gold text-hogwarts-dark font-cinzel font-bold rounded hover:bg-yellow-500 transition-colors shadow-lg"
                >
                  Level Starten
                </button>
              </div>
            )}

            {gameState === 'LEVEL_1_GAME' && (
              <LevelOneFluffy key={currentPlayer} currentPlayer={currentPlayer} onComplete={handleLevel1Complete} />
            )}

            {gameState === 'DICE_ROLL' && (
              <div className="flex flex-col items-center gap-6 bg-black/60 p-10 rounded-xl border border-hogwarts-gold/30 backdrop-blur-sm">
                <p className="text-2xl font-cinzel text-hogwarts-gold mb-2">Das Schicksal entscheidet...</p>
                <DiceRoller onRollComplete={handleDiceComplete} />
              </div>
            )}

            {gameState === 'LEVEL_2_INTRO' && renderStoryScreen(() => setGameState('LEVEL_2_GAME'), "Weiter zu Level 2")}

            {gameState === 'LEVEL_2_GAME' && (
              <LevelTwoKeys key={currentPlayer} currentPlayer={currentPlayer} onComplete={handleLevel2Complete} />
            )}

            {gameState === 'LEVEL_3_INTRO' && renderStoryScreen(() => setGameState('LEVEL_3_GAME'), "Zum Spiegel")}

            {gameState === 'LEVEL_3_GAME' && (
              <LevelThreeMirror key={currentPlayer} currentPlayer={currentPlayer} onComplete={handleLevel3Complete} />
            )}

            {gameState === 'FINAL_BOSS_INTRO' && renderStoryScreen(() => setGameState('FINAL_BOSS_GAME'), "Den Zauberstab bereit!")}

            {gameState === 'FINAL_BOSS_GAME' && (
              <FinalBossDuel key={currentPlayer} currentPlayer={currentPlayer} onComplete={handleFinalBossComplete} />
            )}

            {gameState === 'VICTORY' && (
              <div className="text-center space-y-8 mt-4 animate-float bg-black/70 p-10 rounded-xl border-2 border-hogwarts-gold shadow-[0_0_50px_rgba(211,166,37,0.2)]">
                <Trophy className="w-40 h-40 mx-auto text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]" />
                <h2 className="text-6xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-sm">GEWONNEN!</h2>
                <div className="bg-hogwarts-parchment text-hogwarts-dark p-8 rounded border-4 border-double border-hogwarts-gold max-w-2xl mx-auto shadow-2xl relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-hogwarts-gold"></div>
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-hogwarts-gold"></div>
                  
                  <p className="text-3xl font-cinzel font-bold mb-6 text-hogwarts-red border-b border-hogwarts-dark/20 pb-4">
                    {scores.p1 > scores.p2 ? 'Hermine (P1)' : scores.p2 > scores.p1 ? 'Ron (P2)' : 'Unentschieden'}
                  </p>
                  <p className="italic text-xl font-serif leading-relaxed mb-6">"{storyText.replace(/^(Hermine:|Ron:)\s*/, '')}"</p>
                  
                  <div className="flex justify-center gap-6 mt-6">
                      {scores.p1 > scores.p2 && (
                        <div className="relative">
                          <img src={PLAYER_ASSETS.HERMINE} alt="Sieger" className="w-32 h-32 rounded-full border-4 border-hogwarts-gold shadow-lg" />
                          <Sparkles className="absolute -top-2 -right-2 text-yellow-500 w-8 h-8 animate-spin-slow" />
                        </div>
                      )}
                      {scores.p2 > scores.p1 && (
                        <div className="relative">
                          <img src={PLAYER_ASSETS.RON} alt="Sieger" className="w-32 h-32 rounded-full border-4 border-hogwarts-gold shadow-lg" />
                          <Sparkles className="absolute -top-2 -right-2 text-yellow-500 w-8 h-8 animate-spin-slow" />
                        </div>
                      )}
                  </div>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-8 px-10 py-3 bg-white/5 hover:bg-white/10 border border-hogwarts-gold/50 rounded text-hogwarts-gold font-cinzel tracking-widest font-bold transition-all hover:shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                >
                  NEUE RUNDE
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;