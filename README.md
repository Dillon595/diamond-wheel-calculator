# Diamond & CBN Grinding Wheel Calculator

An open-source calculator for selecting and checking basic parameters for diamond and CBN grinding wheels.

Supported:
- Diamond wheels
- CBN wheels
- Vitrified bond
- Resin bond
- Metal bond

Learn more about superabrasive grinding wheels:
https://sinogrind.com/

## Overview

This tool helps grinding engineers and machinists quickly verify wheel parameters, surface speeds, and recommended grinding conditions for diamond and CBN (Cubic Boron Nitride) superabrasive wheels.

It is not a replacement for manufacturer data sheets or process engineering judgment — it provides first-order estimates to guide setup and catch common mistakes.

## Features

- **Surface Speed Calculation** — converts wheel diameter and RPM to m/s and ft/min
- **Recommended Parameters** — depth of cut, table speed, RPM limits based on bond type and workpiece hardness
- **Basic Grinding Outputs** — MRR (Material Removal Rate), grinding power, G-ratio, chip thickness
- **Wheel Volume & Weight** — estimated from bore, OD, width, and bond density
- **Safety Warnings** — alerts for overspeed, wrong abrasive-material pairing, and dry grinding risks

## Key Formulas

```
Surface Speed (m/s) = π × D(m) × RPM / 60

MRR (cm³/min) = Depth of Cut(mm) × Width(mm) × Table Speed(m/min) / 1000

Grinding Power (kW) = MRR × Specific Energy / (60 × 1000)
```

## Usage

Open `index.html` in any modern browser. No server or build step required.

## Bond Type Speed Limits

| Bond | Max Surface Speed | Source / Reference |
|---|---|---|
| Resin Bond | 35 m/s | Resin bond wheels typically rated 25–50 m/s; 35 m/s is a common conservative limit. — *Norton Grinding Wheel Catalogue; Saint-Gobain Abrasives Technical Reference* |
| Vitrified Bond | 60 m/s | Vitrified bond wheels rated up to 60–80 m/s depending on grade and reinforcement. — *Winterthur Technology Group Technical Manual; Kellenberger grinding specifications* |
| Metal Bond | 25 m/s | Metal bond wheels limited by bond strength and heat generation; 20–30 m/s typical. — *EHWA Diamond Technical Guide; Asahi Diamond Industrial Co.* |
| Electroplated | 40 m/s | Single-layer electroplated wheels limited by nickel bond adhesion; 30–50 m/s typical. — *Dr. Kaiser Diamantwerkzeuge Catalogue; Engis Corp. Technical Notes* |

## Material–Abrasive Compatibility

| Material | Recommended Abrasive | Source / Reference |
|---|---|---|
| Steel (Carbon / Alloy) | CBN | Diamond dissolves in iron at grinding temperatures. CBN is the standard for ferrous materials. — *Malkin & Conring, "Grinding Technology: Theory and Practice of Cutting and Grinding", Industrial Press* |
| Stainless Steel | CBN | Same iron-reactivity issue as carbon steel. — *Malkin & Conring; Sandvik Coromant Grinding Handbook* |
| Cast Iron | Diamond | Graphite flakes make cast iron non-reactive to diamond. — *Malkin & Conring; Norton Abrasives Application Guide* |
| Hardened Steel (>45 HRC) | CBN | CBN retains hardness at high temperatures; preferred for hardened ferrous. — *Malkin & Conring; Schmitt Superabrasives Technical Bulletin* |
| Tungsten Carbide | Diamond | Diamond is the standard for cemented carbide grinding. — *Sandvik Coromant; Kennametal Grinding Guidelines* |
| Technical Ceramic | Diamond | Ceramics are extremely hard; only diamond has sufficient hardness. — *Malkin & Conring; 3M Superabrasives Guide* |
| Glass / Quartz | Diamond | Standard industrial practice. — *Norton / Saint-Gobain Abrasives; Schott AG Processing Guidelines* |
| Silicon / Semiconductor | Diamond | Silicon wafer dicing and grinding use diamond exclusively. — *Disco Corporation Technical Manual; Applied Materials Grinding Notes* |
| Titanium / Superalloy | CBN | Titanium is chemically reactive with diamond at high temps; CBN preferred. — *Malkin & Conring; GE Superabrasives Application Notes* |
| PTFE / Composites | Either | Low hardness; both abrasive types work. Coarse grit preferred. — *Composites Manufacturing Association Guidelines; Engis Technical Notes* |

## Specific Energy Values

| Material | Specific Energy (J/mm³) | Source / Reference |
|---|---|---|
| Steel (Carbon / Alloy) | 60 | Typical range 40–80 J/mm³ for steel grinding. — *Malkin & Conring, Table 3.2; Rowe, "Principles of Modern Grinding Technology", Springer* |
| Stainless Steel | 70 | Higher than carbon steel due to work hardening tendency. — *Malkin & Conring; Sandvik Grinding Handbook* |
| Cast Iron | 30 | Lower due to graphite flake lubrication and brittleness. — *Malkin & Conring; Rowe* |
| Hardened Steel | 80 | Harder materials require more energy per unit volume removed. — *Malkin & Conring; Rowe* |
| Tungsten Carbide | 100 | Very hard material; high specific energy. — *Malkin & Conring; Schmitt Superabrasives* |
| Technical Ceramic | 120 | Extremely high specific energy due to hardness and brittleness. — *Malkin & Conring; Rowe* |
| Glass | 90 | Brittle fracture dominates; moderate specific energy. — *Malkin & Conring; Moore "Precision Grinding"* |
| Silicon | 110 | Brittle semiconductor; high energy to remove material. — *Disco Corporation; Bridging published wafer grinding data* |
| Titanium | 75 | Reactive and tough; moderate-high energy. — *Malkin & Conring; GE Superabrasives* |
| PTFE / Composites | 5 | Very soft; low energy. — *Engis Technical Notes; composite machining references* |

## Usage

Open `index.html` in any modern browser. No server or build step required.

---

> **Disclaimer:** Typical reference values only. Always follow the wheel manufacturer's marked maximum operating speed and applicable safety standards.

## About the Project

This open-source project provides basic calculation tools and
technical references for diamond and CBN grinding applications.

Developed and maintained by SINOGRIND.

Website: https://sinogrind.com/

## License

MIT
