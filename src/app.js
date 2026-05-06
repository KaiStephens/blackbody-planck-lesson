(function () {
  const slides = window.LESSON_SLIDES || [];
  const videos = window.LESSON_VIDEOS || {};
  const slidesEl = document.getElementById("slides");
  const actionBar = document.getElementById("actionBar");
  const dots = document.getElementById("dots");
  const inkCanvas = document.getElementById("inkCanvas");
  const inkCtx = inkCanvas.getContext("2d");

  const state = {
    current: 0,
    scenes: {},
    ink: {},
    drawing: false,
    penMode: "pen",
    penColor: "#58c4dd",
    penSize: 9,
    activeStroke: null,
    activePointerId: null
  };

  const graphColors = ["#93a8b8", "#85d996", "#ff8c42", "#f4d35e", "#58c4dd"];
  const tempValues = [375, 750, 1500, 3000, 6000];

  renderSlides();
  renderMath();
  buildDots();
  setupDeck();
  setupControls();
  setupDrawing();
  setupVideoModal();

  if (window.lucide) {
    window.lucide.createIcons();
  }

  function renderSlides() {
    slidesEl.innerHTML = slides.map((slide) => {
      return `
        <section data-slide-id="${slide.id}">
          <div class="slide-shell slide-${slide.id}">
            <header class="slide-title">
              ${slide.eyebrow ? `<p class="eyebrow">${slide.eyebrow}</p>` : ""}
              <h1>${slide.title}</h1>
              ${slide.prompt ? `<p class="prompt">${slide.prompt}</p>` : ""}
            </header>
            ${slide.html}
          </div>
        </section>`;
    }).join("");
  }

  function renderMath() {
    if (!window.katex) return;
    document.querySelectorAll("[data-katex]").forEach((el) => {
      const displayMode = el.classList.contains("formula") || el.classList.contains("work-step");
      window.katex.render(el.getAttribute("data-katex"), el, {
        displayMode,
        throwOnError: false,
        strict: false
      });
    });
  }

  function setupDeck() {
    window.Reveal.initialize({
      width: 960,
      height: 540,
      margin: 0,
      controls: false,
      progress: false,
      hash: false,
      center: false,
      transition: "fade",
      backgroundTransition: "fade",
      slideNumber: false,
      minScale: 0.05,
      maxScale: 2.1,
      scrollActivationWidth: null,
      keyboard: true,
      touch: true
    });

    window.Reveal.on("ready", () => {
      updateUI();
      initCurrentScene();
    });

    window.Reveal.on("slidechanged", () => {
      updateUI();
      redrawInk();
      initCurrentScene();
    });

    window.addEventListener("resize", debounce(() => {
      resizeCanvas();
      rerenderCurrentGraph();
    }, 120));
  }

  function setupControls() {
    document.getElementById("prevSlide").addEventListener("click", () => window.Reveal.prev());
    document.getElementById("nextSlide").addEventListener("click", () => window.Reveal.next());
    document.getElementById("fullScreen").addEventListener("click", () => {
      const root = document.documentElement;
      if (!document.fullscreenElement) {
        root.requestFullscreen && root.requestFullscreen();
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }
    });

    actionBar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      runAction(button.getAttribute("data-action"));
    });
  }

  function updateUI() {
    const indices = window.Reveal.getIndices();
    state.current = indices.h || 0;
    const slide = slides[state.current];
    if (!slide) return;

    document.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("current", index === state.current);
    });

    actionBar.innerHTML = "";
    slide.actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `action-btn ${action.style || ""}`.trim();
      button.textContent = action.label;
      button.setAttribute("data-action", action.action);
      actionBar.appendChild(button);
    });
  }

  function buildDots() {
    dots.innerHTML = "";
    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => window.Reveal.slide(index));
      dots.appendChild(dot);
    });
  }

  function currentSlideId() {
    return slides[state.current] && slides[state.current].id;
  }

  function currentSection() {
    const id = currentSlideId();
    return document.querySelector(`[data-slide-id="${id}"]`);
  }

  function sceneState(id) {
    if (!state.scenes[id]) state.scenes[id] = {};
    return state.scenes[id];
  }

  function initCurrentScene() {
    const id = currentSlideId();
    if (id === "observed") initObservedGraph();
    if (id === "prediction") initPredictionGraph();
    if (id === "mismatch") initMismatchGraph();
  }

  function rerenderCurrentGraph() {
    const id = currentSlideId();
    if (id === "observed") initObservedGraph(true);
    if (id === "prediction") initPredictionGraph(true);
    if (id === "mismatch") initMismatchGraph(true);
  }

  function runAction(action) {
    const [scope, command] = action.split(":");
    if (scope === "video") return openVideo(command);

    const handlers = {
      hook: hookAction,
      blackbody: blackbodyAction,
      heating: heatingAction,
      observed: observedAction,
      prediction: predictionAction,
      mismatch: mismatchAction,
      bio: bioAction,
      hypothesis: hypothesisAction,
      quant: quantAction,
      derive: deriveAction,
      sample: sampleAction,
      wrap: wrapAction
    };

    if (handlers[scope]) handlers[scope](command);
  }

  function revealStep(selector) {
    const el = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!el) return;
    el.classList.add("visible");
    if (window.gsap) {
      window.gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" });
    }
  }

  function hookAction(command) {
    if (command !== "heat") return;
    const scene = document.getElementById("hookFilament");
    scene.classList.add("filament-hot");
    if (window.gsap) {
      window.gsap.fromTo("#hookFilament .vector-bulb__outer-glow, #hookFilament .vector-bulb__filament-glow", { scale: 0.9, transformOrigin: "50% 34%" }, { scale: 1.06, duration: 0.9, repeat: 1, yoyo: true, ease: "sine.inOut" });
    }
  }

  function blackbodyAction(command) {
    if (command === "absorb") {
      revealStep("#bbStep1");
      if (window.gsap) {
        const timeline = window.gsap.timeline();
        timeline.to("#absorberScene .beam", {
          opacity: 0.06,
          x: 250,
          scaleX: 0.52,
          transformOrigin: "100% 50%",
          duration: 0.75,
          stagger: 0.07,
          ease: "power2.in"
        });
        timeline.fromTo("#absorberScene .cavity-rim, #absorberScene .cavity-hot-edge", {
          scale: 0.92,
          transformOrigin: "50% 50%"
        }, {
          scale: 1.08,
          duration: 0.22,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut"
        }, "-=0.18");
        timeline.to("#absorberScene .cavity-spark", {
          opacity: 0.95,
          scale: 1.4,
          transformOrigin: "50% 50%",
          duration: 0.22,
          stagger: 0.05,
          yoyo: true,
          repeat: 1
        }, "-=0.26");
      }
    }
    if (command === "emit") {
      revealStep("#bbStep2");
      revealStep("#bbStep3");
      if (window.gsap) {
        const timeline = window.gsap.timeline();
        timeline.to("#absorberScene .thermal-glow", { opacity: 0.48, duration: 0.45, ease: "sine.out" });
        timeline.fromTo("#absorberScene .out-wave", {
          opacity: 0,
          x: -34,
          scaleX: 0.82,
          transformOrigin: "0% 50%"
        }, {
          opacity: 1,
          x: 0,
          scaleX: 1,
          duration: 0.72,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.2");
        timeline.fromTo("#absorberScene .emission-dot", {
          opacity: 0,
          x: -24,
          scale: 0.45,
          transformOrigin: "50% 50%"
        }, {
          opacity: 0.95,
          x: 28,
          scale: 1,
          duration: 0.58,
          stagger: 0.08,
          ease: "power2.out"
        }, "-=0.48");
      }
    }
  }

  function heatingAction(command) {
    const s = sceneState("heating");
    const scene = document.getElementById("heatingFilament");
    if (command === "next") {
      s.stage = ((s.stage || 0) % 4) + 1;
      scene.classList.remove("heating-stage-1", "heating-stage-2", "heating-stage-3", "heating-stage-4");
      scene.classList.add(`heating-stage-${s.stage}`);
      document.querySelectorAll("#spectrumStrip .spectrum-chip").forEach((chip, index) => {
        chip.classList.toggle("active", index < s.stage);
      });
      if (window.gsap) {
        window.gsap.fromTo("#heatingFilament .vector-bulb__filament-glow", { scaleX: 0.82, transformOrigin: "50% 50%" }, { scaleX: 1, duration: 0.28, ease: "back.out(2)" });
      }
    }
    if (command === "intensity") revealStep("#heatIntensity");
    if (command === "peak") revealStep("#heatPeak");
  }

  function bioAction() {
    ["#bio1", "#bio2", "#bio3", "#bio4"].forEach((selector, index) => {
      setTimeout(() => revealStep(selector), index * 160);
    });
  }

  function hypothesisAction(command) {
    if (command === "wave" && window.gsap) {
      window.gsap.fromTo("#continuousWave", { strokeDasharray: "1 900", strokeDashoffset: 900 }, { strokeDasharray: "900 900", strokeDashoffset: 0, duration: 1.1, ease: "power2.out" });
    }
    if (command === "packets") {
      if (window.gsap) {
        window.gsap.to("#continuousWave", { opacity: 0.18, duration: 0.35 });
        window.gsap.fromTo("#packetScene .packet", { opacity: 0, scale: 0.45, transformOrigin: "center" }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: "back.out(2)" });
      } else {
        document.querySelectorAll("#packetScene .packet").forEach((packet) => packet.style.opacity = 1);
      }
    }
    if (command === "eq") {
      ["#eqOne", "#eqMany", "#defE", "#defH", "#defF"].forEach((selector, index) => {
        setTimeout(() => revealStep(selector), index * 160);
      });
    }
  }

  function quantAction(command) {
    if (command === "ramp" && window.gsap) {
      window.gsap.to("#rampBox", {
        attr: { cx: 472, cy: 188 },
        duration: 1.1,
        ease: "sine.inOut"
      });
    }
    if (command === "stairs" && window.gsap) {
      const steps = [
        { cx: 805, cy: 335 },
        { cx: 885, cy: 275 },
        { cx: 965, cy: 215 },
        { cx: 1045, cy: 155 }
      ];
      const timeline = window.gsap.timeline();
      steps.forEach((step) => timeline.to("#stairBox", { attr: step, duration: 0.28, ease: "steps(1)" }));
    }
    if (command === "energy") revealStep("#energySteps");
  }

  function deriveAction(command) {
    const map = {
      frequency: ["#derive1", "#derive4"],
      constant: ["#derive2", "#derive5"],
      equation: ["#derive3"]
    };
    (map[command] || []).forEach((selector, index) => {
      setTimeout(() => revealStep(selector), index * 140);
    });
  }

  function sampleAction(command) {
    const map = {
      step1: "#sample1",
      step2: "#sample2",
      step3: "#sample3",
      answer: "#sampleAnswer"
    };
    revealStep(map[command]);
  }

  function wrapAction(command) {
    if (command !== "packets") return;
    revealStep("#wrapMessage");
    if (window.gsap) {
      window.gsap.to("#wrapWave", { opacity: 0.18, duration: 0.4 });
      window.gsap.fromTo("#wrapPackets .packet", { opacity: 0, scale: 0.45, transformOrigin: "center" }, { opacity: 1, scale: 1, duration: 0.42, stagger: 0.1, ease: "back.out(2)" });
    }
  }

  function observedAction(command) {
    const s = sceneState("observed");
    initObservedGraph();
    if (command === "add") {
      s.shown = Math.min((s.shown || 0) + 1, tempValues.length);
      const path = document.querySelector(`#observedGraph .temp-curve-${s.shown - 1}`);
      const label = document.querySelector(`#observedGraph .temp-label-${s.shown - 1}`);
      if (path) {
        path.style.opacity = 1;
        animatePath(path);
      }
      if (label) revealStep(label);
    }
    if (command === "peaks") {
      s.peaks = true;
      initObservedGraph(true);
      if (window.gsap) {
        window.gsap.fromTo("#observedGraph .peak-guide", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08 });
      }
    }
    if (command === "reset") {
      s.shown = 0;
      s.peaks = false;
      initObservedGraph(true);
    }
  }

  function predictionAction(command) {
    const s = sceneState("prediction");
    initPredictionGraph();
    if (command === "show") {
      s.predicted = true;
      const path = document.querySelector("#predictionGraph .predicted");
      const label = document.querySelector("#predictionGraph .predicted-label");
      if (path) {
        path.style.opacity = 1;
        animatePath(path);
      }
      if (label) revealStep(label);
    }
  }

  function mismatchAction(command) {
    const s = sceneState("mismatch");
    initMismatchGraph();
    if (command === "observed") {
      s.observed = true;
      const path = document.querySelector("#mismatchGraph .observed");
      const label = document.querySelector("#mismatchGraph .observed-label");
      if (path) {
        path.style.opacity = 1;
        animatePath(path);
      }
      if (label) revealStep(label);
    }
    if (command === "uv") {
      s.uv = true;
      initMismatchGraph(true);
      if (window.gsap) {
        window.gsap.fromTo("#mismatchGraph .uv-highlight", { opacity: 0 }, { opacity: 1, duration: 0.45 });
      }
    }
    if (command === "name") {
      s.name = true;
      initMismatchGraph(true);
      revealStep("#mismatchGraph .catastrophe-label");
    }
  }

  function initObservedGraph(force) {
    const container = document.getElementById("observedGraph");
    if (!container) return;
    const s = sceneState("observed");
    if (s.initialized && !force) return;
    s.initialized = true;
    s.shown = s.shown || 0;
    s.sliderT = s.sliderT || 3000;

    const chart = makeChart(container, { yMax: 1.05 });
    addVisibleBand(chart);
    addAxes(chart, "Wavelength (x10^3 nm)", "Intensity");

    tempValues.forEach((temp, index) => {
      const path = chart.plot.append("path")
        .datum(blackbodyData(temp))
        .attr("class", `curve temp-curve-${index}`)
        .attr("d", chart.line)
        .attr("stroke", graphColors[index])
        .style("opacity", index < s.shown ? 1 : 0);

      chart.plot.append("text")
        .attr("class", `curve-label temp-label-${index}`)
        .attr("x", chart.x(Math.min(6.15, Math.max(0.95, wienPeak(temp) + 2.15))))
        .attr("y", chart.y(curveValueAt(temp, Math.min(6.15, Math.max(0.95, wienPeak(temp) + 2.15)))))
        .text(`${temp} K`)
        .style("opacity", index < s.shown ? 1 : 0);

      if (index < s.shown) path.style("opacity", 1);
    });

    chart.plot.append("path")
      .datum(blackbodyData(s.sliderT))
      .attr("class", "curve slider-curve")
      .attr("d", chart.line)
      .attr("stroke", "#f5fbff")
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", "6 8")
      .attr("opacity", 0.72);

    if (s.peaks) addPeakGuides(chart);

    const slider = document.getElementById("temperatureSlider");
    const label = document.getElementById("temperatureLabel");
    if (slider && label) {
      slider.value = s.sliderT;
      label.textContent = `${s.sliderT} K`;
      slider.oninput = () => {
        s.sliderT = Number(slider.value);
        label.textContent = `${s.sliderT} K`;
        const curve = d3.select("#observedGraph .slider-curve");
        curve.datum(blackbodyData(s.sliderT)).attr("d", chart.line);
      };
    }
  }

  function initPredictionGraph(force) {
    const container = document.getElementById("predictionGraph");
    if (!container) return;
    const s = sceneState("prediction");
    if (s.initialized && !force) return;
    s.initialized = true;

    const chart = makeChart(container, { yMax: 1.05 });
    addVisibleBand(chart);
    addAxes(chart, "Wavelength", "Intensity");

    chart.plot.append("path")
      .datum(classicalData())
      .attr("class", "curve predicted")
      .attr("d", chart.line)
      .style("opacity", s.predicted ? 1 : 0);

    chart.plot.append("text")
      .attr("class", "curve-label predicted-label hidden-step")
      .attr("x", chart.x(1.35))
      .attr("y", chart.y(0.74))
      .text("predicted");

    if (s.predicted) {
      document.querySelector("#predictionGraph .predicted-label").classList.add("visible");
    }
  }

  function initMismatchGraph(force) {
    const container = document.getElementById("mismatchGraph");
    if (!container) return;
    const s = sceneState("mismatch");
    if (s.initialized && !force) return;
    s.initialized = true;

    const chart = makeChart(container, { yMax: 1.05 });
    addVisibleBand(chart);
    addAxes(chart, "Wavelength", "Intensity");

    if (s.uv) {
      chart.plot.append("rect")
        .attr("class", "uv-highlight")
        .attr("x", chart.x(0.06))
        .attr("y", chart.y(1.05))
        .attr("width", chart.x(0.38) - chart.x(0.06))
        .attr("height", chart.y(0) - chart.y(1.05))
        .attr("fill", "rgba(167, 139, 250, 0.2)")
        .attr("stroke", "rgba(167, 139, 250, 0.7)")
        .attr("opacity", 1);
    }

    chart.plot.append("path")
      .datum(classicalData())
      .attr("class", "curve predicted")
      .attr("d", chart.line)
      .style("opacity", 1);

    chart.plot.append("path")
      .datum(blackbodyData(3000, 0.93))
      .attr("class", "curve observed")
      .attr("d", chart.line)
      .style("opacity", s.observed ? 1 : 0);

    chart.plot.append("text")
      .attr("class", "curve-label")
      .attr("x", chart.x(0.82))
      .attr("y", chart.y(0.9))
      .text("predicted");

    chart.plot.append("text")
      .attr("class", "curve-label observed-label hidden-step")
      .attr("x", chart.x(2.25))
      .attr("y", chart.y(0.46))
      .text("experimentally observed");

    chart.plot.append("text")
      .attr("id", "catastropheText")
      .attr("class", "graph-note catastrophe-label hidden-step")
      .attr("x", chart.x(0.55))
      .attr("y", chart.y(0.16))
      .text("ultraviolet catastrophe");

    if (s.observed) document.querySelector("#mismatchGraph .observed-label").classList.add("visible");
    if (s.name) document.querySelector("#mismatchGraph .catastrophe-label").classList.add("visible");
  }

  function makeChart(container, options) {
    container.innerHTML = "";
    const rect = container.getBoundingClientRect();
    const width = Math.max(720, rect.width || 960);
    const height = Math.max(390, rect.height || 500);
    const margin = { top: 28, right: 48, bottom: 68, left: 78 };
    const svg = d3.select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", `visibleGradient-${container.id}`)
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");
    [
      ["0%", "#5b3df5"],
      ["18%", "#2358ff"],
      ["36%", "#19b8ff"],
      ["55%", "#27d17f"],
      ["72%", "#f4d35e"],
      ["88%", "#ff8c42"],
      ["100%", "#ff5a5f"]
    ].forEach(([offset, color]) => gradient.append("stop").attr("offset", offset).attr("stop-color", color));

    defs.append("marker")
      .attr("id", `arrow-${container.id}`)
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#f4d35e");

    const x = d3.scaleLinear().domain([0, 7]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([0, options.yMax || 1]).range([height - margin.bottom, margin.top]);
    const line = d3.line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveCatmullRom.alpha(0.55));

    const plot = svg.append("g");
    return { svg, defs, plot, width, height, margin, x, y, line, gradientId: `visibleGradient-${container.id}`, arrowId: `arrow-${container.id}` };
  }

  function addAxes(chart, xLabel, yLabel) {
    const xTicks = d3.range(0, 8, 1);
    const yTicks = d3.range(0, 1.01, 0.25);

    chart.plot.append("g")
      .selectAll("line")
      .data(xTicks)
      .join("line")
      .attr("class", "grid-line")
      .attr("x1", (d) => chart.x(d))
      .attr("x2", (d) => chart.x(d))
      .attr("y1", chart.y(0))
      .attr("y2", chart.y(1.05));

    chart.plot.append("g")
      .selectAll("line")
      .data(yTicks)
      .join("line")
      .attr("class", "grid-line")
      .attr("x1", chart.x(0))
      .attr("x2", chart.x(7))
      .attr("y1", (d) => chart.y(d))
      .attr("y2", (d) => chart.y(d));

    chart.plot.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${chart.y(0)})`)
      .call(d3.axisBottom(chart.x).tickValues(xTicks).tickFormat((d) => d === 0 ? "0" : d));

    chart.plot.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${chart.x(0)},0)`)
      .call(d3.axisLeft(chart.y).tickValues([]));

    chart.plot.append("text")
      .attr("class", "axis-label")
      .attr("x", (chart.x(0) + chart.x(7)) / 2)
      .attr("y", chart.height - 18)
      .attr("text-anchor", "middle")
      .text(xLabel);

    chart.plot.append("text")
      .attr("class", "axis-label")
      .attr("transform", `translate(24 ${(chart.y(0) + chart.y(1)) / 2}) rotate(-90)`)
      .attr("text-anchor", "middle")
      .text(yLabel);
  }

  function addVisibleBand(chart) {
    chart.plot.append("rect")
      .attr("x", chart.x(0.38))
      .attr("y", chart.y(1.05))
      .attr("width", chart.x(0.75) - chart.x(0.38))
      .attr("height", chart.y(0) - chart.y(1.05))
      .attr("fill", `url(#${chart.gradientId})`)
      .attr("opacity", 0.88);

    chart.plot.append("text")
      .attr("class", "visible-band-label")
      .attr("x", chart.x(0.565))
      .attr("y", chart.y(0.04))
      .attr("text-anchor", "middle")
      .text("visible");
  }

  function addPeakGuides(chart) {
    const first = tempValues[0];
    const last = tempValues[tempValues.length - 1];
    const firstPeak = Math.min(7, wienPeak(first));
    const lastPeak = wienPeak(last);

    chart.plot.append("line")
      .attr("class", "peak-guide")
      .attr("x1", chart.x(firstPeak))
      .attr("y1", chart.y(0.16))
      .attr("x2", chart.x(lastPeak))
      .attr("y2", chart.y(0.88))
      .attr("stroke", "#f4d35e")
      .attr("stroke-width", 4)
      .attr("marker-end", `url(#${chart.arrowId})`);

    chart.plot.append("text")
      .attr("class", "graph-note peak-guide")
      .attr("x", chart.x(1.05))
      .attr("y", chart.y(0.98))
      .text("peak shifts shorter");
  }

  function wienPeak(temp) {
    return 2898 / temp;
  }

  function curveValueAt(temp, x) {
    const peak = wienPeak(temp);
    const amp = Math.pow(temp / 6000, 0.64);
    const ratio = Math.max(0.02, x / peak);
    const shape = Math.pow(ratio, 3) * Math.exp(3 * (1 - ratio));
    return Math.min(1, amp * shape);
  }

  function blackbodyData(temp, scale) {
    const multiplier = scale || 1;
    return d3.range(0.06, 7.01, 0.045).map((x) => ({
      x,
      y: Math.min(1.02, curveValueAt(temp, x) * multiplier)
    }));
  }

  function classicalData() {
    return d3.range(0.06, 7.01, 0.045).map((x) => ({
      x,
      y: Math.min(1.04, 0.48 / (x + 0.09))
    }));
  }

  function animatePath(pathNode) {
    const node = pathNode.node ? pathNode.node() : pathNode;
    if (!node || !node.getTotalLength || !window.gsap) return;
    const length = node.getTotalLength();
    window.gsap.fromTo(node, {
      strokeDasharray: `${length} ${length}`,
      strokeDashoffset: length
    }, {
      strokeDashoffset: 0,
      duration: 1.15,
      ease: "power2.out",
      onComplete: () => {
        node.style.strokeDasharray = "";
        node.style.strokeDashoffset = "";
      }
    });
  }

  function setupDrawing() {
    const drawToggle = document.getElementById("drawToggle");
    const penMode = document.getElementById("penMode");
    const eraserMode = document.getElementById("eraserMode");
    const penSize = document.getElementById("penSize");

    resizeCanvas();

    drawToggle.addEventListener("click", () => {
      state.drawing = !state.drawing;
      inkCanvas.classList.toggle("active", state.drawing);
      drawToggle.classList.toggle("active", state.drawing);
      drawToggle.setAttribute("aria-pressed", String(state.drawing));
      drawToggle.querySelector("span").textContent = state.drawing ? "draw on" : "draw off";
      if (window.Reveal && window.Reveal.configure) {
        window.Reveal.configure({ touch: !state.drawing });
      }
      if (!state.drawing) {
        state.activeStroke = null;
        state.activePointerId = null;
      }
    });

    penMode.addEventListener("click", () => {
      state.penMode = "pen";
      penMode.classList.add("active");
      eraserMode.classList.remove("active");
    });

    eraserMode.addEventListener("click", () => {
      state.penMode = "eraser";
      eraserMode.classList.add("active");
      penMode.classList.remove("active");
    });

    document.querySelectorAll(".swatch").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        state.penColor = swatch.getAttribute("data-color");
        document.querySelectorAll(".swatch").forEach((item) => item.classList.remove("selected"));
        swatch.classList.add("selected");
        state.penMode = "pen";
        penMode.classList.add("active");
        eraserMode.classList.remove("active");
      });
    });

    penSize.addEventListener("input", () => {
      state.penSize = Number(penSize.value);
    });

    document.getElementById("undoInk").addEventListener("click", () => {
      const id = currentSlideId();
      if (!state.ink[id]) return;
      state.ink[id].pop();
      redrawInk();
    });

    document.getElementById("clearInk").addEventListener("click", () => {
      state.ink[currentSlideId()] = [];
      redrawInk();
    });

    if (window.PointerEvent) {
      inkCanvas.addEventListener("pointerdown", startPointerStroke);
      inkCanvas.addEventListener("pointermove", continuePointerStroke);
      inkCanvas.addEventListener("pointerup", endPointerStroke);
      inkCanvas.addEventListener("pointercancel", endPointerStroke);
      inkCanvas.addEventListener("lostpointercapture", endPointerStroke);
    } else {
      inkCanvas.addEventListener("touchstart", startTouchStroke, { passive: false });
      inkCanvas.addEventListener("touchmove", continueTouchStroke, { passive: false });
      inkCanvas.addEventListener("touchend", endTouchStroke, { passive: false });
      inkCanvas.addEventListener("touchcancel", endTouchStroke, { passive: false });
      inkCanvas.addEventListener("mousedown", startMouseStroke);
      window.addEventListener("mousemove", continueMouseStroke);
      window.addEventListener("mouseup", endMouseStroke);
    }
  }

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.floor(window.innerWidth * ratio);
    const height = Math.floor(window.innerHeight * ratio);
    if (inkCanvas.width !== width || inkCanvas.height !== height) {
      inkCanvas.width = width;
      inkCanvas.height = height;
      inkCanvas.style.width = `${window.innerWidth}px`;
      inkCanvas.style.height = `${window.innerHeight}px`;
      inkCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      redrawInk();
    }
  }

  function startPointerStroke(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (!beginStroke(event, event.pointerId, event)) return;
    if (inkCanvas.setPointerCapture) {
      try {
        inkCanvas.setPointerCapture(event.pointerId);
      } catch (error) {
        // Some embedded browsers expose pointer events without reliable capture.
      }
    }
  }

  function continuePointerStroke(event) {
    if (state.activePointerId !== event.pointerId) return;
    const points = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
    continueStroke(event, points);
  }

  function endPointerStroke(event) {
    if (state.activePointerId !== null && state.activePointerId !== event.pointerId) return;
    if (inkCanvas.releasePointerCapture && inkCanvas.hasPointerCapture && inkCanvas.hasPointerCapture(event.pointerId)) {
      try {
        inkCanvas.releasePointerCapture(event.pointerId);
      } catch (error) {
        // Capture may already be gone after touch cancellation.
      }
    }
    finishStroke(event);
  }

  function startTouchStroke(event) {
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) return;
    beginStroke(event, touch.identifier, touch);
  }

  function continueTouchStroke(event) {
    if (state.activePointerId === null) return;
    const touch = findTouch(event.touches, state.activePointerId) || findTouch(event.changedTouches, state.activePointerId);
    if (!touch) return;
    continueStroke(event, [touch]);
  }

  function endTouchStroke(event) {
    if (state.activePointerId === null) return;
    const touch = findTouch(event.changedTouches, state.activePointerId);
    if (!touch && event.touches && event.touches.length) return;
    finishStroke(event);
  }

  function startMouseStroke(event) {
    if (event.button !== 0) return;
    beginStroke(event, "mouse", event);
  }

  function continueMouseStroke(event) {
    if (state.activePointerId !== "mouse") return;
    continueStroke(event, [event]);
  }

  function endMouseStroke(event) {
    if (state.activePointerId !== "mouse") return;
    finishStroke(event);
  }

  function beginStroke(event, pointerId, input) {
    if (!state.drawing || state.activeStroke) return false;
    stopDrawingEvent(event);
    const point = pointerPoint(input);
    state.activeStroke = {
      color: state.penColor,
      size: state.penMode === "eraser" ? state.penSize * 2.4 : state.penSize,
      mode: state.penMode,
      points: [point]
    };
    state.activePointerId = pointerId;
    return true;
  }

  function continueStroke(event, inputs) {
    if (!state.activeStroke) return;
    stopDrawingEvent(event);
    const stroke = state.activeStroke;
    inputs.forEach((input) => stroke.points.push(pointerPoint(input)));
    redrawInk();
    drawStroke(stroke);
  }

  function finishStroke(event) {
    if (!state.activeStroke) return;
    stopDrawingEvent(event);
    const id = currentSlideId();
    if (!state.ink[id]) state.ink[id] = [];
    state.ink[id].push(state.activeStroke);
    state.activeStroke = null;
    state.activePointerId = null;
    redrawInk();
  }

  function stopDrawingEvent(event) {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
  }

  function findTouch(touches, identifier) {
    if (!touches) return null;
    return Array.from(touches).find((touch) => touch.identifier === identifier) || null;
  }

  function pointerPoint(input) {
    return {
      x: input.clientX,
      y: input.clientY,
      pressure: input.pressure || input.force || 0.65
    };
  }

  function redrawInk() {
    inkCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const strokes = state.ink[currentSlideId()] || [];
    strokes.forEach(drawStroke);
  }

  function drawStroke(stroke) {
    if (!stroke.points.length) return;
    inkCtx.save();
    inkCtx.globalCompositeOperation = stroke.mode === "eraser" ? "destination-out" : "source-over";
    inkCtx.strokeStyle = stroke.color;
    inkCtx.lineWidth = stroke.size;
    inkCtx.lineCap = "round";
    inkCtx.lineJoin = "round";
    inkCtx.beginPath();
    stroke.points.forEach((point, index) => {
      if (index === 0) inkCtx.moveTo(point.x, point.y);
      else {
        const prev = stroke.points[index - 1];
        const cx = (prev.x + point.x) / 2;
        const cy = (prev.y + point.y) / 2;
        inkCtx.quadraticCurveTo(prev.x, prev.y, cx, cy);
      }
    });
    inkCtx.stroke();
    inkCtx.restore();
  }

  function setupVideoModal() {
    document.getElementById("closeVideo").addEventListener("click", closeVideo);
    document.getElementById("videoBackdrop").addEventListener("click", closeVideo);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeVideo();
    });
  }

  function openVideo(key) {
    const video = videos[key];
    if (!video) return;
    const modal = document.getElementById("videoModal");
    const frame = document.getElementById("videoFrame");
    const title = document.getElementById("videoTitle");
    const note = document.getElementById("videoNote");
    const link = document.getElementById("videoLink");

    title.textContent = video.title;
    note.textContent = video.note;
    note.hidden = !video.note;
    frame.src = `https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&autoplay=1`;
    link.href = `https://www.youtube.com/watch?v=${video.id}`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeVideo() {
    const modal = document.getElementById("videoModal");
    const frame = document.getElementById("videoFrame");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    frame.src = "";
  }

  function debounce(fn, wait) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }
})();
