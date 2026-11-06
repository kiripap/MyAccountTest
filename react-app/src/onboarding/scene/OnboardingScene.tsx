import { useEffect, useRef, useState } from "react";

import { OnboardingWorld } from "./OnboardingWorld";
import type { Phase } from "../phases";
import { prefersReducedMotion } from "../useCountUp";
import mapUrl from "../art/raw/map-new.svg";
import sceneUrl from "../art/raw/scene-updated.svg";
import shopUrl from "../art/raw/update.svg";

const FALLBACK: Record<Phase, string> = {
  welcome: mapUrl,
  tracking: shopUrl,
  products: sceneUrl,
  billing: sceneUrl,
};

/** Cheap capability check (no throwaway context); renderer creation is also guarded below. */
const hasWebGL = () => typeof window !== "undefined" && "WebGLRenderingContext" in window;

/**
 * Mounts the persistent Three.js world once and drives its camera from `phase`.
 * The canvas stays mounted for the whole journey. Falls back to static
 * illustrations when WebGL isn't available.
 */
export const OnboardingScene = ({ phase }: OnboardingSceneProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<OnboardingWorld | null>(null);
  const initialPhase = useRef(phase);
  const [supported, setSupported] = useState(hasWebGL);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supported) return;
    let world: OnboardingWorld;
    try {
      world = new OnboardingWorld(host, {
        initialPhase: initialPhase.current,
        reducedMotion: prefersReducedMotion(),
      });
    } catch (error) {
      console.error("Onboarding scene failed to start; showing static illustrations", error);
      queueMicrotask(() => setSupported(false));
      return;
    }
    worldRef.current = world;
    if (initialPhase.current === "welcome") world.playIntro();
    return () => {
      world.dispose();
      worldRef.current = null;
    };
  }, [supported]);

  useEffect(() => {
    worldRef.current?.goTo(phase);
  }, [phase]);

  if (!supported) {
    return (
      <div className="ob-scene ob-scene--fallback" aria-hidden="true">
        {(Object.keys(FALLBACK) as Phase[]).map((p) => (
          <img key={p} src={FALLBACK[p]} alt="" className={p === phase ? "is-active" : undefined} />
        ))}
      </div>
    );
  }

  return <div ref={hostRef} className="ob-scene" aria-hidden="true" />;
};

interface OnboardingSceneProps {
  /**
   * Current onboarding phase; selects the camera pose.
   */
  phase: Phase;
}
