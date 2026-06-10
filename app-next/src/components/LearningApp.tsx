"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { themes, uiStrings } from "@/data/content";
import { buildQuiz } from "@/lib/quiz";
import { createEmptyProgress, readProgress, resetProgress, writeProgress } from "@/lib/progress";
import type { StudyCard, Theme, VerificationStatus } from "@/types/content";
import type { UserProgress } from "@/types/progress";
import { ProgressBar } from "@/components/ProgressBar";

type Screen = "home" | "path" | "theme" | "cards" | "quiz" | "result" | "review";

type AppState = {
  screen: Screen;
  themeId: string | null;
  cardIndex: number;
  quizIndex: number;
  quizSeed: string | null;
  quizAnswers: string[];
  selectedAnswer: string | null;
};

const initialState: AppState = {
  screen: "home",
  themeId: null,
  cardIndex: 0,
  quizIndex: 0,
  quizSeed: null,
  quizAnswers: [],
  selectedAnswer: null,
};

function createQuizSeed(themeId: string) {
  return `${themeId}-${Date.now()}-${Math.random()}`;
}

const themeIcons = ["🌱", "👋", "🏠", "🍞", "🔢"];

export function LearningApp() {
  const [appState, setAppState] = useState<AppState>(initialState);
  const [progress, setProgress] = useState<UserProgress>(createEmptyProgress);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(readProgress()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const activeTheme = useMemo(
    () => themes.find((theme) => theme.id === appState.themeId) ?? themes[0],
    [appState.themeId],
  );

  function updateProgress(nextProgress: UserProgress) {
    writeProgress(nextProgress);
    setProgress(nextProgress);
  }

  function go(screen: Screen, patch: Partial<AppState> = {}) {
    setAppState((current) => ({ ...current, screen, ...patch }));
  }

  function markCardStudied(cardId: string) {
    if (!progress || progress.studiedCards.includes(cardId)) return;
    updateProgress({ ...progress, studiedCards: [...progress.studiedCards, cardId] });
  }

  function completeTheme(theme: Theme, score: number) {
    if (!progress) return;
    const allCardsStudied = theme.cards.every((card) => progress.studiedCards.includes(card.id));
    const shouldCompleteTheme = score >= uiStrings.passPercent && allCardsStudied;

    updateProgress({
      ...progress,
      completedThemes: shouldCompleteTheme && !progress.completedThemes.includes(theme.id)
        ? [...progress.completedThemes, theme.id]
        : progress.completedThemes,
      quizResults: {
        ...progress.quizResults,
        [theme.id]: { score, completedAt: new Date().toISOString() },
      },
    });
  }

  function handleReset() {
    resetProgress();
    setProgress(readProgress());
    setAppState(initialState);
  }

  const overallProgress = Math.round((progress.completedThemes.length / themes.length) * 100);
  const activeThemeStudiedCount = activeTheme.cards.filter((card) => progress.studiedCards.includes(card.id)).length;
  const activeThemeCardsStudied = activeTheme.cards.every((card) => progress.studiedCards.includes(card.id));
  const activeThemeCompleted = progress.completedThemes.includes(activeTheme.id);
  const activeThemeStatusText = activeThemeCompleted
    ? "Тема завершена: карточки пройдены, квиз сдан."
    : progress.quizResults[activeTheme.id]
      ? `Последний квиз: ${progress.quizResults[activeTheme.id].score}%`
      : "Квиз еще не пройден.";

  return (
    <div className="app-shell min-h-screen">
      <header className="site-header sticky top-0 z-10 px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <button className="flex items-center gap-3 text-left" type="button" onClick={() => go("home")}>
            <span className="brand-badge grid size-12 place-items-center text-sm font-black">CL</span>
            <span>
              <span className="block text-lg font-black">{uiStrings.appName}</span>
              <span className="block text-sm font-semibold text-white/85">{uiStrings.levelLabel}</span>
            </span>
          </button>
          <nav className="flex flex-wrap gap-2">
            <button className="nav-button" type="button" onClick={() => go("path")}>Путь</button>
            <button className="nav-button" type="button" onClick={() => go("review")}>Повторение</button>
            <button className="nav-button" type="button" onClick={handleReset}>Сброс</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {appState.screen === "home" && (
          <section className="grid min-h-[calc(100vh-9rem)] gap-6 md:grid-cols-[1fr_320px]">
            <div className="hero-panel flex flex-col justify-center p-8 md:p-14">
              <p className="eyebrow">{uiStrings.levelLabel}</p>
              <h1 className="max-w-3xl text-5xl font-black leading-none tracking-normal text-[#2f4f4f] md:text-7xl">
                Первый путь изучения чеченского
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-stone-700">
                Короткие темы, карточки, квиз и локальный прогресс без регистрации.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="primary-button" type="button" onClick={() => go("path")}>Начать обучение</button>
                <button className="secondary-button" type="button" onClick={() => go("review")}>Повторить слова</button>
              </div>
            </div>
            <aside className="progress-card flex flex-col justify-center p-6">
              <span className="text-sm font-bold text-stone-600">Общий прогресс</span>
              <strong className="my-3 text-5xl font-black text-[#2f4f4f]">{overallProgress}%</strong>
              <ProgressBar value={overallProgress} />
              <p className="mt-4 text-stone-600">{progress.completedThemes.length} из {themes.length} тем завершено</p>
              <div className="soft-pill mt-6 p-4 text-sm font-semibold">
                5 тем, карточки, квиз и повторение без регистрации.
              </div>
            </aside>
          </section>
        )}

        {appState.screen === "path" && (
          <>
            <SectionHead eyebrow={uiStrings.levelLabel} title="Путь обучения">
              Начните с первой незавершенной темы или вернитесь к уже открытой.
            </SectionHead>
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {themes.map((theme) => {
                const studiedCount = theme.cards.filter((card) => progress.studiedCards.includes(card.id)).length;
                const isCompleted = progress.completedThemes.includes(theme.id);
                const isCurrent = !isCompleted && studiedCount === 0 && theme.order === 1;
                const status = isCompleted ? "Завершена" : studiedCount > 0 ? `В процессе: ${studiedCount}/${theme.cards.length}` : "Не начата";
                const icon = themeIcons[theme.order - 1] ?? "⭐";

                return (
                  <article
                    className={`topic-card flex min-h-64 flex-col justify-between p-5 ${
                      isCurrent ? "topic-card-current" : ""
                    }`}
                    key={theme.id}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="theme-number grid size-10 place-items-center text-lg font-black">{icon}</span>
                        {isCurrent && (
                          <span className="soft-pill px-2.5 py-1 text-xs font-black">
                            Начните здесь
                          </span>
                        )}
                      </div>
                      <h2 className="mt-3 text-xl font-black text-[#2f4f4f]">{theme.title}</h2>
                      <p className="mt-3 leading-6 text-stone-600">{theme.description}</p>
                    </div>
                    <div className="mt-4 grid gap-3">
                      <div className="soft-pill flex justify-between gap-2 p-3 text-sm font-semibold">
                        <span>{theme.cards.length} карточек</span>
                        <span>{status}</span>
                      </div>
                      <button className="secondary-button" type="button" onClick={() => go("theme", { themeId: theme.id })}>
                        Открыть
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}

        {appState.screen === "theme" && (
          <>
            <SectionHead eyebrow={`Тема ${activeTheme.order}`} title={activeTheme.title}>
              {activeTheme.description}
            </SectionHead>
            <section className="grid gap-4 md:grid-cols-2">
              <Panel title="Карточки">
                <ThemeProgress theme={activeTheme} progress={progress} />
                <p className="mt-4 rounded-lg bg-stone-100 p-3 text-sm font-semibold text-stone-700">
                  {activeThemeCardsStudied
                    ? "Карточки пройдены. Теперь можно открыть квиз."
                    : `Сначала пройдите все карточки: сейчас ${activeThemeStudiedCount}/${activeTheme.cards.length}.`}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="primary-button" type="button" onClick={() => go("cards", { themeId: activeTheme.id, cardIndex: 0 })}>
                    Учить карточки
                  </button>
                  <button
                    className="secondary-button"
                    disabled={!activeThemeCardsStudied}
                    title={activeThemeCardsStudied ? undefined : "Сначала пройдите карточки темы"}
                    type="button"
                    onClick={() => go("quiz", { themeId: activeTheme.id, quizIndex: 0, quizSeed: createQuizSeed(activeTheme.id), quizAnswers: [], selectedAnswer: null })}
                  >
                    Квиз
                  </button>
                </div>
              </Panel>
              <Panel title="Статус">
                <p className="text-stone-600">{activeThemeStatusText}</p>
                <p className="mt-3 text-sm font-semibold text-stone-700">
                  Для завершения темы нужны все карточки и результат квиза не ниже {uiStrings.passPercent}%.
                </p>
                <ContentStatusNote status={activeTheme.status} />
              </Panel>
              {activeTheme.learningNote && (
                <Panel title="Короткая заметка">
                  <p className="text-stone-600">{activeTheme.learningNote}</p>
                </Panel>
              )}
            </section>
          </>
        )}

        {appState.screen === "cards" && (
          <CardsScreen
            theme={activeTheme}
            cardIndex={appState.cardIndex}
            markCardStudied={markCardStudied}
            go={go}
          />
        )}

        {appState.screen === "quiz" && (
          <QuizScreen
            theme={activeTheme}
            state={appState}
            setState={setAppState}
            completeTheme={completeTheme}
            go={go}
          />
        )}

        {appState.screen === "result" && (
          <section className="result-card mx-auto max-w-3xl p-8 text-center">
            <p className="eyebrow">{activeTheme.title}</p>
            <h1 className="text-7xl font-black text-[#2f4f4f]">{progress.quizResults[activeTheme.id]?.score ?? 0}%</h1>
            <p className="mt-4 font-semibold text-stone-600">
              {activeThemeCompleted
                ? "Тема завершена. Можно идти дальше."
                : (progress.quizResults[activeTheme.id]?.score ?? 0) >= uiStrings.passPercent
                  ? "Результат достаточный. Пройдите все карточки темы, чтобы завершить ее."
                  : "Лучше повторить карточки и пройти квиз еще раз."}
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <button className="primary-button" type="button" onClick={() => go("path")}>К пути</button>
              <button className="secondary-button" type="button" onClick={() => go("cards", { themeId: activeTheme.id, cardIndex: 0 })}>
                Повторить тему
              </button>
            </div>
          </section>
        )}

        {appState.screen === "review" && <ReviewScreen progress={progress} go={go} />}
      </main>
    </div>
  );
}

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="text-4xl font-black tracking-normal text-[#2f4f4f] md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl font-semibold leading-7 text-stone-600">{children}</p>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel-card p-6">
      <h2 className="text-xl font-black text-[#2f4f4f]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ThemeProgress({ theme, progress }: { theme: Theme; progress: UserProgress }) {
  const studiedCount = theme.cards.filter((card) => progress.studiedCards.includes(card.id)).length;

  return (
    <>
      <p className="text-stone-600">{studiedCount} из {theme.cards.length} карточек изучено.</p>
      <div className="mt-4">
        <ProgressBar value={(studiedCount / theme.cards.length) * 100} />
      </div>
    </>
  );
}

function ContentStatusNote({ status }: { status: VerificationStatus }) {
  const badge = verificationBadge(status);

  if (status === "needs_native_review") {
    return (
      <p className="mt-4 border-l-4 border-red-700 pl-3 text-stone-600">
        Чеченские слова пока не опубликованы: материал ожидает проверки носителем или ответственным проверяющим.
      </p>
    );
  }

  return (
    <p className="mt-4 border-l-4 border-emerald-700 pl-3 text-stone-600">
      Чеченский контент проверен ответственным проверяющим. Статус: {badge.text}.
    </p>
  );
}

function verificationBadge(status: VerificationStatus) {
  if (status === "published") {
    return {
      className: "border-emerald-200 bg-emerald-50 text-emerald-800",
      text: "Опубликовано",
    };
  }

  if (status === "reviewed") {
    return {
      className: "border-emerald-200 bg-emerald-50 text-emerald-800",
      text: "Проверено",
    };
  }

  return {
    className: "border-red-200 bg-red-50 text-red-800",
    text: "Ожидает проверки",
  };
}

function CardsScreen({
  theme,
  cardIndex,
  markCardStudied,
  go,
}: {
  theme: Theme;
  cardIndex: number;
  markCardStudied: (cardId: string) => void;
  go: (screen: Screen, patch?: Partial<AppState>) => void;
}) {
  const card = theme.cards[cardIndex];
  const badge = verificationBadge(card.verificationStatus);

  useEffect(() => {
    markCardStudied(card.id);
  }, [card.id, markCardStudied]);

  return (
    <section className="study-shell mx-auto max-w-3xl p-6 md:p-9">
      <div className="mb-6 flex justify-between gap-3 text-sm font-bold text-stone-600">
        <span>Карточка {cardIndex + 1} из {theme.cards.length}</span>
        <span>{theme.title}</span>
      </div>
      <div className="study-face grid min-h-80 place-items-center p-6 text-center">
        <span className={`justify-self-end rounded-full border px-3 py-1 text-sm font-black ${badge.className}`}>
          {badge.text}
        </span>
        <strong className="text-6xl font-black leading-none text-[#2f4f4f] md:text-7xl">{card.ce}</strong>
        <p className="mt-4 text-2xl font-black text-[#ff7f50]">{card.ru}</p>
        <small className="text-stone-600">
          {card.ce === "TBD" ? "Чеченское слово будет добавлено после проверки." : card.readingHint}
        </small>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button className="secondary-button" type="button" disabled={cardIndex === 0} onClick={() => go("cards", { cardIndex: Math.max(0, cardIndex - 1) })}>
          Назад
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={() =>
            cardIndex === theme.cards.length - 1
              ? go("quiz", { themeId: theme.id, quizIndex: 0, quizSeed: createQuizSeed(theme.id), quizAnswers: [], selectedAnswer: null })
              : go("cards", { cardIndex: cardIndex + 1 })
          }
        >
          {cardIndex === theme.cards.length - 1 ? "Перейти к квизу" : "Дальше"}
        </button>
      </div>
    </section>
  );
}

function QuizScreen({
  theme,
  state,
  setState,
  completeTheme,
  go,
}: {
  theme: Theme;
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  completeTheme: (theme: Theme, score: number) => void;
  go: (screen: Screen, patch?: Partial<AppState>) => void;
}) {
  const quiz = useMemo(() => buildQuiz(theme, state.quizSeed ?? "default"), [state.quizSeed, theme]);
  const question = quiz[state.quizIndex];
  const answered = Boolean(state.selectedAnswer);

  function chooseAnswer(cardId: string) {
    setState((current) => {
      const nextAnswers = [...current.quizAnswers];
      nextAnswers[current.quizIndex] = cardId;
      return { ...current, selectedAnswer: cardId, quizAnswers: nextAnswers };
    });
  }

  const nextQuestion = useCallback(() => {
    if (state.quizIndex === quiz.length - 1) {
      const correctCount = quiz.filter((item, index) => state.quizAnswers[index] === item.correctCardId).length;
      completeTheme(theme, Math.round((correctCount / quiz.length) * 100));
      go("result");
      return;
    }

    go("quiz", { quizIndex: state.quizIndex + 1, selectedAnswer: null });
  }, [completeTheme, go, quiz, state.quizAnswers, state.quizIndex, theme]);

  useEffect(() => {
    if (!answered) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter") return;
      event.preventDefault();
      nextQuestion();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answered, nextQuestion]);

  return (
    <section className="quiz-shell mx-auto max-w-3xl p-6 text-center md:p-9">
      <div className="mb-6 flex justify-between gap-3 text-sm font-bold text-stone-600">
        <span>Вопрос {state.quizIndex + 1} из {quiz.length}</span>
        <span>{theme.title}</span>
      </div>
      <h1 className="text-3xl font-black text-[#2f4f4f]">{question.prompt}</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = state.selectedAnswer === option.cardId;
          const isCorrect = answered && option.cardId === question.correctCardId;
          const stateClass = isCorrect ? "border-[#2f4f4f] bg-[#2f4f4f] text-white shadow-none" : isSelected ? "border-red-700 bg-red-50 shadow-none" : "bg-[#f5f5dc]";

          return (
            <button
              className={`quiz-option min-h-16 px-4 text-left text-lg font-bold transition ${stateClass}`}
              disabled={answered}
              key={option.id}
              type="button"
              onClick={() => chooseAnswer(option.cardId)}
            >
              {option.text}
            </button>
          );
        })}
      </div>
      {answered && <p className="soft-pill mt-5 p-4 text-lg font-bold">{question.explanation}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button className="secondary-button" type="button" onClick={() => go("theme", { themeId: theme.id })}>В тему</button>
        <button className="primary-button" type="button" disabled={!answered} onClick={nextQuestion}>
          {state.quizIndex === quiz.length - 1 ? "Показать результат" : "Следующий вопрос"}
        </button>
      </div>
    </section>
  );
}

function ReviewScreen({ progress, go }: { progress: UserProgress; go: (screen: Screen, patch?: Partial<AppState>) => void }) {
  const studiedCards = themes.flatMap((theme) =>
    theme.cards
      .filter((card) => progress.studiedCards.includes(card.id))
      .map((card) => ({ ...card, themeTitle: theme.title })),
  );

  if (!studiedCards.length) {
    return (
      <section className="empty-card mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-4xl font-black text-[#2f4f4f]">Пока нечего повторять</h1>
        <p className="mt-4 text-stone-600">Пройдите карточки первой темы, и они появятся здесь.</p>
        <button className="primary-button mt-6" type="button" onClick={() => go("path")}>К пути</button>
      </section>
    );
  }

  return (
    <>
      <SectionHead eyebrow="Повторение" title="Изученные карточки">
        {studiedCards.length} карточек сохранено локально.
      </SectionHead>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {studiedCards.map((card) => (
          <ReviewCard card={card} key={card.id} />
        ))}
      </section>
    </>
  );
}

function ReviewCard({
  card,
}: {
  card: StudyCard & { themeTitle: string };
}) {
  const badge = verificationBadge(card.verificationStatus);

  return (
    <article className="review-card min-h-40 p-5">
      <span className="text-sm font-bold text-stone-600">{card.themeTitle}</span>
      <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-black ${badge.className}`}>
        {badge.text}
      </span>
      <strong className="mt-4 block text-4xl font-black text-[#2f4f4f]">{card.ce}</strong>
      <p className="mt-2 font-bold text-[#ff7f50]">{card.ru}</p>
      <small className="text-stone-600">
        {card.ce === "TBD" ? "Чеченское слово будет добавлено после проверки." : card.readingHint}
      </small>
    </article>
  );
}
