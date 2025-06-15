<script setup>
import { watch, ref, onMounted, onUnmounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useDebounceFn } from "@vueuse/core";
import { showContact } from "@src/store";

const { width } = useWindowSize();
const shown = ref(false);

// Optional: enable or disable cleanup of #book-me from the URL
const CLEANUP_HASH = true;

// Bulletproof modal trigger function
const triggerModal = () => {
  console.log('Triggering modal...');
  showContact.set(true);
  
  // Clean hash after modal is definitely open
  if (CLEANUP_HASH) {
    setTimeout(() => {
      if (window.location.hash === "#book-me") {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search,
        );
      }
    }, 200);
  }
};

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

  /* BULLETPROOF CONTACT MODAL HANDLERS */
  
  // Handle ALL clicks - this catches everything
  const handleAllClicks = (e) => {
    const link = e.target.closest("a");
    if (link) {
      const href = link.getAttribute('href');
      const hash = link.hash;
      
      // Check if it's a book-me link (multiple ways to be sure)
      if (hash === "#book-me" || 
          href === "#book-me" || 
          href?.endsWith("#book-me") ||
          link.getAttribute('href')?.includes('#book-me')) {
        
        console.log('Book-me link clicked:', href);
        e.preventDefault();
        e.stopPropagation();
        
        triggerModal();
        return false;
      }
    }
  };

  // Handle hash changes (when someone navigates directly to #book-me)
  const handleHashChange = () => {
    const hash = window.location.hash.toLowerCase();
    console.log('Hash changed to:', hash);
    
    if (hash === "#book-me") {
      triggerModal();
    }
  };

  // Handle initial page load with hash
  const handleInitialHash = () => {
    const hash = window.location.hash.toLowerCase();
    console.log('Initial hash:', hash);
    
    if (hash === "#book-me") {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        triggerModal();
      }, 100);
    }
  };

  // Attach event listeners with high priority
  document.addEventListener("click", handleAllClicks, true); // Use capture phase
  window.addEventListener("hashchange", handleHashChange);
  
  // Check initial hash on load
  handleInitialHash();
  
  // Also check after a delay in case of late navigation
  setTimeout(handleInitialHash, 500);

  /* CLEANUP FUNCTION */
  onUnmounted(() => {
    document.removeEventListener("click", handleAllClicks, true);
    window.removeEventListener("hashchange", handleHashChange);
  });
});

/* WATCH FOR MODAL STATE CHANGES */
watch(showContact, (val) => {
  console.log('Modal state changed:', val);
  
  // Only clean hash if modal is opening and hash exists
  if (val && CLEANUP_HASH && window.location.hash === "#book-me") {
    // Double-check after a delay
    setTimeout(() => {
      if (showContact.get() && window.location.hash === "#book-me") {
        console.log('Cleaning hash...');
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search,
        );
      }
    }, 300);
  }
});

/* PERIODIC HASH CHECKER (NUCLEAR OPTION) */
// This runs every 2 seconds to catch any missed #book-me hashes
let hashChecker;
onMounted(() => {
  hashChecker = setInterval(() => {
    if (window.location.hash === "#book-me" && !showContact.get()) {
      console.log('Periodic hash check found #book-me, triggering modal');
      triggerModal();
    }
  }, 2000);
});

onUnmounted(() => {
  if (hashChecker) {
    clearInterval(hashChecker);
  }
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