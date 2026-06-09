import type { StudyCard, Theme } from "@/types/content";

type RawCard = string | {
  ru: string;
  ce: string;
  readingHint?: string;
};

const rawThemes = [
  {
    id: "greetings",
    order: 1,
    title: "Приветствия",
    description: "Базовые приветствия, прощания и короткие ответы для первого занятия.",
    learningNote:
      "В и Й в начале слов могут быть показателями мужского и женского класса. К категории классов вернемся позже; сейчас просто учите выражения.",
    words: [
      {
        ru: "доброе утро (к одному человеку)",
        ce: "IУЬЙРЕ ДИКА ХУЬЛДА ХЬАН!",
      },
      {
        ru: "добрый день (к одному человеку)",
        ce: "ДЕ ДИКА ХУЬЛДА ХЬАН!",
      },
      {
        ru: "добрый вечер (к одному человеку)",
        ce: "СУЬЙРЕ ДИКА ХУЬЛДА ХЬАН!",
      },
      {
        ru: "спокойной ночи (к одному человеку)",
        ce: "БУЬЙСА ДЕКЪАЛА ХУЬЛДА ХЬАН!",
      },
      {
        ru: "доброе утро всем",
        ce: "IУЬЙРЕ ДИКА ХУЬЛДА ШУН!",
      },
      {
        ru: "добрый день всем",
        ce: "ДЕ ДИКА ХУЬЛДА ШУН!",
      },
      {
        ru: "добрый вечер всем",
        ce: "СУЬЙРЕ ДИКА ХУЬЛДА ШУН!",
      },
      {
        ru: "спокойной ночи всем",
        ce: "БУЬЙСА ДЕКЪАЛА ХУЬЛДА ШУН!",
      },
    ],
  },
  {
    id: "family",
    order: 2,
    title: "Семья",
    description: "Простые слова о семье для короткого знакомства с близкими людьми.",
    words: [
      { ru: "семья", ce: "Доьзал" },
      { ru: "отец", ce: "Да" },
      { ru: "мать", ce: "Нана" },
      { ru: "брат", ce: "Ваша" },
      { ru: "сестра", ce: "Йиша" },
      { ru: "сын", ce: "КІант / воІ" },
      { ru: "дочь", ce: "ЙоІ" },
      { ru: "дедушка", ce: "Де да / нена да" },
    ],
  },
  {
    id: "home",
    order: 3,
    title: "Дом",
    description: "Слова о доме и предметах вокруг пользователя.",
    words: [
      { ru: "дом", ce: "ЦІа" },
      { ru: "комната", ce: "Чоь" },
      { ru: "ключ", ce: "ДогІа" },
      { ru: "ванная", ce: "Ваннин чоь" },
      { ru: "туалет", ce: "ХьаштагІа" },
      { ru: "телевизор", ce: "Телевизор" },
      { ru: "стол", ce: "Стол" },
      { ru: "стул", ce: "Г1ант" },
    ],
  },
  {
    id: "food",
    order: 4,
    title: "Еда",
    description: "Первые слова о еде и питье для повседневных ситуаций.",
    words: [
      { ru: "хлеб", ce: "Кхаллар / бепиг" },
      { ru: "соль", ce: "Туьха" },
      { ru: "молоко", ce: "Шура" },
      { ru: "кефир", ce: "Йетта шура" },
      { ru: "вода", ce: "Хи" },
      { ru: "тарелка", ce: "Бошхап" },
      { ru: "чашка", ce: "Кад" },
      { ru: "ложка", ce: "Іайг" },
    ],
  },
  {
    id: "numbers",
    order: 5,
    title: "Числа",
    description: "Первые числа и базовая логика счета.",
    words: [
      { ru: "один", ce: "Цхьаъ" },
      { ru: "два", ce: "Шиъ" },
      { ru: "три", ce: "Кхоъ" },
      { ru: "четыре", ce: "Диъ" },
      { ru: "пять", ce: "Пхиъ" },
      { ru: "шесть", ce: "Ялх" },
      { ru: "семь", ce: "ВорхІ" },
      { ru: "восемь", ce: "БархІ" },
    ],
  },
] as const;

function buildCards(themeId: string, words: readonly RawCard[]): StudyCard[] {
  return words.map((word, index) => {
    const card = typeof word === "string"
      ? { ru: word, ce: "TBD", readingHint: "Ожидает проверки" }
      : { readingHint: "Ожидает проверки", ...word };

    return {
      id: `${themeId}-${String(index + 1).padStart(2, "0")}`,
      themeId,
      order: index + 1,
      ce: card.ce,
      ru: card.ru,
      readingHint: card.readingHint,
      difficulty: "A0",
      verificationStatus: "needs_native_review",
    };
  });
}

export const themes: Theme[] = rawThemes.map((theme) => ({
  id: theme.id,
  level: "A0-A1",
  order: theme.order,
  title: theme.title,
  description: theme.description,
  learningNote: "learningNote" in theme ? theme.learningNote : undefined,
  status: "needs_native_review",
  cards: buildCards(theme.id, theme.words),
}));

export const uiStrings = {
  appName: "Chechen Lab",
  levelLabel: "A0 -> A1",
  passPercent: 70,
};
