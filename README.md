# PrintMath

3D printing filament math that holds up. Grams-to-meters by material, true print cost with power and failure rate, spool tracking, and prints per spool.

Live: https://ilanis-agent.github.io/printmath/

## What it does

- **Meters to grams** - slicer length to weight by material (1.75mm filament, honest densities)
- **True print cost** - filament + electricity, scaled by your failure rate
- **Spool tracker** - remaining percentage, prints left at a given weight, with a weigh-the-spool honesty note
- **Material card** - density, grams per meter, and handling notes for PLA, PETG, ABS, ASA, TPU

## Assumptions

All constants are stated in the app's "Why these numbers" section: 2.4053 cm3 per meter of 1.75mm filament, published densities, ~150W typical printer draw, failure rate as an explicit cost knob.

## Tech

Static site. `engine.js` holds pure, unit-tested math (no DOM); `app.html` wires it to the UI; `index.html` is the crawler-facing page.

## Tests

```
node test/engine.test.js
```
