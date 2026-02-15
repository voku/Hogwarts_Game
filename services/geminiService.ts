import { Scores } from "../types";

// Statische Story-Datenbank ersetzt die KI
// Texte sind nun direkte Ansprachen an "Liv" von Hermine oder Ron
const STORY_DB = {
  INTRO: "Hermine: Liv, gut dass du da bist! Wir müssen leise sein. Harry und Neville warten schon, aber wir drei müssen den Weg freimachen. Der dritte Stock ist verboten, aber ich habe in 'Geschichte Hogwarts' gelesen, wie wir an den Fallen vorbeikommen. Bist du bereit?",
  
  HIDING_INTRO: "Ron: Blimey, Liv! Hast du das gehört? Schritte! Das ist bestimmt Dumbledore... oder schlimmer, Filch! Wenn die uns erwischen, war's das mit dem Hauspokal. Schnell, wir müssen uns verstecken!",

  LEVEL_2_INTRO: {
    P1_LEAD: "Hermine: Puh, das war knapp mit Fluffy! Liv, du hast das super gemacht mit der Musik. Aber schau mal nach oben... Tausende fliegende Schlüssel! Wir brauchen den alten, verrosteten. Ich analysiere das Flugmuster!",
    P2_LEAD: "Ron: Wahnsinn, Liv! Wir haben den Hund überlistet! Jetzt wird's sportlich. Das ist wie Quidditch, nur in einem Zimmer. Schnapp dir den Besen, Liv! Ich decke dich, wir müssen den Schlüssel mit dem kaputten Flügel fangen!",
    DRAW: "Hermine: Wir sind ein gutes Team, Liv! Fluffy schläft. Aber die nächste Tür ist verschlossen. Ron, Liv, seht ihr die Besen? Wir müssen da hoch und den richtigen Schlüssel fangen. Konzentration!"
  },

  LEVEL_3_INTRO: {
    P1_LEAD: "Hermine: Wir haben den Schlüssel! Liv, du bist echt geschickt. Jetzt stehen wir vor der letzten Hürde. Sieh nur, der Spiegel Nerhegeb. Dumbledore hat gesagt, er zeigt uns unser tiefstes Begehren. Aber wir brauchen den Stein, Liv. Lass dich nicht täuschen!",
    P2_LEAD: "Ron: Klasse Flugmanöver, Liv! Die Tür ist offen. Aber hier ist nichts... außer diesem gruseligen Spiegel. Ich sehe mich als Quidditch-Kapitän... aber warte, Liv, wir sind hier um den Stein zu finden. Was siehst du?",
    DRAW: "Hermine: Die Tür ist auf. Vorsicht, Liv. Hier ist es totenstill. Nur dieser Spiegel. Er ist gefährlich. Er zeigt nicht die Wahrheit, sondern was wir uns wünschen. Wir müssen den Stein der Weisen darin finden, Liv. Konzentrier dich!"
  },

  FINAL_BOSS_INTRO: "Ron: (schreit) Liv, pass auf! Das ist nicht Professor Quirrell... da ist ein Gesicht auf seinem Hinterkopf! Es ist Du-weißt-schon-wer! Er greift an! Zück deinen Zauberstab, Liv! Wir müssen uns duellieren!",
  
  VICTORY: {
    P1_LEAD: "Hermine: Wir haben es geschafft! Liv, du warst brillant! Der Stein ist sicher und Voldemort ist geflohen. Gryffindor wird stolz auf uns sein. Lass uns schnell verschwinden, bevor Dumbledore zurückkommt!",
    P2_LEAD: "Ron: Das war der Wahnsinn, Liv! Besser als jedes Schachspiel! Du hast ihn voll erwischt! Wir sind Helden! Komm, wir gehen in die Große Halle und feiern das!",
    DRAW: "Hermine: Er ist weg! Wir haben ihn gemeinsam besiegt, Liv. Das war unglaublich mutig von dir. Komm jetzt, bringen wir den Stein in Sicherheit."
  }
};

export const generateStorySegment = async (
  phase: string, 
  scores: Scores, 
  contextDetail: string // Wird hier nicht mehr benötigt, bleibt aber für Interface-Kompatibilität
): Promise<string> => {
  
  // Kurze künstliche Verzögerung
  await new Promise(resolve => setTimeout(resolve, 800));

  if (phase === 'INTRO') return STORY_DB.INTRO;
  if (phase === 'HIDING_INTRO') return STORY_DB.HIDING_INTRO;
  if (phase === 'FINAL_BOSS_INTRO') return STORY_DB.FINAL_BOSS_INTRO;

  // Bestimme wer führt
  const leader = scores.p1 > scores.p2 ? 'P1_LEAD' : scores.p2 > scores.p1 ? 'P2_LEAD' : 'DRAW';

  if (phase === 'LEVEL_2_INTRO') {
    return STORY_DB.LEVEL_2_INTRO[leader as keyof typeof STORY_DB.LEVEL_2_INTRO];
  }

  if (phase === 'LEVEL_3_INTRO') {
    return STORY_DB.LEVEL_3_INTRO[leader as keyof typeof STORY_DB.LEVEL_3_INTRO];
  }

  if (phase === 'VICTORY') {
    return STORY_DB.VICTORY[leader as keyof typeof STORY_DB.VICTORY];
  }

  return "Die Magie ist heute neblig...";
};