const nav = document.getElementById("nav");
const menu = document.querySelector(".menu");
const servsInner = document.querySelector(".servs-inner");
const arrow = document.getElementById("arrow");

menu.addEventListener("click", () => {
  nav.classList.toggle("active-nav");
});

servsInner.addEventListener("click", () => {
  servsInner.classList.toggle("showSer");
});

window.addEventListener("scroll", () => {
  if (window.scrollY >= 500) {
    arrow.style.display = "flex";
  } else {
    arrow.style.display = "none";
  }
});

arrow.addEventListener("click", () => {
  window.scrollTo(0,0)
});