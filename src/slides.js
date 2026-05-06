(function () {
  const lightBulbMarkup = String.raw`
    <div class="vector-bulb" aria-hidden="true">
      <div class="vector-bulb__outer-glow"></div>
      <img class="vector-bulb__svg" src="assets/bulb-vectorized.svg" alt="">
      <div class="vector-bulb__glass-warmth"></div>
      <div class="vector-bulb__filament-glow"></div>
      <span class="vector-bulb__ray ray-one"></span>
      <span class="vector-bulb__ray ray-two"></span>
      <span class="vector-bulb__ray ray-three"></span>
      <span class="vector-bulb__ray ray-four"></span>
    </div>`;

  window.LESSON_VIDEOS = {
    bulb: {
      id: "XwqJOlu4RUQ",
      title: "Black Body Radiation of a Filament Bulb",
      note: ""
    },
    catastrophe: {
      id: "7BXvc9W97iU",
      title: "Blackbody Radiation and the Ultraviolet Catastrophe",
      note: "Use only a short segment if helpful after students see the predicted and observed curves."
    }
  };

  window.LESSON_SLIDES = [
    {
      id: "hook",
      eyebrow: "",
      title: "Hot objects make light.",
      prompt: "",
      actions: [
        { label: "play bulb clip", action: "video:bulb", style: "primary" },
        { label: "heat filament", action: "hook:heat", style: "yellow" }
      ],
      html: String.raw`
        <div class="visual full-visual">
          <div class="filament-scene" id="hookFilament">
            ${lightBulbMarkup}
          </div>
        </div>`
    },
    {
      id: "blackbody",
      eyebrow: "",
      title: "A blackbody absorbs everything.",
      prompt: "Then, when hot, it is the most efficient possible emitter.",
      actions: [
        { label: "absorb light", action: "blackbody:absorb", style: "primary" },
        { label: "emit radiation", action: "blackbody:emit", style: "yellow" }
      ],
      html: String.raw`
        <div class="visual split">
          <div class="absorber-scene" id="absorberScene">
            <svg class="absorber-svg" viewBox="0 0 900 520" aria-hidden="true">
              <defs>
                <radialGradient id="bbShellGradient" cx="42%" cy="34%" r="72%">
                  <stop offset="0%" stop-color="#263743"></stop>
                  <stop offset="38%" stop-color="#0b1117"></stop>
                  <stop offset="100%" stop-color="#000"></stop>
                </radialGradient>
                <radialGradient id="bbHeatGradient" cx="47%" cy="42%" r="64%">
                  <stop offset="0%" stop-color="rgba(255, 238, 177, 0.95)"></stop>
                  <stop offset="34%" stop-color="rgba(255, 140, 66, 0.55)"></stop>
                  <stop offset="100%" stop-color="rgba(255, 90, 95, 0)"></stop>
                </radialGradient>
                <linearGradient id="bbApertureGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#04070a"></stop>
                  <stop offset="55%" stop-color="#000"></stop>
                  <stop offset="100%" stop-color="#18232c"></stop>
                </linearGradient>
                <linearGradient id="bbRimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="rgba(245, 251, 255, 0.34)"></stop>
                  <stop offset="45%" stop-color="rgba(88, 196, 221, 0.18)"></stop>
                  <stop offset="100%" stop-color="rgba(0, 0, 0, 0.1)"></stop>
                </linearGradient>
                <filter id="bbSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="10" result="blur"></feGaussianBlur>
                  <feMerge>
                    <feMergeNode in="blur"></feMergeNode>
                    <feMergeNode in="SourceGraphic"></feMergeNode>
                  </feMerge>
                </filter>
              </defs>

              <g class="incoming-rays">
                <path class="beam cyan-beam" d="M58 112 C144 136 231 172 346 221"></path>
                <path class="beam" d="M44 260 C144 260 236 260 354 260"></path>
                <path class="beam red-beam" d="M58 408 C151 374 244 333 351 297"></path>
                <path class="beam white-beam" d="M98 184 C184 198 260 222 354 246"></path>
              </g>

              <g class="blackbody-object">
                <ellipse class="blackbody-shadow" cx="472" cy="402" rx="142" ry="26"></ellipse>
                <circle class="blackbody-core" cx="472" cy="260" r="134"></circle>
                <circle class="thermal-glow" cx="472" cy="260" r="134"></circle>
                <path class="shell-highlight" d="M385 194 C419 145 494 128 552 160"></path>
                <path class="shell-highlight mid" d="M576 197 C604 243 598 306 558 350"></path>
                <path class="shell-shadow" d="M393 331 C441 386 526 384 576 330"></path>
                <path class="blackbody-rim" d="M381 162 C423 124 493 112 552 148"></path>
                <path class="blackbody-rim low" d="M374 355 C431 398 519 398 577 352"></path>
                <ellipse class="cavity-rim" cx="393" cy="248" rx="51" ry="42" transform="rotate(-16 393 248)"></ellipse>
                <ellipse class="cavity-inner-rim" cx="393" cy="248" rx="42" ry="33" transform="rotate(-16 393 248)"></ellipse>
                <ellipse class="cavity-hole" cx="393" cy="248" rx="34" ry="27" transform="rotate(-16 393 248)"></ellipse>
                <path class="cavity-inner-line" d="M382 231 L417 244 L386 265 L405 246"></path>
                <path class="cavity-hot-edge" d="M370 246 C381 225 414 221 430 242"></path>
                <circle class="cavity-spark spark-one" cx="414" cy="240" r="4"></circle>
                <circle class="cavity-spark spark-two" cx="388" cy="266" r="3"></circle>
              </g>

              <g class="emission-field">
                <path class="out-wave wave-hot" d="M602 174 C635 140 668 208 701 174 S767 208 800 174"></path>
                <path class="out-wave" d="M620 254 C653 220 686 288 719 254 S785 288 818 254"></path>
                <path class="out-wave wave-red" d="M602 334 C635 300 668 368 701 334 S767 368 800 334"></path>
                <circle class="emission-dot dot-one" cx="628" cy="205" r="6"></circle>
                <circle class="emission-dot dot-two" cx="672" cy="292" r="5"></circle>
                <circle class="emission-dot dot-three" cx="742" cy="238" r="4"></circle>
              </g>
            </svg>
          </div>
          <div>
            <ul class="fact-list">
              <li class="hidden-step" id="bbStep1">ideal object that absorbs all incoming radiation</li>
              <li class="hidden-step" id="bbStep2">gives off electromagnetic radiation when hot</li>
              <li class="hidden-step" id="bbStep3">that emitted radiation is blackbody radiation</li>
            </ul>
          </div>
        </div>`
    },
    {
      id: "heating",
      eyebrow: "Temperature",
      title: "Hotter shifts the spectrum.",
      prompt: "The color change is the clue: the peak moves toward shorter wavelength.",
      actions: [
        { label: "heat", action: "heating:next", style: "yellow" },
        { label: "more intensity", action: "heating:intensity", style: "primary" },
        { label: "shorter peak", action: "heating:peak", style: "red" }
      ],
      html: String.raw`
        <div class="visual split">
          <div>
            <div class="filament-scene" id="heatingFilament">
              ${lightBulbMarkup}
            </div>
            <div class="spectrum-strip" id="spectrumStrip" aria-hidden="true">
              <span class="spectrum-chip red-hot"></span>
              <span class="spectrum-chip orange-hot"></span>
              <span class="spectrum-chip yellow-hot"></span>
              <span class="spectrum-chip white-hot"></span>
            </div>
          </div>
          <div>
            <ul class="fact-list">
              <li class="hidden-step" id="heatIntensity">total intensity of emitted radiation increases</li>
              <li class="hidden-step" id="heatPeak">wavelength of maximum intensity shifts shorter</li>
            </ul>
          </div>
        </div>`
    },
    {
      id: "prediction",
      eyebrow: "Classical physics",
      title: "The prediction goes wrong.",
      prompt: "Classical waves gave too much energy at short wavelengths.",
      actions: [
        { label: "show prediction", action: "prediction:show", style: "yellow" },
        { label: "play explanation", action: "video:catastrophe", style: "primary" }
      ],
      html: String.raw`
        <div class="visual full-visual">
          <div class="graph-wrap">
            <div class="graph" id="predictionGraph"></div>
          </div>
        </div>`
    },
    {
      id: "observed",
      eyebrow: "Observed data",
      title: "Each temperature has a peak.",
      prompt: "The hotter curve is taller, and its peak is farther left.",
      actions: [
        { label: "add curve", action: "observed:add", style: "primary" },
        { label: "peak shift", action: "observed:peaks", style: "yellow" },
        { label: "reset graph", action: "observed:reset" }
      ],
      html: String.raw`
        <div class="visual full-visual">
          <div>
            <div class="graph-wrap">
              <div class="graph" id="observedGraph"></div>
            </div>
            <div class="temperature-readout">
              <span>interactive T</span>
              <input id="temperatureSlider" type="range" min="375" max="6000" step="25" value="3000">
              <span id="temperatureLabel">3000 K</span>
            </div>
          </div>
        </div>`
    },
    {
      id: "planckBio",
      eyebrow: "Biography",
      title: "Max Planck made the small assumption.",
      prompt: "A short biography beat before the physics turns.",
      actions: [
        { label: "reveal facts", action: "bio:facts", style: "primary" }
      ],
      html: String.raw`
        <div class="visual portrait-grid">
          <img class="portrait" src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Max_Planck_1933.jpg" alt="Max Planck portrait">
          <div class="bio-facts">
            <div class="hidden-step" id="bio1"><span>1858-1947</span>German physicist</div>
            <div class="hidden-step" id="bio2"><span>around 1900</span>blackbody radiation</div>
            <div class="hidden-step" id="bio3"><span>1918</span>Nobel Prize in Physics</div>
            <div class="hidden-step muted" id="bio4"><span>tone</span>radical, and even Planck was cautious</div>
          </div>
        </div>`
    },
    {
      id: "deriveEnergy",
      eyebrow: "Derivation",
      title: "Deriving an equation for energy.",
      prompt: "Planck's move: tie the size of one energy packet to the wave's frequency.",
      actions: [
        { label: "frequency", action: "derive:frequency", style: "primary" },
        { label: "constant h", action: "derive:constant", style: "yellow" },
        { label: "E = hf", action: "derive:equation", style: "red" }
      ],
      html: String.raw`
        <div class="visual problem-layout">
          <div class="problem-text">
            Hotter objects emit higher-frequency light.
            <span class="given">Planck assumed energy is not continuous.</span>
            <span class="given">One allowed packet has an energy set by frequency.</span>
          </div>
          <div class="workboard">
            <div class="work-step hidden-step" id="derive1" data-katex="E \propto f"></div>
            <div class="work-step hidden-step" id="derive2" data-katex="h = 6.626 \times 10^{-34}\ {\rm J\,s}"></div>
            <div class="work-step hidden-step" id="derive3" data-katex="E = hf"></div>
            <div class="fact-list">
              <li class="hidden-step" id="derive4">higher frequency means a larger quantum</li>
              <li class="hidden-step" id="derive5">h converts frequency into energy</li>
            </div>
          </div>
        </div>`
    },
    {
      id: "hypothesis",
      eyebrow: "Planck's hypothesis",
      title: "Energy comes in packets.",
      prompt: "Not any amount. Only allowed bundles.",
      actions: [
        { label: "continuous wave", action: "hypothesis:wave", style: "primary" },
        { label: "quantize", action: "hypothesis:packets", style: "yellow" },
        { label: "equation", action: "hypothesis:eq", style: "red" }
      ],
      html: String.raw`
        <div class="visual split">
          <div class="packet-scene" id="packetScene">
            <svg class="packet-svg" viewBox="0 0 900 520" aria-hidden="true">
              <path class="wave-path" id="continuousWave" d="M74 260 C126 170 178 350 230 260 S334 350 386 260 S490 170 542 260 S646 350 698 260 S802 170 854 260"></path>
              <g class="packet" transform="translate(145 260)"><circle r="16"></circle></g>
              <g class="packet" transform="translate(285 260)"><circle r="16"></circle></g>
              <g class="packet" transform="translate(425 260)"><circle r="16"></circle></g>
              <g class="packet" transform="translate(565 260)"><circle r="16"></circle></g>
              <g class="packet" transform="translate(705 260)"><circle r="16"></circle></g>
            </svg>
          </div>
          <div>
            <div class="formula hidden-step" id="eqOne" data-katex="E = hf"></div>
            <div class="formula small hidden-step" id="eqMany" data-katex="E = nhf,\quad n = 1,2,3,\ldots"></div>
            <ul class="fact-list">
              <li class="hidden-step" id="defE">E = energy of one quantum</li>
              <li class="hidden-step" id="defH">h = Planck's constant</li>
              <li class="hidden-step" id="defF">f = frequency</li>
            </ul>
          </div>
        </div>`
    },
    {
      id: "quantization",
      eyebrow: "Quantization",
      title: "Ramp or stairs?",
      prompt: "Planck's idea: energy changes in chunks, not every possible value.",
      actions: [
        { label: "ramp", action: "quant:ramp", style: "primary" },
        { label: "stairs", action: "quant:stairs", style: "yellow" },
        { label: "connect to energy", action: "quant:energy", style: "red" }
      ],
      html: String.raw`
        <div class="visual full-visual">
          <div>
            <div class="quant-scene" id="quantScene">
              <svg class="quant-svg" viewBox="35 20 1135 475" aria-hidden="true">
                <defs>
                  <linearGradient id="rampFill" x1="90" y1="425" x2="535" y2="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#58c4dd" stop-opacity="0.08"></stop>
                    <stop offset="1" stop-color="#58c4dd" stop-opacity="0.5"></stop>
                  </linearGradient>
                  <linearGradient id="levelGlow" x1="660" y1="0" x2="1120" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#f4d35e" stop-opacity="0.1"></stop>
                    <stop offset="1" stop-color="#f4d35e" stop-opacity="0.95"></stop>
                  </linearGradient>
                  <radialGradient id="energyOrb" cx="35%" cy="28%" r="68%">
                    <stop offset="0" stop-color="#fff7c7"></stop>
                    <stop offset="0.48" stop-color="#f4d35e"></stop>
                    <stop offset="1" stop-color="#ff8c42"></stop>
                  </radialGradient>
                </defs>

                <g class="quant-panel continuous-panel">
                  <text class="analogy-label" x="86" y="74">RAMP</text>
                  <text class="quant-caption" x="86" y="112">smooth, continuous energy</text>
                  <path class="quant-axis" d="M84 430 H550 M84 430 V150"></path>
                  <text class="quant-axis-label" x="58" y="145">E</text>
                  <path class="ramp-fill" d="M110 410 L535 150 L535 410 Z"></path>
                  <path class="ramp" d="M110 410 L535 150"></path>
                  <path class="quant-trace" d="M128 399 C228 352 322 280 450 205"></path>
                  <circle class="choice-dot muted-dot" cx="190" cy="361" r="8"></circle>
                  <circle class="choice-dot muted-dot" cx="275" cy="309" r="8"></circle>
                  <circle class="choice-dot muted-dot" cx="360" cy="257" r="8"></circle>
                  <circle class="choice-dot muted-dot" cx="448" cy="203" r="8"></circle>
                  <circle class="energy-orb" id="rampBox" cx="170" cy="373" r="27"></circle>
                </g>

                <g class="quant-panel stair-panel">
                  <text class="analogy-label" x="660" y="74">STAIRS</text>
                  <text class="quant-caption" x="660" y="112">jumps between allowed levels</text>
                  <path class="quant-axis" d="M656 430 H1125 M656 430 V150"></path>
                  <text class="quant-axis-label" x="630" y="145">E</text>
                  <path class="level-line" d="M690 365 H1110"></path>
                  <path class="level-line" d="M690 305 H1110"></path>
                  <path class="level-line" d="M690 245 H1110"></path>
                  <path class="level-line" d="M690 185 H1110"></path>
                  <path class="stairs" d="M690 425 H765 V365 H845 V305 H925 V245 H1005 V185 H1110"></path>
                  <text class="level-label" x="1122" y="374">1hf</text>
                  <text class="level-label" x="1122" y="314">2hf</text>
                  <text class="level-label" x="1122" y="254">3hf</text>
                  <text class="level-label" x="1122" y="194">4hf</text>
                  <circle class="energy-orb" id="stairBox" cx="720" cy="395" r="27"></circle>
                </g>

                <g class="hidden-step" id="energySteps">
                  <path class="energy-callout-line" d="M930 160 C940 128 970 105 1016 98"></path>
                  <rect class="energy-callout-bg" x="850" y="34" width="284" height="82" rx="8"></rect>
                  <text class="energy-callout" x="878" y="68">only these energies</text>
                  <text class="energy-callout formula-text" x="878" y="99">E = nhf</text>
                </g>
              </svg>
            </div>
          </div>
        </div>`
    },
    {
      id: "sample",
      eyebrow: "Sample problem",
      title: "One violet quantum.",
      prompt: "",
      actions: [
        { label: "c = f lambda", action: "sample:step1", style: "primary" },
        { label: "f = c / lambda", action: "sample:step2", style: "yellow" },
        { label: "E = hf", action: "sample:step3", style: "red" },
        { label: "answer", action: "sample:answer" }
      ],
      html: String.raw`
        <div class="visual problem-layout">
          <div class="problem-text">
            A quantum of violet light has wavelength:
            <span class="given" data-katex="\lambda = 4.20 \times 10^{-7}\ {\rm m}"></span>
            <span class="given">Find frequency and energy.</span>
          </div>
          <div class="workboard">
            <div class="work-step hidden-step" id="sample1" data-katex="c = f\lambda"></div>
            <div class="work-step hidden-step" id="sample2" data-katex="f = {c \over \lambda}"></div>
            <div class="work-step hidden-step" id="sample3" data-katex="E = hf"></div>
            <div class="answer hidden-step" id="sampleAnswer">
              <div class="work-step" data-katex="f = 7.14 \times 10^{14}\ {\rm Hz}"></div>
              <div class="work-step" data-katex="E = 4.73 \times 10^{-19}\ {\rm J}"></div>
            </div>
          </div>
        </div>`
    },
    {
      id: "wrap",
      eyebrow: "Close",
      title: "A tiny assumption opened quantum physics.",
      prompt: "",
      actions: [
        { label: "collapse to packets", action: "wrap:packets", style: "yellow" }
      ],
      html: String.raw`
        <div class="visual full-visual">
          <div>
            <div class="wrap-scene" id="wrapScene">
              <svg class="wrap-svg" viewBox="0 0 900 360" aria-hidden="true">
                <path class="wave-path" id="wrapWave" d="M70 180 C122 92 174 268 226 180 S330 268 382 180 S486 92 538 180 S642 268 694 180 S798 92 850 180"></path>
                <g id="wrapPackets">
                  <g class="packet" transform="translate(170 180)"><circle r="15"></circle></g>
                  <g class="packet" transform="translate(300 180)"><circle r="15"></circle></g>
                  <g class="packet" transform="translate(430 180)"><circle r="15"></circle></g>
                  <g class="packet" transform="translate(560 180)"><circle r="15"></circle></g>
                  <g class="packet" transform="translate(690 180)"><circle r="15"></circle></g>
                </g>
              </svg>
            </div>
            <div class="wrap-message hidden-step" id="wrapMessage">Energy is emitted and absorbed in separate packets.</div>
          </div>
        </div>`
    }
  ];
})();
