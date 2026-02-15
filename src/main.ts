const secondsParagraph = document.getElementById(
  "seconds",
) as HTMLParagraphElement;
const codedButton = document.getElementById(
  "coded-button",
) as HTMLButtonElement;
const streakDisplay = document.getElementById(
  "streak-display",
) as HTMLParagraphElement;

type IsoDateString = string & { __isoDateBrand: true };

function asIsoDate(value: string): IsoDateString {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid ISO date: ${value}`);
  }
  return value as IsoDateString;
}

type AppState = {
  streak: number;
  secondsReclaimed: number;
  lastCodedDate: IsoDateString | null;
  isCodingToday: boolean;
};

const state: AppState = {
  streak: parseInt(localStorage.getItem("daysStreak") || "0"),
  secondsReclaimed: parseInt(localStorage.getItem("reclaimedTime") || "0"),
  lastCodedDate: localStorage.getItem("lastCodedDate")
    ? asIsoDate(localStorage.getItem("lastCodedDate")!)
    : null,
  isCodingToday: localStorage.getItem("isCodingToday") === "true",
};

function evalStreak(
  lastCodedDate: IsoDateString | null,
  todayString: IsoDateString,
) {
  if (!lastCodedDate) {
    return "increment";
  } else if (lastCodedDate === todayString) {
    return "none";
  }
  const yesterday = new Date(todayString);
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastCodedDate === yesterday.toISOString().split("T")[0]) {
    return "increment";
  }
  return "reset";
}

function handleStreakResult(
  result: ReturnType<typeof evalStreak>,
  todayString: IsoDateString,
) {
  switch (result) {
    case "increment":
      state.streak++;
      state.lastCodedDate = todayString;
      localStorage.setItem("daysStreak", String(state.streak));
      localStorage.setItem("lastCodedDate", todayString);
      renderStreak();
      break;
    case "reset":
      state.streak = 0;
      state.secondsReclaimed = 0;
      state.isCodingToday = false;
      state.lastCodedDate = todayString;
      localStorage.setItem("daysStreak", "0");
      localStorage.setItem("reclaimedTime", "0");
      localStorage.setItem("isCodingToday", "false");
      localStorage.setItem("lastCodedDate", todayString);
      document.body.classList.remove("active-mode");
      alert("STREAK BROKEN...");
      renderStreak();
      break;
    case "none":
      break;
  }
}

function getTimerText(
  isCodingToday: boolean,
  secondsReclaimed: number,
  now = new Date().getTime(),
) {
  if (isCodingToday) {
    return {
      text: `Reclaimed: ${secondsReclaimed}s`,
      updatedSeconds: secondsReclaimed + 1,
    };
  } else {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    const totalWasted = Math.floor((now - fiveYearsAgo.getTime()) / 1000);
    return {
      text: `Wasted: ${totalWasted}s`,
      updatedSeconds: secondsReclaimed,
    };
  }
}

function renderStreak() {
  streakDisplay.innerHTML = `🔥 Current Streak: ${state.streak} Days`;
}

function renderTimer(text: string) {
  secondsParagraph.innerHTML = text;
}

function updateOrCheckStreak() {
  const todayString = new Date().toISOString().split("T")[0] as IsoDateString;
  handleStreakResult(evalStreak(state.lastCodedDate, todayString), todayString);
}

setInterval(() => {
  const result = getTimerText(state.isCodingToday, state.secondsReclaimed);
  state.secondsReclaimed = result.updatedSeconds;

  if (state.isCodingToday) {
    localStorage.setItem("reclaimedTime", String(state.secondsReclaimed));
  }

  renderTimer(result.text);
}, 1000);

codedButton.addEventListener("click", () => {
  if (!state.isCodingToday) {
    state.secondsReclaimed = 0;
    localStorage.setItem("reclaimedTime", "0");
  }

  state.isCodingToday = true;
  localStorage.setItem("isCodingToday", "true");
  document.body.classList.add("active-mode");
  updateOrCheckStreak();
});

updateOrCheckStreak();

if (state.isCodingToday) {
  document.body.classList.add("active-mode");
}

renderStreak();

export {};
