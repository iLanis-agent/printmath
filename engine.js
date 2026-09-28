/* PrintMath engine - honest 3D printing filament math. Pure functions, no DOM. */
var PrintEngine = (function () {
  function r2(x) { return Math.round(x * 100) / 100; }

  /* 1.75mm filament: cross-section 0.024053 cm2, so 2.4053 cm3 per meter.
     grams per meter = 2.4053 x density (g/cm3). */
  var DENSITIES = { pla: 1.24, petg: 1.27, abs: 1.04, tpu: 1.21, asa: 1.07 };
  var CM3_PER_M = 2.4053;
  var MATERIAL_NOTES = {
    pla:  'Easy and stiff. Prints at 190-220C, no enclosure needed.',
    petg: 'Tougher than PLA, a little stringy. 230-250C, keep it dry.',
    abs:  'Strong and heat-resistant, but warps and fumes. 230-260C, enclosure and ventilation.',
    tpu:  'Flexible rubber. 220-250C, print it slow and dry it first.',
    asa:  'UV-stable ABS for outdoor parts. 240-260C, enclosure and ventilation.'
  };
  function gramsPerMeter(material) {
    var d = DENSITIES[material];
    if (!d) return null;
    return r2(CM3_PER_M * d);
  }
  function metersFromGrams(grams, material) {
    var g = gramsPerMeter(material);
    if (!g) return null;
    return r2(grams / g);
  }
  function gramsFromMeters(meters, material) {
    var g = gramsPerMeter(material);
    if (!g) return null;
    return r2(meters * g);
  }

  /* money */
  function costPerGram(spoolPrice, spoolGrams) {
    if (spoolGrams <= 0) return null;
    return r2(spoolPrice / spoolGrams * 1000) / 1000;
  }
  function filamentCost(grams, pricePerKg) {
    return r2(grams * pricePerKg / 1000);
  }
  function electricityCost(hours, watts, ratePerKwh) {
    return r2(hours * watts / 1000 * ratePerKwh);
  }
  /* honest print cost: filament + power, scaled by your failure rate */
  function truePrintCost(grams, pricePerKg, hours, watts, ratePerKwh, failurePct) {
    var base = grams * pricePerKg / 1000 + hours * watts / 1000 * ratePerKwh;
    return r2(base * (1 + failurePct / 100));
  }

  /* spool tracking */
  function spoolRemainingPct(spoolGrams, usedGrams) {
    if (spoolGrams <= 0) return null;
    var left = spoolGrams - usedGrams;
    if (left < 0) left = 0;
    return r2(left / spoolGrams * 100);
  }
  function printsPerSpool(spoolGrams, gramsPerPrint) {
    if (gramsPerPrint <= 0) return null;
    return Math.floor(spoolGrams / gramsPerPrint);
  }
  function spoolVerdict(remainingPct) {
    if (remainingPct > 50) return 'plenty left';
    if (remainingPct > 20) return 'past halfway - worth weighing before a big print';
    if (remainingPct > 5) return 'running low - plan the next spool, long prints are risky';
    return 'nearly empty - short prints only, or swap now';
  }

  function materialNote(material) { return MATERIAL_NOTES[material] || null; }

  return {
    DENSITIES: DENSITIES, CM3_PER_M: CM3_PER_M,
    gramsPerMeter: gramsPerMeter, metersFromGrams: metersFromGrams, gramsFromMeters: gramsFromMeters,
    costPerGram: costPerGram, filamentCost: filamentCost, electricityCost: electricityCost,
    truePrintCost: truePrintCost, spoolRemainingPct: spoolRemainingPct,
    printsPerSpool: printsPerSpool, spoolVerdict: spoolVerdict, materialNote: materialNote
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = PrintEngine;
