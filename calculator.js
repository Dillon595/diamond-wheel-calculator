(() => {
    "use strict";

    const WHEEL_DENSITY = {
        resin: { diamond: 2.8, cbn: 2.6 },
        vitrified: { diamond: 3.1, cbn: 2.9 },
        metal: { diamond: 5.5, cbn: 5.2 },
        electroplated: { diamond: 4.0, cbn: 3.8 }
    };

    const MAX_SPEED = {
        resin: 35,
        vitrified: 60,
        metal: 25,
        electroplated: 40
    };

    const MATERIAL_ABRASIVE_MAP = {
        steel: "cbn",
        stainless: "cbn",
        castiron: "diamond",
        hardened: "cbn",
        tungsten: "diamond",
        ceramic: "diamond",
        glass: "diamond",
        silicon: "diamond",
        titanium: "cbn",
        ptfe: "either"
    };

    const MATERIAL_HARDNESS = {
        steel: 5,
        stainless: 5,
        castiron: 4,
        hardened: 8,
        tungsten: 9,
        ceramic: 9,
        glass: 8,
        silicon: 9,
        titanium: 6,
        ptfe: 1
    };

    const MATERIAL_LABELS = {
        steel: "Steel",
        stainless: "Stainless Steel",
        castiron: "Cast Iron",
        hardened: "Hardened Steel",
        tungsten: "Tungsten Carbide",
        ceramic: "Technical Ceramic",
        glass: "Glass / Quartz",
        silicon: "Silicon",
        titanium: "Titanium / Superalloy",
        ptfe: "PTFE / Composites"
    };

    const BOND_LABELS = {
        resin: "Resin Bond",
        vitrified: "Vitrified Bond",
        metal: "Metal Bond",
        electroplated: "Electroplated"
    };

    const GRIT_LABELS = {
        20: "20/25",
        30: "30/40",
        40: "40/50",
        50: "50/60",
        60: "60/80",
        80: "80/100",
        100: "100/120",
        120: "120/140",
        170: "170/200",
        230: "230/270",
        325: "325/400",
        500: "500/600"
    };

    function $(id) {
        return document.getElementById(id);
    }

    function calcSurfaceSpeedMs(diameterMm, rpm) {
        return (Math.PI * (diameterMm / 1000) * rpm) / 60;
    }

    function calcSurfaceSpeedFpm(diameterMm, rpm) {
        return (Math.PI * (diameterMm / 1000) * rpm * 3.28084) / 60;
    }

    function calcWheelVolume(diameterMm, boreMm, widthMm) {
        const outerR = diameterMm / 2;
        const innerR = boreMm / 2;
        return Math.PI * (outerR * outerR - innerR * innerR) * widthMm / 1000;
    }

    function calcMRR(depthOfCutMm, widthMm, tableSpeedMMin) {
        return depthOfCutMm * widthMm * tableSpeedMMin / 1000;
    }

    function calcGRatio(mrr, surfaceSpeedMs) {
        if (surfaceSpeedMs <= 0 || mrr <= 0) return 0;
        return Math.max(1, Math.min(200, (mrr * 1000) / (surfaceSpeedMs * 0.001)));
    }

    function calcSpecificEnergy(material) {
        const map = {
            steel: 60, stainless: 70, castiron: 30, hardened: 80,
            tungsten: 100, ceramic: 120, glass: 90, silicon: 110,
            titanium: 75, ptfe: 5
        };
        return map[material] || 60;
    }

    function calcPower(mrr, specificEnergy) {
        return (mrr * specificEnergy) / (60 * 1000);
    }

    function calcChipThickness(surfaceSpeedMs, rpm, gritSize) {
        if (rpm <= 0 || surfaceSpeedMs <= 0) return 0;
        const gritMicron = gritSize > 0 ? 25000 / gritSize : 100;
        return (surfaceSpeedMs / rpm) * (gritMicron / 1000) * 0.1;
    }

    function getRecommendedParams(inputs) {
        const { wheelType, diameter, width, bore, gritSize, concentration, bondType, material, rpm, depthOfCut, tableSpeed, coolant } = inputs;
        const surfaceSpeedMs = calcSurfaceSpeedMs(diameter, rpm);
        const maxSpeed = MAX_SPEED[bondType] || 30;
        const hard = MATERIAL_HARDNESS[material] || 5;

        const recDepthBase = bondType === "resin" ? 0.02 : bondType === "vitrified" ? 0.03 : 0.01;
        const gritFactor = gritSize <= 50 ? 1.5 : gritSize <= 100 ? 1.0 : 0.6;
        const recDepth = recDepthBase * gritFactor * (hard > 7 ? 0.5 : 1.0);

        const recTableSpeedBase = bondType === "resin" ? 15 : bondType === "vitrified" ? 20 : 10;
        const recTableSpeed = recTableSpeedBase * (hard > 7 ? 0.6 : 1.0);

        const recRpm = Math.min(
            Math.round((maxSpeed * 60 * 1000) / (Math.PI * diameter) * 0.85),
            rpm
        );

        const concentrationPct = concentration;
        const gritLabel = GRIT_LABELS[gritSize] || gritSize;

        const specificEnergy = calcSpecificEnergy(material);
        const mrr = calcMRR(depthOfCut, width, tableSpeed);
        const power = calcPower(mrr, specificEnergy);

        const coolantRec = (() => {
            if (bondType === "resin" && surfaceSpeedMs > 25) return "Flood coolant required at high speed";
            if (hard > 7) return "Flood coolant strongly recommended";
            if (coolant === "dry" && bondType === "resin") return "Dry grinding not recommended for resin bond";
            if (coolant === "dry") return "Consider flood coolant for better finish";
            return "Current coolant selection acceptable";
        })();

        return [
            {
                param: "Max Safe RPM",
                value: recRpm,
                unit: "RPM",
                note: `Limit for ${BOND_LABELS[bondType]} at Ø${diameter}mm`
            },
            {
                param: "Recommended Depth of Cut",
                value: recDepth.toFixed(4),
                unit: "mm",
                note: `Based on grit ${gritLabel}, ${hard > 7 ? "hard" : "soft"} material`
            },
            {
                param: "Recommended Table Speed",
                value: recTableSpeed.toFixed(1),
                unit: "m/min",
                note: `Optimal for ${BOND_LABELS[bondType]}`
            },
            {
                param: "Max Surface Speed",
                value: maxSpeed,
                unit: "m/s",
                note: `${BOND_LABELS[bondType]} limit`
            },
            {
                param: "Coolant Recommendation",
                value: coolantRec,
                unit: "",
                note: ""
            },
            {
                param: "Wheel Grade Suggestion",
                value: hard > 7 ? "Soft (for hard materials)" : "Medium-Hard (for soft materials)",
                unit: "",
                note: `Material: ${MATERIAL_LABELS[material]}`
            }
        ];
    }

    function getGrindingParams(inputs) {
        const { wheelType, diameter, width, bore, gritSize, concentration, bondType, material, rpm, depthOfCut, tableSpeed, coolant } = inputs;

        const surfaceSpeedMs = calcSurfaceSpeedMs(diameter, rpm);
        const surfaceSpeedFpm = calcSurfaceSpeedFpm(diameter, rpm);
        const wheelVolume = calcWheelVolume(diameter, bore, width);
        const density = (WHEEL_DENSITY[bondType] || 3.0) * (0.7 + concentration / 300);
        const wheelWeight = (wheelVolume * density) / 1e6;

        const mrr = calcMRR(depthOfCut, width, tableSpeed);
        const specificEnergy = calcSpecificEnergy(material);
        const power = calcPower(mrr, specificEnergy);
        const gRatio = calcGRatio(mrr, surfaceSpeedMs);
        const chipThickness = calcChipThickness(surfaceSpeedMs, rpm, gritSize);
        const materialRemoved = mrr * 60;

        return {
            surfaceSpeedMs,
            surfaceSpeedFpm,
            wheelVolume,
            wheelWeight,
            params: [
                { param: "Surface Speed", value: surfaceSpeedMs.toFixed(2), unit: "m/s" },
                { param: "Surface Speed", value: surfaceSpeedFpm.toFixed(0), unit: "ft/min" },
                { param: "Material Removal Rate (MRR)", value: mrr.toFixed(4), unit: "cm³/min" },
                { param: "Estimated Grinding Power", value: power.toFixed(3), unit: "kW" },
                { param: "G-Ratio (est.)", value: gRatio.toFixed(1), unit: "" },
                { param: "Avg. Chip Thickness (est.)", value: (chipThickness * 1000).toFixed(2), unit: "μm" },
                { param: "Volume Removed per Hour", value: materialRemoved.toFixed(2), unit: "cm³/hr" },
                { param: "Wheel Volume", value: wheelVolume.toFixed(1), unit: "cm³" },
                { param: "Wheel Weight (est.)", value: wheelWeight.toFixed(2), unit: "kg" },
                { param: "Grinding Ratio Note", value: gRatio > 50 ? "Excellent wheel life" : gRatio > 10 ? "Moderate wheel life" : "Short wheel life — consider coarser grit", unit: "" }
            ]
        };
    }

    function getWarnings(inputs) {
        const warnings = [];
        const { wheelType, diameter, rpm, bondType, material, coolant } = inputs;
        const surfaceSpeedMs = calcSurfaceSpeedMs(diameter, rpm);
        const maxSpeed = MAX_SPEED[bondType] || 30;
        const recommended = MATERIAL_ABRASIVE_MAP[material];

        if (surfaceSpeedMs > maxSpeed) {
            warnings.push(
                `Surface speed ${surfaceSpeedMs.toFixed(1)} m/s exceeds ${BOND_LABELS[bondType]} max of ${maxSpeed} m/s. Reduce RPM to ≤${Math.round((maxSpeed * 60 * 1000) / (Math.PI * diameter))}.`
            );
        }

        if (wheelType === "diamond" && recommended === "cbn") {
            warnings.push(
                `CBN is recommended for ${MATERIAL_LABELS[material]}. Diamond may cause excessive wheel wear.`
            );
        } else if (wheelType === "cbn" && recommended === "diamond") {
            warnings.push(
                `Diamond is recommended for ${MATERIAL_LABELS[material]}. CBN may underperform.`
            );
        }

        if (bondType === "resin" && coolant === "dry" && surfaceSpeedMs > 20) {
            warnings.push("Dry grinding with resin bond at high speed can cause thermal damage. Use flood coolant.");
        }

        if (diameter > 400 && rpm > 3000) {
            warnings.push("High RPM on large wheels increases risk. Verify machine spindle rating.");
        }

        return warnings;
    }

    function renderRecommended(rows) {
        const tbody = $("recommendedParams");
        tbody.innerHTML = "";
        rows.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${r.param}</td><td>${r.value}</td><td>${r.unit}</td><td>${r.note}</td>`;
            tbody.appendChild(tr);
        });
    }

    function renderGrinding(data) {
        const tbody = $("grindingParams");
        tbody.innerHTML = "";
        data.params.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${r.param}</td><td>${r.value}</td><td>${r.unit}</td>`;
            tbody.appendChild(tr);
        });
        $("surfaceSpeed").textContent = data.surfaceSpeedMs.toFixed(2);
        $("surfaceSpeedFpm").textContent = data.surfaceSpeedFpm.toFixed(0);
        $("wheelVolume").textContent = data.wheelVolume.toFixed(1);
        $("wheelWeight").textContent = data.wheelWeight.toFixed(2);
    }

    function renderWarnings(warnings) {
        const card = $("warningsCard");
        const list = $("warningsList");
        if (warnings.length === 0) {
            card.style.display = "none";
            return;
        }
        card.style.display = "block";
        list.innerHTML = "";
        warnings.forEach(w => {
            const li = document.createElement("li");
            li.textContent = w;
            list.appendChild(li);
        });
    }

    function calculate() {
        const inputs = {
            wheelType: $("wheelType").value,
            diameter: parseFloat($("diameter").value) || 150,
            width: parseFloat($("width").value) || 20,
            bore: parseFloat($("bore").value) || 32,
            gritSize: parseInt($("gritSize").value) || 60,
            concentration: parseInt($("concentration").value) || 75,
            bondType: $("bondType").value,
            material: $("material").value,
            rpm: parseFloat($("rpm").value) || 3000,
            depthOfCut: parseFloat($("depthOfCut").value) || 0.01,
            tableSpeed: parseFloat($("tableSpeed").value) || 10,
            coolant: $("coolant").value
        };

        const recommended = getRecommendedParams(inputs);
        const grinding = getGrindingParams(inputs);
        const warnings = getWarnings(inputs);

        renderRecommended(recommended);
        renderGrinding(grinding);
        renderWarnings(warnings);
    }

    $("calculateBtn").addEventListener("click", calculate);

    document.querySelectorAll("input, select").forEach(el => {
        el.addEventListener("change", calculate);
        el.addEventListener("input", calculate);
    });

    calculate();
})();
