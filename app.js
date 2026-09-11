/**
 * Three Colors of Madness — Prologue Sampler
 * Widow's Bight civic reel · silent-film presentation
 */
(function () {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsRoot = document.getElementById("dots");
  const iris = document.getElementById("iris");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnRestart = document.getElementById("btn-restart");
  const btnMotion = document.getElementById("btn-motion");
  const filmFrame = document.getElementById("film-frame");

  let index = 0;
  let timer = null;
  let transitioning = false;
  let motionOn = true;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setMotion(on) {
    motionOn = on && !prefersReduced;
    document.body.classList.toggle("reduce-motion", !motionOn);
    btnMotion.setAttribute("aria-pressed", motionOn ? "true" : "false");
    btnMotion.textContent = motionOn ? "Motion" : "Still";
  }

  // Build progress dots
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dot" + (i === 0 ? " active" : "");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Slide " + (i + 1));
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      goTo(i);
    });
    dotsRoot.appendChild(b);
  });

  const dots = Array.from(dotsRoot.querySelectorAll(".dot"));

  function durationFor(i) {
    const d = parseInt(slides[i].dataset.duration, 10);
    return Number.isFinite(d) ? d : 5000;
  }

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function scheduleAdvance() {
    clearTimer();
    // Do not auto-loop past the final blackout; wait for Restart
    if (index >= slides.length - 1) return;
    timer = setTimeout(() => goTo(index + 1), durationFor(index));
  }

  function updateDots() {
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === index);
      d.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function irisCycle(then) {
    if (!motionOn) {
      then();
      return;
    }
    iris.classList.remove("open", "opening");
    iris.classList.add("shut");
    // force reflow
    void iris.offsetWidth;
    window.setTimeout(() => {
      then();
      iris.classList.remove("shut");
      iris.classList.add("opening");
      window.setTimeout(() => {
        iris.classList.remove("opening");
        iris.classList.add("open");
      }, 820);
    }, 420);
  }

  function showSlide(next, withIris) {
    if (next === index && slides[index].classList.contains("active")) {
      scheduleAdvance();
      return;
    }
    if (transitioning) return;
    transitioning = true;
    clearTimer();

    const apply = () => {
      const prev = slides[index];
      prev.classList.remove("active");
      prev.classList.add("leaving");
      index = next;
      const cur = slides[index];
      cur.classList.add("active");
      updateDots();
      window.setTimeout(() => {
        prev.classList.remove("leaving");
        transitioning = false;
        scheduleAdvance();
      }, withIris ? 100 : 700);
    };

    if (withIris) {
      irisCycle(apply);
    } else {
      apply();
    }
  }

  function goTo(i, opts) {
    const options = opts || {};
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    if (clamped === index && !options.force) {
      scheduleAdvance();
      return;
    }
    const useIris =
      options.iris === true ||
      clamped === 0 ||
      clamped === slides.length - 1 ||
      (index === 0 && clamped === 1);
    showSlide(clamped, useIris);
  }

  function next() {
    if (index >= slides.length - 1) return;
    goTo(index + 1);
  }

  function prev() {
    if (index <= 0) return;
    goTo(index - 1);
  }

  function restart() {
    clearTimer();
    transitioning = false;
    // hard reset visual state
    slides.forEach((s) => s.classList.remove("active", "leaving"));
    index = 0;
    slides[0].classList.add("active");
    updateDots();
    iris.classList.remove("open", "opening");
    iris.classList.add("shut");
    void iris.offsetWidth;
    window.setTimeout(() => {
      iris.classList.remove("shut");
      iris.classList.add("opening");
      window.setTimeout(() => {
        iris.classList.remove("opening");
        iris.classList.add("open");
        scheduleAdvance();
      }, 820);
    }, 200);
  }

  // Events
  btnNext.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });
  btnPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });
  btnRestart.addEventListener("click", (e) => {
    e.stopPropagation();
    restart();
  });
  btnMotion.addEventListener("click", (e) => {
    e.stopPropagation();
    setMotion(!motionOn);
  });

  filmFrame.addEventListener("click", () => next());

  document.addEventListener("keydown", (e) => {
    if (e.target && /^(INPUT|TEXTAREA|BUTTON)$/i.test(e.target.tagName)) {
      // allow buttons; still handle arrows globally except when typing
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    }
    if (e.code === "Space" || e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      restart();
    }
  });

  // Init
  // Optional deep-link: ?s=0..n for QA / share
  const params = new URLSearchParams(window.location.search);
  const startParam = parseInt(params.get("s"), 10);
  if (Number.isFinite(startParam) && startParam >= 0 && startParam < slides.length) {
    slides[0].classList.remove("active");
    index = startParam;
    slides[index].classList.add("active");
    updateDots();
  }

  setMotion(!prefersReduced);
  iris.classList.add("shut");
  window.setTimeout(() => {
    iris.classList.remove("shut");
    iris.classList.add("opening");
    window.setTimeout(() => {
      iris.classList.remove("opening");
      iris.classList.add("open");
      scheduleAdvance();
    }, prefersReduced ? 200 : 850);
  }, 300);
})();
