const content = window.CHECHEN_LAB_CONTENT;
const app = document.querySelector("#app");
const progressKey = "chechenLab.progress.v1";

let state = {
  screen: "home",
  themeId: null,
  cardIndex: 0,
  quizIndex: 0,
  quizAnswers: [],
  selectedAnswer: null,
  progress: loadProgress()
};

function loadProgress() {
  const fallback = {
    completedThemes: [],
    studiedCards: [],
    quizResults: {},
    firstVisitAt: new Date().toISOString(),
    lastVisitAt: new Date().toISOString()
  };

  try {
    const raw = localStorage.getItem(progressKey);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw), lastVisitAt: new Date().toISOString() };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  state.progress.lastVisitAt = new Date().toISOString();
  localStorage.setItem(progressKey, JSON.stringify(state.progress));
}

function setScreen(screen, patch = {}) {
  state = { ...state, screen, ...patch };
  render();
  app.focus();
}

function getTheme(themeId) {
  return content.themes.find((theme) => theme.id === themeId);
}

function getThemeStatus(theme) {
  if (state.progress.completedThemes.includes(theme.id)) return "Завершена";
  const studiedCount = theme.cards.filter((card) => state.progress.studiedCards.includes(card.id)).length;
  if (studiedCount > 0) return `${studiedCount}/${theme.cards.length} карточек`;
  return theme.order === getCurrentThemeOrder() ? "Текущая" : "Не начата";
}

function getCurrentThemeOrder() {
  const firstOpen = content.themes.find((theme) => !state.progress.completedThemes.includes(theme.id));
  return firstOpen ? firstOpen.order : content.themes.length;
}

function getOverallProgress() {
  return Math.round((state.progress.completedThemes.length / content.themes.length) * 100);
}

function markCardStudied(cardId) {
  if (!state.progress.studiedCards.includes(cardId)) {
    state.progress.studiedCards.push(cardId);
    saveProgress();
  }
}

function completeTheme(themeId, score) {
  if (!state.progress.completedThemes.includes(themeId)) {
    state.progress.completedThemes.push(themeId);
  }
  state.progress.quizResults[themeId] = {
    score,
    completedAt: new Date().toISOString()
  };
  saveProgress();
}

function buildQuiz(theme) {
  return theme.cards.slice(0, 5).map((card, index) => {
    const wrong = theme.cards
      .filter((candidate) => candidate.id !== card.id)
      .slice(index + 1)
      .concat(theme.cards.filter((candidate) => candidate.id !== card.id).slice(0, index + 1))
      .slice(0, 3);

    return {
      id: `${theme.id}-q${String(index + 1).padStart(2, "0")}`,
      cardId: card.id,
      prompt: card.ce === "TBD" ? `Выберите перевод для карточки ${card.id}` : `Выберите перевод: ${card.ce}`,
      options: [card, ...wrong].map((optionCard, optionIndex) => ({
        id: String.fromCharCode(97 + optionIndex),
        cardId: optionCard.id,
        text: optionCard.ru
      })),
      correctCardId: card.id,
      explanation: `Правильный ответ: ${card.ru}.`
    };
  });
}

function render() {
  if (!content || !Array.isArray(content.themes)) {
    app.innerHTML = `<section class="panel"><h1>Контент не загрузился</h1><p>Проверьте файл app/content.js.</p></section>`;
    return;
  }

  if (state.screen === "home") renderHome();
  if (state.screen === "path") renderPath();
  if (state.screen === "theme") renderTheme();
  if (state.screen === "cards") renderCards();
  if (state.screen === "quiz") renderQuiz();
  if (state.screen === "result") renderResult();
  if (state.screen === "review") renderReview();
}

function renderHome() {
  app.innerHTML = `
    <section class="intro">
      <div>
        <p class="eyebrow">${content.ui.level}</p>
        <h1>Первый путь изучения чеченского</h1>
        <p class="lead">Короткие темы, карточки, квиз и локальный прогресс без регистрации.</p>
        <div class="actions">
          <button class="primary" type="button" data-action="path">Начать обучение</button>
          <button type="button" data-action="review">Повторить слова</button>
        </div>
      </div>
      <aside class="progress-panel" aria-label="Прогресс">
        <span class="meter-label">Общий прогресс</span>
        <strong>${getOverallProgress()}%</strong>
        <div class="meter"><span style="width: ${getOverallProgress()}%"></span></div>
        <p>${state.progress.completedThemes.length} из ${content.themes.length} тем завершено</p>
      </aside>
    </section>
  `;
}

function renderPath() {
  const cards = content.themes.map((theme) => `
    <article class="theme-card">
      <div>
        <span class="theme-order">Тема ${theme.order}</span>
        <h2>${theme.title}</h2>
        <p>${theme.description}</p>
      </div>
      <div class="theme-meta">
        <span>${theme.cards.length} карточек</span>
        <span>${getThemeStatus(theme)}</span>
      </div>
      <button type="button" data-action="theme" data-theme-id="${theme.id}">Открыть</button>
    </article>
  `).join("");

  app.innerHTML = `
    <section class="section-head">
      <p class="eyebrow">${content.ui.level}</p>
      <h1>Путь обучения</h1>
      <p>Начните с первой незавершенной темы или вернитесь к уже открытой.</p>
    </section>
    <section class="theme-grid">${cards}</section>
  `;
}

function renderTheme() {
  const theme = getTheme(state.themeId);
  const studiedCount = theme.cards.filter((card) => state.progress.studiedCards.includes(card.id)).length;
  const quizResult = state.progress.quizResults[theme.id];

  app.innerHTML = `
    <section class="section-head">
      <p class="eyebrow">Тема ${theme.order}</p>
      <h1>${theme.title}</h1>
      <p>${theme.description}</p>
    </section>
    <section class="two-column">
      <div class="panel">
        <h2>Карточки</h2>
        <p>${studiedCount} из ${theme.cards.length} карточек изучено.</p>
        <div class="meter"><span style="width: ${(studiedCount / theme.cards.length) * 100}%"></span></div>
        <div class="actions">
          <button class="primary" type="button" data-action="cards" data-theme-id="${theme.id}">Учить карточки</button>
          <button type="button" data-action="quiz" data-theme-id="${theme.id}">Квиз</button>
        </div>
      </div>
      <div class="panel">
        <h2>Статус</h2>
        <p>${quizResult ? `Последний квиз: ${quizResult.score}%` : "Квиз еще не пройден."}</p>
        <p class="note">Чеченские слова в данных пока отмечены как материал для проверки.</p>
      </div>
    </section>
  `;
}

function renderCards() {
  const theme = getTheme(state.themeId);
  const card = theme.cards[state.cardIndex];
  markCardStudied(card.id);

  app.innerHTML = `
    <section class="lesson-card">
      <div class="lesson-top">
        <span>Карточка ${state.cardIndex + 1} из ${theme.cards.length}</span>
        <span>${theme.title}</span>
      </div>
      <div class="word-card">
        <span class="status-badge">${card.verificationStatus}</span>
        <strong>${card.ce}</strong>
        <p>${card.ru}</p>
        <small>${card.readingHint}</small>
      </div>
      <div class="actions spread">
        <button type="button" data-action="prev-card" ${state.cardIndex === 0 ? "disabled" : ""}>Назад</button>
        <button class="primary" type="button" data-action="${state.cardIndex === theme.cards.length - 1 ? "quiz" : "next-card"}" data-theme-id="${theme.id}">
          ${state.cardIndex === theme.cards.length - 1 ? "Перейти к квизу" : "Дальше"}
        </button>
      </div>
    </section>
  `;
}

function renderQuiz() {
  const theme = getTheme(state.themeId);
  const quiz = buildQuiz(theme);
  const question = quiz[state.quizIndex];
  const answered = Boolean(state.selectedAnswer);

  const options = question.options.map((option) => {
    const isSelected = state.selectedAnswer === option.cardId;
    const isCorrect = answered && option.cardId === question.correctCardId;
    const className = isCorrect ? "correct" : isSelected ? "wrong" : "";
    return `<button class="${className}" type="button" data-action="answer" data-card-id="${option.cardId}" ${answered ? "disabled" : ""}>${option.text}</button>`;
  }).join("");

  app.innerHTML = `
    <section class="quiz-card">
      <div class="lesson-top">
        <span>Вопрос ${state.quizIndex + 1} из ${quiz.length}</span>
        <span>${theme.title}</span>
      </div>
      <h1>${question.prompt}</h1>
      <div class="options">${options}</div>
      ${answered ? `<p class="feedback">${question.explanation}</p>` : ""}
      <div class="actions spread">
        <button type="button" data-action="theme" data-theme-id="${theme.id}">В тему</button>
        <button class="primary" type="button" data-action="next-question" ${answered ? "" : "disabled"}>
          ${state.quizIndex === quiz.length - 1 ? "Показать результат" : "Следующий вопрос"}
        </button>
      </div>
    </section>
  `;
}

function renderResult() {
  const theme = getTheme(state.themeId);
  const score = state.progress.quizResults[theme.id]?.score || 0;
  const passed = score >= content.ui.passPercent;

  app.innerHTML = `
    <section class="result-card">
      <p class="eyebrow">${theme.title}</p>
      <h1>${score}%</h1>
      <p>${passed ? "Тема завершена. Можно идти дальше." : "Лучше повторить карточки и пройти квиз еще раз."}</p>
      <div class="actions">
        <button class="primary" type="button" data-action="path">К пути</button>
        <button type="button" data-action="cards" data-theme-id="${theme.id}">Повторить тему</button>
      </div>
    </section>
  `;
}

function renderReview() {
  const studiedCards = content.themes.flatMap((theme) =>
    theme.cards
      .filter((card) => state.progress.studiedCards.includes(card.id))
      .map((card) => ({ ...card, themeTitle: theme.title }))
  );

  if (!studiedCards.length) {
    app.innerHTML = `
      <section class="panel empty">
        <h1>Пока нечего повторять</h1>
        <p>Пройдите карточки первой темы, и они появятся здесь.</p>
        <button class="primary" type="button" data-action="path">К пути</button>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="section-head">
      <p class="eyebrow">Повторение</p>
      <h1>Изученные карточки</h1>
      <p>${studiedCards.length} карточек сохранено локально.</p>
    </section>
    <section class="review-list">
      ${studiedCards.map((card) => `
        <article>
          <span>${card.themeTitle}</span>
          <strong>${card.ce}</strong>
          <p>${card.ru}</p>
          <small>${card.readingHint}</small>
        </article>
      `).join("")}
    </section>
  `;
}

function handleAction(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  const themeId = target.dataset.themeId;

  if (action === "home") setScreen("home");
  if (action === "path") setScreen("path");
  if (action === "review") setScreen("review");
  if (action === "theme") setScreen("theme", { themeId });
  if (action === "cards") setScreen("cards", { themeId, cardIndex: 0 });
  if (action === "next-card") setScreen("cards", { cardIndex: state.cardIndex + 1 });
  if (action === "prev-card") setScreen("cards", { cardIndex: Math.max(0, state.cardIndex - 1) });
  if (action === "quiz") setScreen("quiz", { themeId, quizIndex: 0, quizAnswers: [], selectedAnswer: null });
  if (action === "answer") {
    state.selectedAnswer = target.dataset.cardId;
    state.quizAnswers[state.quizIndex] = target.dataset.cardId;
    render();
  }
  if (action === "next-question") {
    const theme = getTheme(state.themeId);
    const quiz = buildQuiz(theme);
    if (state.quizIndex === quiz.length - 1) {
      const correctCount = quiz.filter((question, index) => state.quizAnswers[index] === question.correctCardId).length;
      const score = Math.round((correctCount / quiz.length) * 100);
      completeTheme(theme.id, score);
      setScreen("result");
      return;
    }
    setScreen("quiz", { quizIndex: state.quizIndex + 1, selectedAnswer: null });
  }
  if (action === "reset") {
    localStorage.removeItem(progressKey);
    state.progress = loadProgress();
    setScreen("home");
  }
}

document.addEventListener("click", handleAction);
render();
