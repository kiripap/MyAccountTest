/**
 * Artwork for the onboarding world: the supplied SVGs (MAP SVG NEW, and
 * update.svg: the shop with its interior drawn in place), cut into layers only
 * where something animates, plus the van.
 *
 * Coordinates are in each source SVG's own pixel space so layouts can be checked
 * against the files directly. Generated positions live in `artLayout.ts`.
 */
import landSvg from "../art/map-land.svg?raw";
import houseNorthSvg from "../art/map-house-north.svg?raw";
import houseWestSvg from "../art/map-house-west.svg?raw";
import officeSvg from "../art/map-office.svg?raw";
import mapRouterSvg from "../art/map-router.svg?raw";
import mapShopSvg from "../art/map-shop.svg?raw";
import shopNorthSvg from "../art/map-shop-north.svg?raw";
import shopWestSvg from "../art/map-shop-west.svg?raw";
import storeSvg from "../art/map-store.svg?raw";
import sceneBaseSvg from "../art/scene-base.svg?raw";
import sceneCoinSvg from "../art/scene-coin.svg?raw";
import sceneHaloInnerSvg from "../art/scene-halo-inner.svg?raw";
import sceneHaloOuterSvg from "../art/scene-halo-outer.svg?raw";
import shopBackingSvg from "../art/shop-backing.svg?raw";
import shopBaseSvg from "../art/shop-base.svg?raw";
import vanSvg from "../art/van.svg?raw";
import {
  MAP_BUILDING_BOXES,
  MAP_ROUTER_BOX,
  MAP_SHOP_BOX,
  SCENE_COIN_BOX,
  SCENE_HALO_INNER_BOX,
  SCENE_HALO_OUTER_BOX,
  SCENE_IN_SHOP,
  SCENE_LAPTOP_BOX,
  SCENE_LINE_SEGMENTS,
  SCENE_LINE_WIDTH,
  SCENE_ROUTER_BODY_BOX,
  SCENE_ROUTER_EYE,
  SCENE_VIEW,
  SHOP_ON_MAP,
  VAN_BOX,
} from "./artLayout";

export { SCENE_IN_SHOP, SCENE_ROUTER_EYE, SHOP_ON_MAP };

export interface ArtPiece {
  /** SVG markup. */
  svg: string;
  /** Top-left of the artwork in its parent's pixel space. */
  x: number;
  y: number;
  /** Artwork size in its own pixels. */
  w: number;
  h: number;
}

/* ── Welcome: MAP SVG NEW (720 × 475) ───────────────────────────────────── */
export const MAP_LAND: ArtPiece = { svg: landSvg, x: 0, y: 0, w: 720, h: 475 };

/** The map's buildings, cut from the same file at their own positions (for the stagger). */
export const MAP_BUILDINGS: ArtPiece[] = [
  { svg: houseWestSvg, ...MAP_BUILDING_BOXES["map-house-west"] },
  { svg: shopWestSvg, ...MAP_BUILDING_BOXES["map-shop-west"] },
  { svg: houseNorthSvg, ...MAP_BUILDING_BOXES["map-house-north"] },
  { svg: shopNorthSvg, ...MAP_BUILDING_BOXES["map-shop-north"] },
  { svg: officeSvg, ...MAP_BUILDING_BOXES["map-office"] },
  { svg: storeSvg, ...MAP_BUILDING_BOXES["map-store"] },
];

/** The shop exactly as drawn on the map (map px), and its router, which appears on the tour. */
export const MAP_SHOP: ArtPiece = { svg: mapShopSvg, ...MAP_SHOP_BOX };
export const MAP_ROUTER: ArtPiece = { svg: mapRouterSvg, ...MAP_ROUTER_BOX };

/* ── Tracking: the shop (the part of update.svg outside the window) ─────── */
const SHOP_FULL = { x: 0, y: 0, w: 718, h: 480 };
/** The shop itself (everything outside its window). */
export const SHOP_BASE: ArtPiece = { svg: shopBaseSvg, ...SHOP_FULL };
/** White fill of the shop, so nothing behind it (map, scene) shows through its walls. */
export const SHOP_BACKING: ArtPiece = { svg: shopBackingSvg, ...SHOP_FULL };
/** Inner edge of the shop window (shop px): TL, TR, BR, BL. The scene is only seen through here. */
export const SHOP_WINDOW: [number, number][] = [
  [148.1, 248.5],
  [222.2, 266.3],
  [222.2, 323.4],
  [148.1, 305.3],
];

/* ── Products → billing: SCENE UPDATED.svg (1663 × 736), one drawing ────────
 * A single scene (desk, router with its skewed green halos, laptop) placed inside
 * the shop so the router lands on the window. Only the pieces that animate are cut
 * out; the rest is one static base so the perspective stays exactly as drawn. */
const SCENE_FULL = { x: 0, y: 0, w: SCENE_VIEW.w, h: SCENE_VIEW.h };
/** Everything static: desk, laptop shell + trackpad, router body and purple rings. */
export const SCENE_BASE: ArtPiece = { svg: sceneBaseSvg, ...SCENE_FULL };
/**
 * The router's green halo, already skewed to the router's perspective in the art.
 * Two concentric rings centred on the eye: the inner one animates in first, then the
 * pale outer one. It plays once (staggered in, no loop).
 */
export const SCENE_HALO_INNER: ArtPiece = { svg: sceneHaloInnerSvg, ...SCENE_FULL };
export const SCENE_HALO_OUTER: ArtPiece = { svg: sceneHaloOuterSvg, ...SCENE_FULL };
export const SCENE_HALO_INNER_CENTRE = {
  x: SCENE_HALO_INNER_BOX.x + SCENE_HALO_INNER_BOX.w / 2,
  y: SCENE_HALO_INNER_BOX.y + SCENE_HALO_INNER_BOX.h / 2,
};
export const SCENE_HALO_OUTER_CENTRE = {
  x: SCENE_HALO_OUTER_BOX.x + SCENE_HALO_OUTER_BOX.w / 2,
  y: SCENE_HALO_OUTER_BOX.y + SCENE_HALO_OUTER_BOX.h / 2,
};
/** The laptop screen's £, which pops in on billing (scene px position). */
export const SCENE_COIN: ArtPiece = { svg: sceneCoinSvg, ...SCENE_FULL };
export const SCENE_COIN_CENTRE = { x: SCENE_COIN_BOX.x + SCENE_COIN_BOX.w / 2, y: SCENE_COIN_BOX.y + SCENE_COIN_BOX.h / 2 };

/**
 * The laptop screen's text lines, as real strokes so they draw left→right.
 * `a`/`b` are the start (left) and end (right) points in scene px.
 */
export interface SceneLine {
  a: [number, number];
  b: [number, number];
}
export const SCENE_LINES: SceneLine[] = SCENE_LINE_SEGMENTS.map(([x0, y0, x1, y1]) => ({ a: [x0, y0], b: [x1, y1] }));
export const SCENE_LINE_STROKE = SCENE_LINE_WIDTH;
export const SCENE_PURPLE = 0x5514b4;

/* ── Van: drives along the shop's front and parks ───────────────────────── */
export const VAN: ArtPiece & { anchorX: number; anchorY: number } = { svg: vanSvg, x: 0, y: 0, ...VAN_BOX };
/** Shop px where the van's ground centre parks, and its drive direction (the shop's front axis). */
export const VAN_PARK = { x: 330, y: 470 };
export const VAN_AXIS = { x: Math.cos((14 * Math.PI) / 180), y: Math.sin((14 * Math.PI) / 180) };
export const VAN_DRIVE_DISTANCE = 820;

/* ── Camera frames: the illustration area of each drawer layout ──────────── */
/** A frame (840 × 640 in proportion) of the given width, placing (cx, cy) at (fx, fy) of it. */
const frameAt = (cx: number, cy: number, width: number, fx = 0.5, fy = 0.5) => {
  const height = (width * 640) / 840;
  const x0 = cx - width * fx;
  const y0 = cy - height * fy;
  return [x0, y0, x0 + width, y0 + height] as const;
};
/** Products/billing are framed in scene px, so widths scale with the scene drawing. */
const SCENE_FRAME_WIDTH = 740;

/** [x0, y0, x1, y1] in the named layer's pixels. */
export const FRAMES = {
  /** The whole map with a small margin (map px). */
  welcome: [-20, -52, 740, 527],
  /** The shop as framed in the tracking design (shop px). */
  tracking: [-97, -61, 743, 579],
  /** Through the window, on the router (scene px). */
  products: frameAt(
    SCENE_ROUTER_BODY_BOX.x + SCENE_ROUTER_BODY_BOX.w / 2,
    SCENE_ROUTER_BODY_BOX.y + SCENE_ROUTER_BODY_BOX.h / 2,
    SCENE_FRAME_WIDTH,
    0.46,
    0.44,
  ),
  /** Same size, slid along the desk to the laptop (scene px). */
  billing: frameAt(
    SCENE_LAPTOP_BOX.x + SCENE_LAPTOP_BOX.w / 2,
    SCENE_LAPTOP_BOX.y + SCENE_LAPTOP_BOX.h / 2,
    SCENE_FRAME_WIDTH,
  ),
} as const;
