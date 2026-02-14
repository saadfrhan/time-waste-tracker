const secondsParagraph = document.getElementById("seconds")
const codedButton = document.getElementById("coded-button")

const now = new Date();
const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());

let isCodingToday = false;

setInterval(() => {
  if (isCodingToday) {
    secondsParagraph.innerHTML = Math.floor((now + fiveYearsAgo) / 1000);
  } else secondsParagraph.innerHTML = Math.floor((now - fiveYearsAgo) / 1000);
}, 1000)

function changeTextColor() {
  isCodingToday = true;
  secondsParagraph.style.color = "green"
}

codedButton.addEventListener("click", changeTextColor)

