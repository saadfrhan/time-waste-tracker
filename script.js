const secondsParagraph = document.getElementById("seconds")
const codedButton = document.getElementById("coded-button");
const streakDisplay = document.getElementById("streak-display"); // Add this to your HTML!

const fiveYearsAgo = new Date();
fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

let isCodingToday = localStorage.getItem("isCodingToday") === "true";
let secondsReclaimed = parseInt(localStorage.getItem("reclaimedTime")) || 0;
let streak = localStorage.getItem("daysStreak") || 0;
const lastCodedDate = localStorage.getItem("lastCodedDate");


setInterval(() => {
  let now = new Date();
  if (isCodingToday) {
    secondsReclaimed++;

    secondsParagraph.innerHTML = `Reclaimed: ${secondsReclaimed}s`;

    localStorage.setItem("reclaimedTime", secondsReclaimed)
  } else {
    const totalWasted = Math.floor((now - fiveYearsAgo) / 1000);
    secondsParagraph.innerHTML = `Wasted: ${totalWasted}s`
  }
}, 1000)

function updateStreak() {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  if (lastCodedDate === todayString) {
    console.log("Streak already updated for today.");
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  if (lastCodedDate === yesterdayString) {
    streak++;
  } else {
    streak = 1;
  }

  localStorage.setItem("daysStreak", streak);
  localStorage.setItem("lastCodedDate", todayString);
  renderStreak();
}


if (isCodingToday) {
  document.getElementsByTagName("body")[0].style.backgroundColor = "green";
}

function renderStreak() {
  streakDisplay.innerHTML = `🔥 Current Streak: ${streak} Days`;
}

codedButton.addEventListener("click", () => {
  isCodingToday = true;
  localStorage.setItem("isCodingToday", "true")
  document.getElementsByTagName("body")[0].style.backgroundColor = "green";
  updateStreak();
})

renderStreak()


