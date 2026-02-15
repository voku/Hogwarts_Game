import React from 'react';
import { GameState } from '../types';

interface MapProps {
  gameState: GameState;
}

export const HogwartsMap: React.FC<MapProps> = ({ gameState }) => {
  // Bestimme aktiven Node basierend auf GameState
  const getActiveStep = () => {
    switch (gameState) {
      case 'HIDING_INTRO':
      case 'HIDING_GAME':
        return 0; 
      case 'LEVEL_1_INTRO':
      case 'LEVEL_1_GAME':
        return 1;
      case 'DICE_ROLL':
      case 'LEVEL_2_INTRO':
      case 'LEVEL_2_GAME':
        return 2;
      case 'LEVEL_3_INTRO':
      case 'LEVEL_3_GAME':
        return 3;
      case 'FINAL_BOSS_INTRO':
      case 'FINAL_BOSS_GAME':
        return 4; // Final Boss
      case 'VICTORY':
        return 5; // Victory
      default:
        return -1;
    }
  };

  const activeStep = getActiveStep();

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        
        {/* Path - Adjusted to fit 5 nodes + victory */}
        <path 
          d="M 50 550 Q 80 520 100 500 Q 250 450 300 300 T 500 200 Q 550 150 600 150 T 700 150 T 750 100" 
          fill="none" 
          stroke="#5D2E2E" 
          strokeWidth="3" 
          strokeDasharray="10,5"
          className="opacity-60"
        />

        {/* Node 0: Hiding (Start) */}
        <g transform="translate(50, 550)">
          <circle r="15" fill={activeStep >= 0 ? "#740001" : "#2a2a2a"} stroke="#D3A625" strokeWidth="2" />
          <text y="30" x="-20" className="font-serif text-sm fill-hogwarts-dark font-bold">Versteck</text>
        </g>

        {/* Footsteps */}
        {activeStep >= 1 && (
           <g className="animate-pulse">
             <path d="M 70 530 L 80 520" stroke="#000" strokeWidth="2" />
           </g>
        )}

        {/* Node 1: Fluffy */}
        <g transform="translate(100, 500)">
          <circle r="18" fill={activeStep >= 1 ? "#740001" : "#2a2a2a"} stroke="#D3A625" strokeWidth="2" />
          <text y="35" x="-20" className="font-serif text-sm fill-hogwarts-dark font-bold">Fluffy</text>
        </g>

        {/* Footsteps */}
        {activeStep >= 2 && (
           <g className="animate-pulse">
             <path d="M 150 480 L 160 470" stroke="#000" strokeWidth="2" />
           </g>
        )}

        {/* Node 2: Keys */}
        <g transform="translate(300, 300)">
          <circle r="18" fill={activeStep >= 2 ? "#740001" : "#2a2a2a"} stroke="#D3A625" strokeWidth="2" />
          <text y="35" x="-30" className="font-serif text-sm fill-hogwarts-dark font-bold">Schlüssel</text>
        </g>

        {/* Footsteps */}
        {activeStep >= 3 && (
           <g className="animate-pulse">
             <path d="M 350 280 L 360 270" stroke="#000" strokeWidth="2" />
           </g>
        )}

        {/* Node 3: Mirror */}
        <g transform="translate(500, 200)">
          <circle r="18" fill={activeStep >= 3 ? "#740001" : "#2a2a2a"} stroke="#D3A625" strokeWidth="2" />
          <text y="35" x="-30" className="font-serif text-sm fill-hogwarts-dark font-bold">Spiegel</text>
        </g>

        {/* Footsteps */}
         {activeStep >= 4 && (
           <g className="animate-pulse">
             <path d="M 550 190 L 560 180" stroke="#000" strokeWidth="2" />
           </g>
        )}

        {/* Node 4: Final Duel */}
        <g transform="translate(620, 150)">
          <circle r="22" fill={activeStep >= 4 ? "#581c87" : "#2a2a2a"} stroke="#D3A625" strokeWidth="2" />
          <text y="35" x="-20" className="font-serif text-sm fill-hogwarts-dark font-bold">Duell</text>
        </g>

         {/* Footsteps to Victory */}
         {activeStep >= 5 && (
           <g className="animate-pulse">
             <path d="M 660 140 L 670 130" stroke="#000" strokeWidth="2" />
           </g>
        )}

        {/* Goal */}
        <g transform="translate(750, 100)">
          <circle r="25" fill={activeStep >= 5 ? "#D3A625" : "#2a2a2a"} stroke="#740001" strokeWidth="3" />
          <text y="40" x="-20" className="font-serif text-sm fill-hogwarts-dark font-bold">Sieg</text>
        </g>

        {/* Stylized Title inside Map */}
        <text x="50" y="80" className="font-cinzel text-4xl fill-hogwarts-dark opacity-30 rotate-[-5deg]">Karte des Rumtreibers</text>
      </svg>
    </div>
  );
};