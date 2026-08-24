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

## Supported Materials

| Material | Recommended Abrasive |
|---|---|
| Steel (Carbon / Alloy) | CBN |
| Stainless Steel | CBN |
| Cast Iron | Diamond |
| Hardened Steel (>45 HRC) | CBN |
| Tungsten Carbide | Diamond |
| Technical Ceramic | Diamond |
| Glass / Quartz | Diamond |
| Silicon / Semiconductor | Diamond |
| Titanium / Superalloy | CBN |
| PTFE / Composites | Either |

## Key Formulas

```
Surface Speed (m/s) = π × D(m) × RPM / 60

MRR (cm³/min) = Depth of Cut(mm) × Width(mm) × Table Speed(m/min) / 1000

Grinding Power (kW) = MRR × Specific Energy / (60 × 1000)
```

## Usage

Open `index.html` in any modern browser. No server or build step required.

## Bond Type Speed Limits

| Bond | Max Surface Speed |
|---|---|
| Resin Bond | 35 m/s |
| Vitrified Bond | 60 m/s |
| Metal Bond | 25 m/s |
| Electroplated | 40 m/s |

## License

MIT
