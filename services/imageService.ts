// Statische Bild-Assets
// Wir nutzen nun stabile DiceBear Avatare (Adventurer Style), 
// da generierte KI-Links (Pollinations) zu instabil waren (404 Fehler).

export const PLAYER_ASSETS = {
  // Spieler 1 (Hermine Granger) - Braune Haare, helle Haut
  HERMINE: "https://api.dicebear.com/9.x/adventurer/svg?seed=Hermione&hair=long01&hairColor=3e2723&skinColor=fce4cd",
  
  // Spieler 2 (Ron Weasley) - Rote Haare, helle Haut
  RON: "https://api.dicebear.com/9.x/adventurer/svg?seed=Ron&hair=short02&hairColor=c62828&skinColor=fce4cd"
};

export const getPlayerAsset = (player: 'Spieler 1' | 'Spieler 2'): string => {
  return player === 'Spieler 1' ? PLAYER_ASSETS.HERMINE : PLAYER_ASSETS.RON;
};