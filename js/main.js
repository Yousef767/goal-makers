const servsInner = document.querySelector(".servs-inner");
const nav = document.querySelector("nav");
const menu = document.querySelector(".menu");
const arrow = document.getElementById("arrow");

servsInner.addEventListener("click", () => {
  servsInner.classList.toggle("showSer");
});

window.addEventListener("scroll", () => {
  if (window.scrollY >= 100) {
    nav.classList.add("nav");
  } else {
    nav.classList.remove("nav");
  }
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
