let coutersCards = document.querySelectorAll(".counterCard h1");
let counterInner = document.querySelector(".counter");
let started = false;

window.onscroll = function () {
  if (window.scrollY >= counterInner.offsetTop - 400) {
    if (!started) {
      coutersCards.forEach((num) => startCount(num));
    }
    started = true;
  }
};

function startCount(el) {
  let goal = el.dataset.num;
  let count = setInterval(() => {
    el.textContent++;
    if (el.textContent == goal) {
      clearInterval(count);
    }
  }, 3000 / goal);
}
