# Hogwarts Trials

A magical two-player competitive game inspired by Harry Potter and the Philosopher's Stone. Navigate through Hogwarts challenges including Fluffy's lair, flying keys, the Mirror of Erised, and a final boss duel.

## Coding with Kids

<img width="480" height="640" alt="image" src="https://github.com/user-attachments/assets/8c88e0f3-eda6-40ae-a1f8-0ab79fbb76e8" />

Prompt: `Erstelle ein Spiel aus unserer Zeichnung, für zwei Spieler ab 10 Jahre` // https://aistudio.google.com/ 

 ... und ein paar zusätzliche Prompts zusammen mit dem Kind, damit es auf dem Tablet gespielt werden kann. 

PS: lass die Kinder selbst auf Papier zeichnen und schreiben und erweckt dann gemeinsam ihre Fantasie zum Leben :)

## 🎮 Game Features

- **Two-Player Competitive Mode**: Hermine (P1) vs Ron (P2)
- **Five Progressive Levels**:
  1. Hiding Game - Avoid being caught
  2. Fluffy's Challenge - Face the three-headed dog
  3. Flying Keys - Catch the correct key
  4. Mirror of Erised - Find the Philosopher's Stone
  5. Final Boss Duel - Defeat Voldemort
- **Dynamic Storytelling**: Character-based narration adapts to player performance
- **Score Tracking**: Competitive point system
- **Responsive Design**: Mobile and desktop optimized

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/voku/Hogwarts_Game.git
   cd Hogwarts_Game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000`

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Google Fonts** - Cinzel and Crimson Text

## 📦 Build for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

## 🎯 Key Files Detector

When working with this codebase, here are the essential files to understand:

### Core Application Files
- **`App.tsx`** (380 lines) - Main game controller with state management and level orchestration
- **`index.tsx`** - React DOM entry point
- **`index.html`** - HTML entry point with Tailwind config and fonts
- **`types.ts`** - TypeScript type definitions for game state

### Game Components (`components/`)
- **`DiceRoller.tsx`** - Luck-based dice mechanic
- **`FinalBossDuel.tsx`** - Final boss battle mini-game
- **`HidingGame.tsx`** - Stealth challenge
- **`HogwartsMap.tsx`** - Visual progress indicator
- **`LevelOneFluffy.tsx`** - Music timing challenge
- **`LevelThreeMirror.tsx`** - Memory/observation game
- **`LevelTwoKeys.tsx`** - Catching mini-game

### Services
- **`services/storyService.ts`** - Story narration database and logic
- **`services/imageService.ts`** - Character asset management

### Configuration
- **`vite.config.ts`** - Vite build configuration
- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Visit the [GitHub repository](https://github.com/voku/Hogwarts_Game) to contribute.

## 📄 License

This project is open source and available under the MIT License.

## 🎨 Credits

- Inspired by J.K. Rowling's Harry Potter series
- Character portraits and assets from publicly available resources
- Built with ❤️ for the wizarding community
