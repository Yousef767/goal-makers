const servsInner = document.querySelector(".servs-inner");
const nav = document.getElementById("nav");
const menu = document.querySelector(".menu");
const arrow = document.getElementById("arrow");

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

menu.addEventListener("click", () => {
  nav.classList.toggle("active-nav");
});

arrow.addEventListener("click", () => {
  window.scrollTo(0,0)
});
