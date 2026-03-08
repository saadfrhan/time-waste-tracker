var secondsParagraph = document.getElementById("seconds");
var codedButton = document.getElementById("coded-button");
var streakDisplay = document.getElementById("streak-display");
function asIsoDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error("Invalid ISO date: ".concat(value));
    }
    return value;
}
var state = {
    streak: parseInt(localStorage.getItem("daysStreak") || "0"),
    secondsReclaimed: parseInt(localStorage.getItem("reclaimedTime") || "0"),
    lastCodedDate: localStorage.getItem("lastCodedDate")
        ? asIsoDate(localStorage.getItem("lastCodedDate"))
        : null,
    isCodingToday: localStorage.getItem("isCodingToday") === "true",
};
function evalStreak(lastCodedDate, todayString) {
    if (!lastCodedDate) {
        return "increment";
    }
    else if (lastCodedDate === todayString) {
        return "none";
    }
    var yesterday = new Date(todayString);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastCodedDate === yesterday.toISOString().split("T")[0]) {
        return "increment";
    }
    return "reset";
}
function handleStreakResult(result, todayString) {
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
function getTimerText(isCodingToday, secondsReclaimed, now) {
    if (now === void 0) { now = new Date().getTime(); }
    if (isCodingToday) {
        return {
            text: "Reclaimed: ".concat(secondsReclaimed, "s"),
            updatedSeconds: secondsReclaimed + 1,
        };
    }
    else {
        var fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        var totalWasted = Math.floor((now - fiveYearsAgo.getTime()) / 1000);
        return {
            text: "Wasted: ".concat(totalWasted, "s"),
            updatedSeconds: secondsReclaimed,
        };
    }
}
function renderStreak() {
    streakDisplay.innerHTML = "\uD83D\uDD25 Current Streak: ".concat(state.streak, " Days");
}
function renderTimer(text) {
    secondsParagraph.innerHTML = text;
}
function updateOrCheckStreak() {
    var todayString = new Date().toISOString().split("T")[0];
    handleStreakResult(evalStreak(state.lastCodedDate, todayString), todayString);
}
setInterval(function () {
    var result = getTimerText(state.isCodingToday, state.secondsReclaimed);
    state.secondsReclaimed = result.updatedSeconds;
    if (state.isCodingToday) {
        localStorage.setItem("reclaimedTime", String(state.secondsReclaimed));
    }
    renderTimer(result.text);
}, 1000);
codedButton.addEventListener("click", function () {
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
