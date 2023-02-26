let allTags = document.querySelectorAll(".text span");
let postInners = document.querySelectorAll(".postsInner");

allTags.forEach((e) => {
  e.addEventListener("click", () => {
    let id = e.dataset.id;
    let inner = document.querySelector(`#${id}`);
    console.log(id);
    allTags.forEach((e) => {
      e.classList.remove("active");
    });
    postInners.forEach((e) => {
      e.style.display='none'
    });
    e.classList.add("active");
    inner.style.display='flex';
  });
});
