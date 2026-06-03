import type { StudyCard, Theme } from "@/types/content";

const rawThemes = [
  {
    id: "greetings",
    order: 1,
    title: "Приветствия",
    description: "Базовые приветствия, прощания и короткие ответы для первого занятия.",
    words: ["Привет", "Здравствуйте", "Как дела?", "Хорошо", "Спасибо", "Пожалуйста", "До свидания", "Да / нет"],
  },
  {
    id: "family",
    order: 2,
    title: "Семья",
    description: "Простые слова о семье для короткого знакомства с близкими людьми.",
    words: ["мама", "папа", "брат", "сестра", "ребенок", "семья", "бабушка", "дедушка"],
  },
  {
    id: "home",
    order: 3,
    title: "Дом",
    description: "Слова о доме и предметах вокруг пользователя.",
    words: ["дом", "комната", "дверь", "окно", "стол", "стул", "книга", "вода"],
  },
  {
    id: "food",
    order: 4,
    title: "Еда",
    description: "Первые слова о еде и питье для повседневных ситуаций.",
    words: ["хлеб", "вода", "чай", "молоко", "яблоко", "суп", "мясо", "вкусно"],
  },
  {
    id: "numbers",
    order: 5,
    title: "Числа",
    description: "Первые числа и базовая логика счета.",
    words: ["один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь"],
  },
] as const;

function buildCards(themeId: string, words: readonly string[]): StudyCard[] {
  return words.map((ru, index) => ({
    id: `${themeId}-${String(index + 1).padStart(2, "0")}`,
    themeId,
    order: index + 1,
    ce: "TBD",
    ru,
    readingHint: "Ожидает проверки",
    difficulty: "A0",
    verificationStatus: "needs_native_review",
  }));
}

export const themes: Theme[] = rawThemes.map((theme) => ({
  id: theme.id,
  level: "A0-A1",
  order: theme.order,
  title: theme.title,
  description: theme.description,
  status: "needs_native_review",
  cards: buildCards(theme.id, theme.words),
}));

export const uiStrings = {
  appName: "Chechen Lab",
  levelLabel: "A0 -> A1",
  passPercent: 70,
};
