/**
 * Decisiones del Corazón
 * - HTML/CSS/JS puro
 * - Juego simple: sin fetch, sin JSON externo
 * - Indicadores: amor, madurez, confianza, bienestar
 */

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const GAME_DATA = {
  stages: [
    {
      name: "Nivel 1: Flechazo",
      scenes: [
        {
          context: "Parejas",
          title: "Atracción inicial",
          text: "Te gusta alguien que acabas de conocer. Sientes emoción y curiosidad. ¿Qué haces con eso?",
          choices: [
            {
              label: "A) Idealizar a la persona sin conocerla",
              hint: "Te dejas llevar por la fantasía y asumes que “es perfecto/a”.",
              effects: { love: 4, maturity: -6, trust: -3, wellbeing: -2 },
              feedback:
                "El amor no es solo emoción: también es decisión y conocimiento del otro. Idealizar apaga la libertad y te expone a decepciones."
            },
            {
              label: "B) Intentar conocerla como amigo/a",
              hint: "Conversas, escuchas y respetas sus tiempos.",
              effects: { love: 2, maturity: 6, trust: 5, wellbeing: 3 },
              feedback:
                "Conocer antes de “engancharse” fortalece la confianza. La libertad dentro del amor es elegir, no depender."
            },
            {
              label: "C) Depender emocionalmente desde el inicio",
              hint: "Tu ánimo empieza a depender de si te responde o no.",
              effects: { love: 3, maturity: -7, trust: -5, wellbeing: -6 },
              feedback:
                "La libertad implica elegir el bien del otro sin necesidad. La dependencia temprana suele producir ansiedad y control."
            }
          ]
        }
      ]
    },
    {
      name: "Nivel 2: Amistad",
      scenes: [
        {
          context: "Amigos",
          title: "Confianza y cuidado",
          text: "Un amigo te cuenta algo sensible y te pide opinión. ¿Cómo respondes?",
          choices: [
            {
              label: "A) Contarlo a otros “para desahogarte”",
              hint: "Buscas apoyo, pero rompes confidencialidad.",
              effects: { love: -1, maturity: -4, trust: -8, wellbeing: -2 },
              feedback:
                "La confianza es el cemento de relaciones sólidas. Sin confidencialidad, el vínculo se vuelve frágil."
            },
            {
              label: "B) Escuchar y ayudar sin divulgar",
              hint: "Acompañas con respeto y pones límites sanos.",
              effects: { love: 2, maturity: 5, trust: 7, wellbeing: 2 },
              feedback:
                "La amabilidad se vuelve concreta cuando cuidas al otro. Acompañar no es controlar: es estar presente con respeto."
            }
          ]
        }
      ]
    },
    {
      name: "Nivel 3: Noviazgo",
      scenes: [
        {
          context: "Parejas",
          title: "Comunicación",
          text: "Surge un malentendido. ¿Qué haces primero?",
          choices: [
            {
              label: "A) Suponer lo peor y guardar silencio",
              hint: "Evitas hablar para no discutir.",
              effects: { love: -1, maturity: -2, trust: -4, wellbeing: -2 },
              feedback:
                "Evitar hablar no protege el vínculo. La claridad (con cuidado) es un acto de amabilidad."
            },
            {
              label: "B) Hablar con calma, escuchar y aclarar",
              hint: "Buscas entender antes de reaccionar.",
              effects: { love: 3, maturity: 5, trust: 5, wellbeing: 3 },
              feedback:
                "Relaciones sólidas se construyen con comunicación y respeto. El amor crece cuando ambos se sienten libres de expresar su verdad."
            }
          ]
        }
      ]
    },
    {
      name: "Nivel 4: Conflictos y decisiones",
      scenes: [
        {
          context: "Padres e hijos",
          title: "Diferencias en casa",
          text: "Tu familia opina fuerte sobre una decisión tuya. ¿Cómo respondes?",
          choices: [
            {
              label: "A) Responder con gritos o ataques",
              hint: "Te defiendes atacando.",
              effects: { love: -2, maturity: -4, trust: -5, wellbeing: -3 },
              feedback:
                "La templanza regula impulsos: defender no es atacar. Respetar permite conversar incluso con desacuerdo."
            },
            {
              label: "B) Dialogar con firmeza y amabilidad",
              hint: "Escuchas, agradeces y pones límites.",
              effects: { love: 2, maturity: 5, trust: 4, wellbeing: 2 },
              feedback:
                "Amar con libertad también en casa: escuchar no significa obedecer. La amabilidad y la claridad pueden convivir con la autonomía."
            }
          ]
        }
      ]
    },
    {
      name: "Nivel 5: Compromiso / Proyecto de vida",
      scenes: [
        {
          context: "Parejas y amigos",
          title: "Proyecto y hábitos",
          text: "Piensas en el futuro: ¿cómo construir una relación sólida sin idealizar?",
          choices: [
            {
              label: "A) Creer que “con emoción basta”",
              hint: "No hablar de acuerdos ni hábitos.",
              effects: { love: 1, maturity: -4, trust: -2, wellbeing: -1 },
              feedback:
                "El amor es un proceso: emoción + decisión + hábitos. Sin acuerdos, la relación queda a la deriva."
            },
            {
              label: "B) Diseñar acuerdos realistas y cuidar la libertad",
              hint: "Comunicación, límites sanos y reparación cuando se falla.",
              effects: { love: 4, maturity: 6, trust: 6, wellbeing: 4 },
              feedback:
                "La verdadera libertad implica elegir el bien del otro sin anularte. Los acuerdos construyen confianza y estabilidad."
            }
          ]
        }
      ]
    }
  ],
  endings: {
    toxic: {
      badge: "Relación tóxica",
      title: "Cuando el amor se confunde con control o dependencia",
      text: "Tus decisiones priorizaron impulsos, ataques o silencios que erosionan la confianza y el bienestar."
    },
    superficial: {
      badge: "Relación superficial",
      title: "Cuando falta profundidad para sostener el vínculo",
      text: "Hay afecto, pero faltan acuerdos claros, comunicación constante y reparación para que el amor se vuelva consciente."
    },
    solid: {
      badge: "Relación sólida y consciente",
      title: "Amor como proceso: libertad + virtud + compromiso",
      text: "Tus decisiones favorecieron comunicación, límites sanos y cuidado del otro sin perder libertad. Eso construye amor verdadero."
    }
  }
};

const els = {
  status: document.getElementById("status"),

  btnStart: document.getElementById("btn-start"),
  btnRestart: document.getElementById("btn-restart"),
  btnContinue: document.getElementById("btn-continue"),
  btnPlayAgain: document.getElementById("btn-play-again"),

  screenStart: document.getElementById("screen-start"),
  screenGame: document.getElementById("screen-game"),
  screenEnd: document.getElementById("screen-end"),

  stageName: document.getElementById("stage-name"),
  sceneCount: document.getElementById("scene-count"),
  sceneContext: document.getElementById("scene-context"),
  sceneTitle: document.getElementById("scene-title"),
  sceneText: document.getElementById("scene-text"),
  choices: document.getElementById("choices"),

  feedbackWrap: document.getElementById("feedback"),
  feedbackText: document.getElementById("feedback-text"),

  statLove: document.getElementById("stat-love"),
  statMaturity: document.getElementById("stat-maturity"),
  statTrust: document.getElementById("stat-trust"),
  statWellbeing: document.getElementById("stat-wellbeing"),
  barLove: document.getElementById("bar-love"),
  barMaturity: document.getElementById("bar-maturity"),
  barTrust: document.getElementById("bar-trust"),
  barWellbeing: document.getElementById("bar-wellbeing"),

  endingBadge: document.getElementById("ending-badge"),
  endingTitle: document.getElementById("ending-title"),
  endingText: document.getElementById("ending-text"),
  analysisList: document.getElementById("analysis-list"),
  tipsList: document.getElementById("tips-list"),
};

function setStatus(message, kind = "idle") {
  els.status.textContent = message;
  els.status.classList.remove("status--error");
  if (kind === "error") els.status.classList.add("status--error");
}

function showOnly(screen) {
  els.screenStart.hidden = screen !== "start";
  els.screenGame.hidden = screen !== "game";
  els.screenEnd.hidden = screen !== "end";
  els.btnRestart.hidden = screen === "start";
}

function pct01to100(x) {
  return `${clamp(Math.round(x * 100), 0, 100)}%`;
}

function setBar(el, value01) {
  el.style.width = pct01to100(value01);
}

function summarizeDelta(effects) {
  const keys = [
    ["love", "❤️ Amor"],
    ["maturity", "🧠 Madurez"],
    ["trust", "🤝 Confianza"],
    ["wellbeing", "😊 Bienestar"],
  ];

  const parts = [];
  for (const [k, label] of keys) {
    const v = Number(effects?.[k] ?? 0);
    if (!v) continue;
    parts.push(`${label} ${v > 0 ? "+" : ""}${v}`);
  }
  return parts.length ? parts.join(" · ") : "Sin cambios visibles";
}

function computeEnding(stats) {
  // Simple y entendible
  if (stats.trust <= 30 || stats.wellbeing <= 30) return "toxic";
  if (stats.maturity >= 62 && stats.trust >= 62 && stats.wellbeing >= 55) return "solid";
  return "superficial";
}

function buildTips(stats) {
  const tips = [];

  if (stats.trust < 55) {
    tips.push("Practica acuerdos claros: lo que se promete, se cumple (y si no, se repara).");
  }
  if (stats.maturity < 55) {
    tips.push("Antes de reaccionar, nombra tu emoción y elige una respuesta (no un impulso).");
  }
  if (stats.wellbeing < 55) {
    tips.push("El amor sano cuida tu vida: descanso, estudio, amistades y límites.");
  }

  if (!tips.length) {
    tips.push("Sigue eligiendo amor con libertad: comunicación, respeto y proyecto compartido.");
  }
  return tips;
}

function renderList(ul, items) {
  ul.textContent = "";
  for (const t of items) {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  }
}

function defaultState() {
  return {
    stageIndex: 0,
    sceneIndex: 0,
    stats: { love: 50, maturity: 50, trust: 50, wellbeing: 50 },
    log: [],
    pendingAdvance: null,
  };
}

let state = defaultState();

function updateHUD() {
  const { stats } = state;

  els.statLove.textContent = String(stats.love);
  els.statMaturity.textContent = String(stats.maturity);
  els.statTrust.textContent = String(stats.trust);
  els.statWellbeing.textContent = String(stats.wellbeing);

  setBar(els.barLove, stats.love / 100);
  setBar(els.barMaturity, stats.maturity / 100);
  setBar(els.barTrust, stats.trust / 100);
  setBar(els.barWellbeing, stats.wellbeing / 100);
}

function currentStage() {
  return GAME_DATA.stages[state.stageIndex];
}

function currentScene() {
  return currentStage().scenes[state.sceneIndex];
}

function renderScene() {
  const stage = currentStage();
  const scene = currentScene();

  els.stageName.textContent = stage.name;
  els.sceneCount.textContent = `${state.stageIndex + 1}.${state.sceneIndex + 1} / ${
    stage.scenes.length
  }`;

  els.sceneContext.textContent = scene.context;
  els.sceneTitle.textContent = scene.title;
  els.sceneText.textContent = scene.text;

  els.feedbackWrap.hidden = true;
  els.choices.textContent = "";

  for (const choice of scene.choices) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choiceBtn";
    btn.dataset.choiceId = choice.id;

    const title = document.createElement("div");
    title.className = "choiceBtn__title";
    const label = document.createElement("span");
    label.textContent = choice.label;
    const delta = document.createElement("span");
    delta.textContent = summarizeDelta(choice.effects);
    delta.style.color = "rgba(255,255,255,0.7)";
    delta.style.fontFamily = "var(--mono)";
    delta.style.fontSize = "0.85rem";
    title.appendChild(label);
    title.appendChild(delta);

    const hint = document.createElement("div");
    hint.className = "choiceBtn__hint";
    hint.textContent = choice.hint || "";

    btn.appendChild(title);
    btn.appendChild(hint);
    btn.addEventListener("click", () => onPickChoice(choice));
    els.choices.appendChild(btn);
  }

  updateHUD();
}

function applyEffects(effects) {
  const s = state.stats;

  s.love = clamp(s.love + (effects.love || 0), 0, 100);
  s.maturity = clamp(s.maturity + (effects.maturity || 0), 0, 100);
  s.trust = clamp(s.trust + (effects.trust || 0), 0, 100);
  s.wellbeing = clamp(s.wellbeing + (effects.wellbeing || 0), 0, 100);
}

function nextPointerAfterChoice() {
  const stage = currentStage();
  const isLastSceneInStage = state.sceneIndex >= stage.scenes.length - 1;

  if (!isLastSceneInStage) return { stageIndex: state.stageIndex, sceneIndex: state.sceneIndex + 1 };

  const isLastStage = state.stageIndex >= GAME_DATA.stages.length - 1;
  if (!isLastStage) return { stageIndex: state.stageIndex + 1, sceneIndex: 0 };

  return null;
}

function onPickChoice(choice) {
  // Bloquea doble click: ocultamos opciones y avanzamos via "Continuar"
  for (const el of els.choices.querySelectorAll("button")) el.disabled = true;

  applyEffects(choice.effects || {});
  updateHUD();

  state.log.push({
    stage: currentStage().name,
    scene: currentScene().title,
    choice: choice.label,
    effects: choice.effects || {},
  });

  const next = nextPointerAfterChoice();
  state.pendingAdvance = next;

  // Feedback educativo siempre (según requerimiento). Si falta texto, damos uno genérico.
  const fallback =
    "El amor es un proceso: emoción + decisión + hábitos. La libertad implica elegir con respeto, sin depender.";
  els.feedbackText.textContent = choice.feedback || fallback;
  els.feedbackWrap.hidden = false;
  els.btnContinue.focus();
}

function advance() {
  const next = state.pendingAdvance;
  state.pendingAdvance = null;

  if (!next) {
    endGame();
    return;
  }

  state.stageIndex = next.stageIndex;
  state.sceneIndex = next.sceneIndex;
  renderScene();
}

function endGame() {
  const endingKey = computeEnding(state.stats);
  const ending = GAME_DATA.endings[endingKey];

  els.endingBadge.textContent = ending.badge;
  els.endingTitle.textContent = ending.title;
  els.endingText.textContent = ending.text;

  const analysis = state.log.map((x) => `${x.stage} — ${x.scene}: ${x.choice}`);
  const tips = buildTips(state.stats);

  renderList(els.analysisList, analysis);
  renderList(els.tipsList, tips);

  showOnly("end");
  setStatus("Final alcanzado. Puedes jugar de nuevo y explorar otras decisiones.", "idle");
}

function resetAndShowStart() {
  state = defaultState();
  showOnly("start");
  updateHUD();
  setStatus("Listo para comenzar.", "idle");
}

function init() {
  showOnly("start");
  updateHUD();
  setStatus("Cuando quieras, comienza.", "idle");
}

els.btnStart.addEventListener("click", () => {
  showOnly("game");
  state.stageIndex = 0;
  state.sceneIndex = 0;
  state.log = [];
  state.pendingAdvance = null;
  renderScene();
  setStatus("Elige con libertad y conciencia.", "idle");
});

els.btnContinue.addEventListener("click", () => {
  advance();
});

els.btnRestart.addEventListener("click", () => {
  resetAndShowStart();
});

els.btnPlayAgain.addEventListener("click", () => {
  resetAndShowStart();
});

init();

