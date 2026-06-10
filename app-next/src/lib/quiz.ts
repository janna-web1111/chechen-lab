import type { QuizQuestion, Theme } from "@/types/content";

function hashString(value: string): number {
  return Array.from(value).reduce((hash, character) => Math.imul(31, hash) + character.charCodeAt(0), 0);
}

function shuffleBySeed<T>(items: T[], seed: string): T[] {
  let state = hashString(seed) >>> 0;
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = Math.imul(1664525, state) + 1013904223;
    const swapIndex = (state >>> 0) % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function buildQuiz(theme: Theme, attemptSeed = "default"): QuizQuestion[] {
  return theme.cards.slice(0, 5).map((card, index) => {
    const wrongCards = theme.cards
      .filter((candidate) => candidate.id !== card.id)
      .slice(index + 1)
      .concat(theme.cards.filter((candidate) => candidate.id !== card.id).slice(0, index + 1))
      .slice(0, 3);
    const options = shuffleBySeed([card, ...wrongCards], `${attemptSeed}-${theme.id}-${card.id}-${index}`);

    return {
      id: `${theme.id}-q${String(index + 1).padStart(2, "0")}`,
      cardId: card.id,
      prompt: card.ce === "TBD" ? `Выберите перевод для карточки ${card.id}` : `Выберите перевод: ${card.ce}`,
      options: options.map((optionCard, optionIndex) => ({
        id: String.fromCharCode(97 + optionIndex),
        cardId: optionCard.id,
        text: optionCard.ru,
      })),
      correctCardId: card.id,
      explanation: `Правильный ответ: ${card.ru}.`,
    };
  });
}
