export type Phase = "welcome" | "tracking" | "products" | "billing";

export const PHASES: Phase[] = ["welcome", "tracking", "products", "billing"];

/** Camera travel time (ms) for each hop between neighbouring phases. */
const HOP_MS: Record<string, number> = {
  "welcome:tracking": 1400,
  "tracking:products": 1450,
  "products:billing": 950,
};

/** Duration of the camera move between two phases (sum of hops if not adjacent). */
export const transitionDuration = (from: Phase, to: Phase): number => {
  const a = PHASES.indexOf(from);
  const b = PHASES.indexOf(to);
  let total = 0;
  for (let i = Math.min(a, b); i < Math.max(a, b); i++) {
    total += HOP_MS[`${PHASES[i]}:${PHASES[i + 1]}`];
  }
  return total;
};
