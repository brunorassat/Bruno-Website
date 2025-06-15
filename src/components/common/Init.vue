<script setup>
import { watch, ref, onMounted, onUnmounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useDebounceFn } from "@vueuse/core";
import { showContact } from "@src/store";

const { width } = useWindowSize();
const shown = ref(false);

// Optional: enable or disable cleanup of #book-me from the URL
const CLEANUP_HASH = true;

onMounted(() => {
  const root = document.documentElement;
  const html = document.getElementsByTagName("html")[0];
  const start = new Date().getTime();

  /* GET TIME TO LOAD PAGE */
  window.onload = function () {
    const end = new Date().getTime();
    const timeTaken = end - start;
    document.documentElement.setAttribute(
      "data-speed",
      Math.round(timeTaken / 1000),
    );
  };

  /* CHECK IF IS IOS DEVICE */
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) {
    document.documentElement.setAttribute("data-ios", 1);
  }

  /* SET SCROLL BEHAVIOR */
  setTimeout(() => {
    html.style["scroll-behavior"] = "smooth";
  }, 500);

  /* SCROLL OBSERVER FOR PAGE */
  let prevPos = 0;
  let isScrollingUp = false;

  function flip(attr, state) {
    root.setAttribute(attr, String(state));
  }

  const scrollHandler = useDebounceFn(() => {
    const pos = window.scrollY;
    const delta = pos - prevPos;
    const scrollDirection = Math.sign(delta) === -1;
    const isBottom =
      pos + window.innerHeight > document.body.offsetHeight - 100;
    const isTop = pos < 100;

    if (delta < -15 || delta > 15) {
      isScrollingUp = scrollDirection;
    }

    flip("data-is-scrolling-up", isScrollingUp);
    flip("data-is-bottom", isBottom);
    flip("data-is-top", isTop);

    prevPos = pos;
  }, 20);

  window.addEventListener("scroll", () => scrollHandler(), { passive: true });

  /* PARALLAX ANIMATIONS */
  const parallaxReveal = document.querySelectorAll(".nebulix-parallax");
  if (!document.documentElement.dataset.ios) {
    parallaxReveal.forEach((el) => {
      const img = el.querySelector(".parallax");

      img.animate(
        {
          transform: ["none", "translateY(30%)"],
        },
        {
          fill: "both",
          timeline: new ViewTimeline({ subject: el }),
          rangeStart: { rangeName: "exit", offset: CSS.percent(5) },
          rangeEnd: { rangeName: "exit", offset: CSS.percent(100) },
        },
      );
    });
  }

  /* CONTACT FORM CLICK HANDLER */
  const contactClick = (e) => {
    const link = e.target.closest("a");
    if (link && link.hash === "#book-me") {
      e.preventDefault();

      // Clean hash immediately if it got added
      if (window.location.hash === "#book-me") {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search,
        );
      }

      showContact.set(true);
    }
  };

  document.addEventListener("click", contactClick);

  /* URL HASH CHECK ON LOAD + OPTIONAL CLEANUP */
  const checkHash = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === "#book-me") {
      showContact.set(true);

      if (CLEANUP_HASH) {
        setTimeout(() => {
          if (window.location.hash === "#book-me") {
            window.history.replaceState(
              null,
              '',
              window.location.pathname + window.location.search,
            );
          }
        }, 100);
      }
    }
  };

  checkHash();
  window.addEventListener("hashchange", checkHash);

  onUnmounted(() => {
    document.removeEventListener("click", contactClick);
    window.removeEventListener("hashchange", checkHash);
  });
});

/* CREDITS, PLEASE LEAVE THIS IN PLACE */
watch(width, (val) => {
  if (!shown.value) {
    console.log(
      "%c ♻️🔋+ 🧠👷🏽+ 🗜 = 🚀🍃🌐" +
        "\n%cThis site has a low carbon footprint " +
        "\n%c🪙CREDITS:" +
        "\n%cTheme based on Nebulix 🌌" +
        "\n%cby: https://unfolding.io",
      "font-family:Verdana; font-size: 20px; color: #2A4D47; font-weight:bold; padding: 5px 0; opacity: 0.5; ",
      "font-family:Verdana; font-size: 25px; color: #2A4D47; font-weight:bold; padding: 5px 0; ",
      "font-family:Verdana; font-size:16px; color: #2A4D47; font-weight:bold;  padding: 5px 0; ",
      "font-family:Verdana; font-size:12px; color: #2A4D47; padding: 2px 0; ",
      "font-family:Verdana; font-size:12px; color: #2A4D47; padding: 2px 0; ",
    );
    shown.value = true;
  }
});
</script>