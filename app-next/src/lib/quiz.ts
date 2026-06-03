import type { QuizQuestion, Theme } from "@/types/content";

export function buildQuiz(theme: Theme): QuizQuestion[] {
  return theme.cards.slice(0, 5).map((card, index) => {
    const wrongCards = theme.cards
      .filter((candidate) => candidate.id !== card.id)
      .slice(index + 1)
      .concat(theme.cards.filter((candidate) => candidate.id !== card.id).slice(0, index + 1))
      .slice(0, 3);

    return {
      id: `${theme.id}-q${String(index + 1).padStart(2, "0")}`,
      cardId: card.id,
      prompt: card.ce === "TBD" ? `Выберите перевод для карточки ${card.id}` : `Выберите перевод: ${card.ce}`,
      options: [card, ...wrongCards].map((optionCard, optionIndex) => ({
        id: String.fromCharCode(97 + optionIndex),
        cardId: optionCard.id,
        text: optionCard.ru,
      })),
      correctCardId: card.id,
      explanation: `Правильный ответ: ${card.ru}.`,
    };
  });
}
