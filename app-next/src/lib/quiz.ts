import type { QuizQuestion, Theme } from "@/types/content";

function placeCorrectOption<T>(correctOption: T, wrongOptions: T[], questionIndex: number, themeOrder: number): T[] {
  const options = [...wrongOptions];
  const correctIndex = (questionIndex * 3 + themeOrder) % (wrongOptions.length + 1);
  options.splice(correctIndex, 0, correctOption);
  return options;
}

export function buildQuiz(theme: Theme): QuizQuestion[] {
  return theme.cards.slice(0, 5).map((card, index) => {
    const wrongCards = theme.cards
      .filter((candidate) => candidate.id !== card.id)
      .slice(index + 1)
      .concat(theme.cards.filter((candidate) => candidate.id !== card.id).slice(0, index + 1))
      .slice(0, 3);
    const options = placeCorrectOption(card, wrongCards, index, theme.order);

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
