(function () {
    // Run only if calculator HTML exists
    const tireAInput = document.getElementById('tireA');
    const tireBInput = document.getElementById('tireB');
    const calcBtn = document.getElementById('calcBtn');
    const resultsContainer = document.getElementById('results');

    if (!tireAInput || !tireBInput || !calcBtn) {
        console.warn("⚠ Tire calculator HTML not found — wp-calculator.js did not initialize.");
        return;
    }

    // ---------------------- COMMON TIRE SIZE DATABASE ----------------------
    const COMMON_SIZES = [
        "135/80 R13", "145/70 R13", "145/80 R13", "155/65 R13", "155/70 R13", "155/80 R13",
        "165/65 R13", "165/70 R13", "175/70 R13",
        "155/65 R14", "165/60 R14", "165/65 R14", "165/70 R14", "175/65 R14", "175/70 R14",
        "185/55 R14", "185/60 R14", "185/65 R14", "185/70 R14", "195/60 R14",
        "145/65 R15", "155/60 R15", "175/55 R15", "175/60 R15", "175/65 R15", "185/55 R15",
        "185/60 R15", "185/65 R15", "195/45 R15", "195/50 R15", "195/55 R15", "195/60 R15",
        "195/65 R15", "205/60 R15", "205/65 R15", "215/65 R15", "215/75 R15",
        "185/50 R16", "185/55 R16", "195/45 R16", "195/50 R16", "195/55 R16", "195/60 R16",
        "205/45 R16", "205/50 R16", "205/55 R16", "205/60 R16", "215/45 R16", "215/55 R16",
        "215/60 R16", "215/65 R16", "215/70 R16", "225/50 R16", "225/55 R16", "225/60 R16",
        "225/75 R16", "235/60 R16", "235/70 R16", "245/70 R16",
        "205/40 R17", "205/45 R17", "205/50 R17", "215/40 R17", "215/45 R17", "215/50 R17",
        "215/55 R17", "215/60 R17", "225/45 R17", "225/50 R17", "225/55 R17", "225/60 R17",
        "225/65 R17", "235/45 R17", "235/50 R17", "235/55 R17", "235/65 R17", "245/40 R17",
        "245/45 R17", "245/65 R17", "255/40 R17", "255/60 R17", "265/65 R17", "265/70 R17",
        "215/40 R18", "225/35 R18", "225/40 R18", "225/45 R18", "225/50 R18", "225/55 R18",
        "225/60 R18", "235/40 R18", "235/45 R18", "235/50 R18", "235/55 R18", "235/60 R18",
        "245/35 R18", "245/40 R18", "245/45 R18", "245/50 R18", "255/35 R18", "255/40 R18",
        "255/45 R18", "255/55 R18", "265/35 R18", "265/60 R18", "275/35 R18", "275/40 R18",
        "285/35 R18",
        "225/35 R19", "225/40 R19", "235/35 R19", "235/40 R19", "235/50 R19", "235/55 R19",
        "245/30 R19", "245/35 R19", "245/40 R19", "245/45 R19", "255/30 R19", "255/35 R19",
        "255/40 R19", "255/45 R19", "255/50 R19", "265/30 R19", "265/35 R19", "265/50 R19",
        "275/30 R19", "275/35 R19", "275/40 R19", "285/30 R19", "285/35 R19", "285/45 R19",
        "295/30 R19", "295/35 R19", "305/30 R19",
        "235/35 R20", "245/30 R20", "245/35 R20", "245/40 R20", "245/45 R20", "255/30 R20",
        "255/35 R20", "255/40 R20", "255/45 R20", "265/30 R20", "265/35 R20", "265/40 R20",
        "265/45 R20", "275/30 R20", "275/35 R20", "275/40 R20", "275/45 R20", "285/30 R20",
        "285/35 R20", "295/30 R20", "295/35 R20", "295/40 R20", "305/30 R20", "315/35 R20",
        "245/35 R21", "255/30 R21", "265/35 R21", "265/40 R21", "265/45 R21", "275/30 R21",
        "275/35 R21", "275/45 R21", "285/30 R21", "285/35 R21", "285/40 R21", "295/35 R21",
        "295/40 R21", "315/30 R21", "325/30 R21",
        "265/30 R22", "265/35 R22", "265/40 R22", "285/30 R22", "285/35 R22", "285/40 R22",
        "285/45 R22", "295/25 R22", "295/30 R22", "305/35 R22", "325/35 R22"
    ];

    // ---------------------- EVENT HANDLERS ----------------------
    calcBtn.addEventListener('click', calculateAndDisplay);

    [tireAInput, tireBInput].forEach(inp => {
        inp.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                closeAllLists();
                calculateAndDisplay();
            }
        });
    });

    setupAutocomplete(tireAInput, COMMON_SIZES);
    setupAutocomplete(tireBInput, COMMON_SIZES);

    // ---------------------- AUTOCOMPLETE ----------------------
    function setupAutocomplete(inp, arr) {
        let currentFocus = -1;

        inp.addEventListener("input", function () {
            const val = this.value;
            closeAllLists();

            if (!val) return;

            const list = document.createElement("DIV");
            list.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(list);

            let shown = 0;
            arr.forEach(size => {
                if (shown >= 10) return;

                const cleanVal = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
                const cleanSize = size.toUpperCase().replace(/[^A-Z0-9]/g, "");

                if (cleanSize.includes(cleanVal)) {
                    const item = document.createElement("DIV");
                    item.textContent = size;
                    item.innerHTML += `<input type="hidden" value="${size}">`;

                    item.addEventListener('click', function () {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });

                    list.appendChild(item);
                    shown++;
                }
            });
        });

        inp.addEventListener("keydown", function (e) {
            let list = this.parentNode.querySelector(".autocomplete-items");
            if (list) list = list.getElementsByTagName("div");

            if (e.keyCode === 40) {
                currentFocus++;
                addActive(list);
            } else if (e.keyCode === 38) {
                currentFocus--;
                addActive(list);
            } else if (e.keyCode === 13 && currentFocus > -1) {
                e.preventDefault();
                if (list) list[currentFocus].click();
            }
        });

        function addActive(list) {
            if (!list) return;
            removeActive(list);
            if (currentFocus >= list.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = list.length - 1;
            list[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(list) {
            for (let i = 0; i < list.length; i++) {
                list[i].classList.remove("autocomplete-active");
            }
        }
    }

    function closeAllLists() {
        document.querySelectorAll(".autocomplete-items").forEach(el => el.remove());
    }

    // ---------------------- CALCULATOR ----------------------
    function calculateAndDisplay() {
        const a = parseAndCalculate(tireAInput.value);
        const b = parseAndCalculate(tireBInput.value);

        if (!a || !b) {
            alert("Bitte gültige Reifengrößen eingeben (z.B. 205/55 R16).");
            return;
        }

        resultsContainer.classList.remove('hidden');
        updateTable(a, b);
        updateSpeedometer(a, b);
        findAlternatives(a);
        updateLinks(a);

        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function parseAndCalculate(str) {
        const regex = /(\d{3})[\s\/\-\.]*(\d{2})[\s\/\-\.R]*(\d{2})/;
        const m = str.toUpperCase().match(regex);
        if (!m) return null;

        const width = +m[1];
        const ratio = +m[2];
        const rimInch = +m[3];

        const sidewall = width * (ratio / 100);
        const rimMm = rimInch * 25.4;
        const diameter = rimMm + sidewall * 2;
        const circumference = diameter * Math.PI;

        return { input: `${width}/${ratio} R${rimInch}`, width, ratio, rimInch, sidewall, diameter, circumference };
    }

    function updateTable(a, b) {
        setText('diamA', mm(a.diameter));
        setText('diamB', mm(b.diameter));
        diff('diffDiam', b.diameter - a.diameter, 'mm', a.diameter);

        setText('circA', mm(a.circumference));
        setText('circB', mm(b.circumference));
        diff('diffCirc', b.circumference - a.circumference, 'mm', a.circumference);

        setText('widthA', `${a.width} mm`);
        setText('widthB', `${b.width} mm`);
        diff('diffWidth', b.width - a.width, 'mm', a.width);

        setText('wallA', mm(a.sidewall));
        setText('wallB', mm(b.sidewall));
        diff('diffWall', b.sidewall - a.sidewall, 'mm', a.sidewall);
    }

    function updateSpeedometer(a, b) {
        const displayed = 100;
        const real = displayed * (b.circumference / a.circumference);
        const diffPercent = ((b.circumference - a.circumference) / a.circumference) * 100;

        setText("speedReal", `Echte Geschw.: ${real.toFixed(1)} km/h`);
        setText("speedDiff", `${diffPercent > 0 ? '+' : ''}${diffPercent.toFixed(1)}%`);

        const verdict = document.getElementById("speedVerdict");

        if (real > displayed) {
            verdict.className = "verdict-badge red";
            verdict.innerHTML = "🔴 Abweichung positiv<br><span>Prüfung erforderlich.</span>";
        } else if (Math.abs(diffPercent) < 1.5) {
            verdict.className = "verdict-badge green";
            verdict.innerHTML = "🟢 Geringe Abweichung";
        } else {
            verdict.className = "verdict-badge yellow";
            verdict.innerHTML = "🟡 Abweichung vorhanden";
        }
    }

    function findAlternatives(base) {
        const list = document.getElementById("alternativesList");
        list.innerHTML = "";
        document.getElementById("altBaseSize").textContent = base.input;

        const matches = [];

        COMMON_SIZES.forEach(s => {
            if (s === base.input) return;
            const st = parseAndCalculate(s);
            if (!st) return;

            const diff = ((st.circumference - base.circumference) / base.circumference) * 100;
            if (Math.abs(diff) <= 4) matches.push({ size: s, diff });
        });

        matches.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));

        if (!matches.length) {
            list.innerHTML = '<p>Keine Alternativen gefunden.</p>';
            return;
        }

        matches.forEach(m => {
            const div = document.createElement("div");
            div.className = "alt-item match";
            div.innerHTML = `
                <div>${m.size}</div>
                <div style="font-size:0.8em">${m.diff > 0 ? '+' : ''}${m.diff.toFixed(1)}%</div>
            `;
            list.appendChild(div);
        });
    }

    function updateLinks(stats) {
        const link = document.getElementById("priceLink");
        if (!link) return;

        const url = new URL("https://www.reifencheck.de/produkte");
        url.searchParams.append("kategorie", "Winterreifen");
        url.searchParams.append("kategorie", "Sommerreifen");
        url.searchParams.append("kategorie", "Ganzjahresreifen");
        url.searchParams.append("width", stats.width);
        url.searchParams.append("height", stats.ratio);
        url.searchParams.append("diameter", stats.rimInch);
        url.searchParams.append("minPrice", "0");
        url.searchParams.append("maxPrice", "99999");
        url.searchParams.append("sortOrder", "asc");
        url.searchParams.append("page", "1");

        link.href = url.toString();
        document.getElementById("ctaSize").textContent = stats.input;
    }

    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function mm(v) {
        return Math.round(v) + " mm";
    }

    function diff(id, val, unit, base) {
        const el = document.getElementById(id);
        if (!el) return;

        const sign = val > 0 ? "+" : "";
        const percent = (val / base) * 100;

        el.textContent = `${sign}${Math.round(val)} ${unit} (${sign}${percent.toFixed(1)}%)`;
        el.style.color = val === 0 ? "inherit" : (val > 0 ? "#10b981" : "#ef4444");
    }

})();
