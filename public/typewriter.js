// public/typewriter.js

document.addEventListener("DOMContentLoaded", () => {
  const texts = [
    "Data that empowers.",
    "Sustainability in action.",
    "AI for smarter growth.",
    "Farming, reimagined."
  ];

  let i = 0, j = 0, isDeleting = false;
  const el = document.getElementById("typewriter");

  function type() {
    if (!el) return;
    const current = texts[i];
    el.textContent = current.slice(0, j);
    if (!isDeleting && j < current.length) {
      j++;
    } else if (isDeleting && j > 0) {
      j--;
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) i = (i + 1) % texts.length;
      setTimeout(type, 800);
      return;
    }
    setTimeout(type, isDeleting ? 60 : 100);
  }

  type();
});