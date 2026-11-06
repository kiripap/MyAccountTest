/**
 * One persistent Three.js world for the onboarding drawer.
 *
 *   map (MAP SVG NEW: land + buildings)
 *    └─ shop (update.svg)    ← where the map draws its shop
 *         ├─ room            ← the desk, router and laptop drawn inside it,
 *         │    ├─ router        seen through the window (products)
 *         │    └─ laptop        further along the same desk (billing)
 *         └─ van             ← drives along the street and parks out front
 *
 * The illustrations are the supplied SVGs, rasterised by the browser and placed
 * on camera-facing planes in one orthographic scene. The shop and its room are a
 * single drawing, so the camera simply moves into it: the shop's white fill hides
 * the room except through the window, and as the camera passes through the
 * window the opening grows and the wall dissolves. The map's own drawing of the
 * shop sits exactly on top of the full drawing and hands over as the camera
 * closes in.
 */
import * as THREE from "three";

import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

import { transitionDuration, type Phase } from "../phases";
import {
  FRAMES,
  MAP_BUILDINGS,
  MAP_LAND,
  MAP_ROUTER,
  MAP_SHOP,
  SCENE_BASE,
  SCENE_COIN,
  SCENE_COIN_CENTRE,
  SCENE_HALO_INNER,
  SCENE_HALO_INNER_CENTRE,
  SCENE_HALO_OUTER,
  SCENE_HALO_OUTER_CENTRE,
  SCENE_IN_SHOP,
  SCENE_LINES,
  SCENE_LINE_STROKE,
  SCENE_PURPLE,
  SHOP_BACKING,
  SHOP_BASE,
  SHOP_ON_MAP,
  SHOP_WINDOW,
  VAN,
  VAN_AXIS,
  VAN_DRIVE_DISTANCE,
  VAN_PARK,
  type ArtPiece,
} from "./artwork";

const WHITE = 0xffffff;

/* ── Fixed camera orientation (matches the artwork's isometric) ─────────── */
const AZIMUTH = THREE.MathUtils.degToRad(33);
const ELEVATION = THREE.MathUtils.degToRad(21);
const D = new THREE.Vector3(
  Math.sin(AZIMUTH) * Math.cos(ELEVATION),
  Math.sin(ELEVATION),
  Math.cos(AZIMUTH) * Math.cos(ELEVATION),
);
const R = new THREE.Vector3(Math.cos(AZIMUTH), 0, -Math.sin(AZIMUTH));
const U = new THREE.Vector3().crossVectors(D, R).normalize();
const CAMERA_DISTANCE = 4000;

/** Render order: later draws on top (art layers don't depth-test). */
const ORDER = {
  land: 0,
  buildings: 2,
  backing: 5,
  scene: 5.5,
  halo: 5.6,
  screen: 5.7,
  shop: 6,
  mapShop: 6.5,
  van: 10,
};

/* ── Easing / maths ─────────────────────────────────────────────────────── */
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const logLerp = (a: number, b: number, t: number) => Math.exp(lerp(Math.log(a), Math.log(b), t));
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

type ArtRole =
  | "map"
  | "backing"
  | "shop"
  | "mapShop"
  | "mapRouter"
  | "scene"
  | "sceneFar"
  | "haloInner"
  | "haloOuter"
  | "van"
  | "manual";

/** Camera state in screen space: centre (a, b) and zoom. */
interface CamState {
  a: number;
  b: number;
  zoom: number;
}

/** A pose frames a world-space rectangle (screen-aligned). */
interface Pose {
  a: number;
  b: number;
  w: number;
  h: number;
}

interface Tween {
  from: CamState;
  to: Phase;
  start: number;
  duration: number;
}

interface WorldOptions {
  initialPhase: Phase;
  reducedMotion: boolean;
}

/** Rasterise an SVG string with the browser (exact rendering, incl. masks + filters). */
const rasterise = async (svg: string, w: number, h: number, scale: number) => {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
};

/* ═════════════════════════════════════════════════════════════════════════ */

export class OnboardingWorld {
  private host: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 1, CAMERA_DISTANCE * 2);
  private resizeObserver: ResizeObserver;
  private reducedMotion: boolean;
  private disposed = false;
  private ready = false;

  /** Screen-aligned root for all artwork layers (x right, y up, px-based). */
  private artRoot = new THREE.Group();
  private mapGroup = new THREE.Group();
  private landHolder = new THREE.Group();
  private buildingHolders: THREE.Group[] = [];
  private shopHolder = new THREE.Group();
  private shopGroup = new THREE.Group();
  private sceneGroup = new THREE.Group();
  private haloInnerHolder = new THREE.Group();
  private haloOuterHolder = new THREE.Group();
  private haloInnerMat: THREE.MeshBasicMaterial | null = null;
  private haloOuterMat: THREE.MeshBasicMaterial | null = null;
  private coinHolder = new THREE.Group();
  private coinMat: THREE.MeshBasicMaterial | null = null;
  /** The laptop screen's text lines, drawn as real strokes (so they can draw L→R). */
  private screenLines: { line: Line2; segments: number }[] = [];
  private screenLineMat: LineMaterial | null = null;


  /** Materials whose opacity is driven by the camera / sequences. */
  private artMaterials: { material: THREE.MeshBasicMaterial; role: ArtRole }[] = [];
  /** The room is only seen through the shop window until the wall dissolves. */
  private clipPlanes = [0, 1, 2, 3].map(() => new THREE.Plane());

  /* Van */
  private vanHolder = new THREE.Group();
  private vanShown = false;

  /* Camera */
  private poses = {} as Record<Phase, Pose>;
  private state: CamState = { a: 0, b: 0, zoom: 1 };
  private phase: Phase;
  private tween: Tween | null = null;
  private aspect = 1;

  /* Sequences */
  private introRequested = false;
  private introStart: number | null = null;
  private vanStart: number | null = null;
  private vanDone = false;
  /** The router appearing on the desk, seen through the window (0 → 1). */
  private routerReveal = 0;
  /** Back on the map: the van (and the router) fade away, then everything rewinds. */
  private seqFade: { start: number; duration: number } | null = null;
  private seqAlpha = 1;
  /**
   * Green halo clock (seconds), counting from when the camera settles on the router.
   * The halo plays once (inner ring in, then outer, staggered) and then holds — no loop.
   */
  private haloClock = 0;
  /** Current inner/outer ring strength (0 → 1), eased. */
  private haloInner = 0;
  private haloOuter = 0;
  /** Laptop screen content (£ + lines), drawn in once settled on billing. */
  private screenT = 0;
  private settledFor = 0;
  private lastTick = 0;

  constructor(host: HTMLElement, { initialPhase, reducedMotion }: WorldOptions) {
    this.host = host;
    this.reducedMotion = reducedMotion;
    this.phase = initialPhase;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setClearColor(WHITE, 1);
    this.renderer.localClippingEnabled = true;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.domElement.className = "ob-scene-canvas";
    host.appendChild(this.renderer.domElement);

    this.camera.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(R, U, D));
    this.artRoot.quaternion.copy(this.camera.quaternion);
    this.scene.add(this.artRoot);

    this.buildHierarchy();
    this.computePoses();
    this.resize();
    this.state = this.poseState(initialPhase);
    if (initialPhase !== "welcome") this.finishVanSequence();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);

    void this.loadArtwork().then(() => {
      if (this.disposed) return;
      this.ready = true;
      if (this.introRequested) this.introStart = performance.now();
      this.renderer.setAnimationLoop((t) => this.tick(t));
    });
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  /** Start the welcome reveal once the artwork has loaded. */
  playIntro() {
    if (this.reducedMotion) return;
    this.introRequested = true;
    if (this.ready) this.introStart = performance.now();
    this.applyIntro(0);
  }

  /** Move the camera to a phase, smoothly from wherever it is now. */
  goTo(phase: Phase) {
    if (phase === this.phase) return;
    const now = performance.now();
    const from = this.phase;
    this.phase = phase;
    this.settledFor = 0;

    if (this.reducedMotion) {
      this.tween = null;
      this.state = this.poseState(phase);
      if (phase === "welcome") this.resetSequence();
      else this.finishVanSequence();
      return;
    }

    const duration = transitionDuration(from, phase) || 900;
    this.tween = { from: { ...this.state }, to: phase, start: now, duration };

    if (phase === "welcome") {
      // The van fades away, then the sequence rewinds so it drives in again next time.
      if (this.vanStart !== null && this.vanStart > now) this.resetSequence();
      else if (this.vanShown) this.seqFade = { start: now, duration: Math.min(700, duration * 0.5) };
      return;
    }
    if (this.seqFade) this.resetSequence(); // left the map before the fade finished
    if (phase === "tracking" && !this.vanDone && this.vanStart === null) {
      this.vanStart = now + duration * 0.78; // van arrives as the camera settles
    } else if ((phase === "products" || phase === "billing") && !this.vanDone && (this.vanStart === null || this.vanStart > now)) {
      this.finishVanSequence();
    }
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.MeshBasicMaterial | undefined;
      if (mat && !Array.isArray(mat)) {
        mat.map?.dispose();
        mat.dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  /* ── Frame loop ───────────────────────────────────────────────────────── */

  private tick(now: number) {
    if (this.introStart !== null) {
      const t = now - this.introStart;
      this.applyIntro(t);
      if (t > 3000) this.introStart = null;
    }

    if (this.tween) {
      const p = clamp01((now - this.tween.start) / this.tween.duration);
      this.state = this.interpolate(this.tween.from, this.poseState(this.tween.to), easeInOutCubic(p));
      if (p >= 1) this.tween = null;
    } else {
      this.state = this.poseState(this.phase);
    }

    const dt = this.lastTick ? Math.min((now - this.lastTick) / 1000, 0.25) : 0;
    this.lastTick = now;
    if (!this.tween) this.settledFor += dt;
    this.updateVan(now);
    this.updateRoom(dt);
    this.applyCamera();
    this.renderer.render(this.scene, this.camera);
  }

  /** Keep the more zoomed-in pose's centre as a stable focal point while zooming. */
  private interpolate(from: CamState, to: CamState, e: number): CamState {
    const zoom = logLerp(from.zoom, to.zoom, e);
    const focal = to.zoom >= from.zoom ? to : from;
    const pa = lerp((focal.a - from.a) * from.zoom, (focal.a - to.a) * to.zoom, e);
    const pb = lerp((focal.b - from.b) * from.zoom, (focal.b - to.b) * to.zoom, e);
    return { a: focal.a - pa / zoom, b: focal.b - pb / zoom, zoom };
  }

  private applyCamera() {
    const { a, b, zoom } = this.state;
    this.camera.position.copy(R).multiplyScalar(a).addScaledVector(U, b).addScaledVector(D, CAMERA_DISTANCE);
    this.camera.zoom = zoom;
    this.camera.updateProjectionMatrix();

    const lz = Math.log(zoom);
    const zW = Math.log(this.zoomFor(this.poses.welcome));
    const zT = Math.log(this.zoomFor(this.poses.tracking));
    const zP = Math.log(this.zoomFor(this.poses.products));
    const ln = Math.log;

    // The map recedes as we close in on the shop (the tracking art sits on white).
    const map = 1 - smoothstep(zW + ln(1.6), zT + ln(0.7), lz);
    // The map's own drawing of the shop hands over to SHOP 1 as we close in.
    const far = 1 - smoothstep(zW + ln(1.15), zW + ln(3.4), lz);
    // Going through the window: the window grows around the router, then the wall dissolves.
    const facade = 1 - smoothstep(zT + ln(3.2), zP + ln(0.92), lz);
    const near = facade * (1 - far);
    const inside = 1 - far;
    const router = this.routerReveal * this.seqAlpha;
    // The room's fine lines: a texture made for the far view, then a sharp one as we close in.
    const sharp = smoothstep(zT + ln(1.3), zT + ln(2.2), lz);

    for (const { material, role } of this.artMaterials) {
      if (role === "manual") continue;
      let o: number;
      if (role === "map") o = this.introStart === null ? map : material.opacity;
      else if (role === "backing") o = facade;
      else if (role === "shop") o = near;
      else if (role === "mapShop") o = facade * far;
      else if (role === "mapRouter") o = facade * far * router;
      // The interior scene: appears through the window once the van has parked (router reveal),
      // with a far/near texture pair so the fine lines stay crisp as the camera closes in.
      else if (role === "scene") o = inside * router * sharp;
      else if (role === "sceneFar") o = inside * router * (1 - sharp);
      else if (role === "haloInner") o = inside * router * this.haloInner;
      else if (role === "haloOuter") o = inside * router * this.haloOuter;
      else o = this.vanShown ? facade * this.seqAlpha : 0; // van
      material.opacity = o;
      material.visible = o > 0.005;
    }
    this.vanHolder.visible = this.vanShown;
    this.updateWindowClip(facade);
  }

  /**
   * Clip the room to the shop window's opening. As the facade dissolves the
   * opening grows outwards, so the room is revealed around the window rather than
   * appearing all at once.
   */
  private updateWindowClip(facade: number) {
    const k = 1 + 60 * (1 - facade) ** 2;
    this.shopGroup.updateWorldMatrix(true, false);
    const c = SHOP_WINDOW.reduce((acc, [x, y]) => [acc[0] + x / 4, acc[1] + y / 4], [0, 0]);
    const world = SHOP_WINDOW.map(([x, y]) => this.shopGroup.localToWorld(v3(c[0] + (x - c[0]) * k, -(c[1] + (y - c[1]) * k), 0)));
    const centre = this.shopGroup.localToWorld(v3(c[0], -c[1], 0));
    world.forEach((p, i) => {
      const q = world[(i + 1) % 4];
      const n = new THREE.Vector3().subVectors(q, p).cross(D).normalize();
      if (n.dot(new THREE.Vector3().subVectors(centre, p)) < 0) n.negate();
      this.clipPlanes[i].setFromNormalAndCoplanarPoint(n, p);
    });
  }

  private resize() {
    const { width, height } = this.host.getBoundingClientRect();
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.aspect = width / height;
    this.camera.left = -this.aspect / 2;
    this.camera.right = this.aspect / 2;
    this.camera.top = 0.5;
    this.camera.bottom = -0.5;
    // Fat lines need the drawing-buffer resolution to size their strokes.
    this.screenLineMat?.resolution.set(width, height);
  }

  private zoomFor(pose: Pose) {
    return Math.min(1 / pose.h, this.aspect / pose.w);
  }

  private poseState(phase: Phase): CamState {
    const pose = this.poses[phase];
    return { a: pose.a, b: pose.b, zoom: this.zoomFor(pose) };
  }

  /* ── Intro (welcome) ──────────────────────────────────────────────────── */

  private applyIntro(t: number) {
    // Map: gentle fade + slight upward movement.
    const reveal = easeOutCubic(clamp01((t - 400) / 800));
    this.landHolder.position.y = MAP_LAND.y - 18 * (1 - reveal);
    for (const { material, role } of this.artMaterials) {
      if (role === "map") {
        material.opacity = reveal;
        material.visible = reveal > 0.005;
      }
    }
    // Buildings: staggered rise from their base.
    [...this.buildingHolders, this.shopHolder].forEach((holder, i) => {
      const p = easeOutCubic(clamp01((t - 650 - i * 90) / 480));
      holder.scale.setScalar(Math.max(p, 0.0001));
      holder.visible = p > 0.001;
    });
  }

  /* ── Van + router (tracking) ──────────────────────────────────────────── */

  private updateVan(now: number) {
    if (this.seqFade) {
      const p = clamp01((now - this.seqFade.start) / this.seqFade.duration);
      this.seqAlpha = 1 - easeInOutCubic(p);
      if (p >= 1) this.resetSequence();
      return;
    }
    if (this.vanDone || this.vanStart === null || now < this.vanStart) return;
    const t = now - this.vanStart;
    const DRIVE = 1100;
    this.vanShown = true;
    // Drives along the street (the shop's front axis) and eases to a stop.
    this.placeVan(VAN_DRIVE_DISTANCE * (1 - easeOutCubic(clamp01(t / DRIVE))));
    // The router appears on the desk, in the window, once the van has parked.
    this.setRouterReveal(easeOutCubic(clamp01((t - DRIVE - 150) / 550)));
    if (t > DRIVE + 750) this.vanDone = true;
  }

  private finishVanSequence() {
    this.seqFade = null;
    this.seqAlpha = 1;
    this.vanStart = null;
    this.vanDone = true;
    this.vanShown = true;
    this.placeVan(0);
    this.setRouterReveal(1);
  }

  /** Rewind the van + router so the tracking sequence plays from the start again. */
  private resetSequence() {
    this.seqFade = null;
    this.seqAlpha = 1;
    this.vanStart = null;
    this.vanDone = false;
    this.vanShown = false;
    this.haloClock = 0;
    this.haloInner = 0;
    this.haloOuter = 0;
    this.placeVan(VAN_DRIVE_DISTANCE);
    this.setRouterReveal(0);
  }

  /** How revealed the interior scene is (fades in through the window once the van parks). */
  private setRouterReveal(p: number) {
    this.routerReveal = p;
  }

  /** Position the van `dist` px behind its parking spot along the street axis. */
  private placeVan(dist: number) {
    this.vanHolder.position.set(VAN_PARK.x - dist * VAN_AXIS.x, -(VAN_PARK.y - dist * VAN_AXIS.y), 0);
  }

  /* ── Room: router halo (products) and laptop screen (billing) ─────────── */

  private updateRoom(dt: number) {
    const settled = !this.tween && this.settledFor > 0.15;

    // The halo plays once the camera has finished zooming onto the router (products).
    this.updateHalo(dt, this.phase === "products" && settled && this.routerReveal > 0.99);

    // £ pops in, then the text lines draw across, once the camera has settled on the laptop.
    if (this.phase === "billing" && settled) {
      this.screenT = Math.min(1, this.screenT + dt / (this.reducedMotion ? 0.01 : 1.4));
    } else if (this.phase !== "billing") {
      this.screenT = Math.max(0, this.screenT - dt / 0.35);
    }
    const c = clamp01(this.screenT / 0.3);
    this.coinHolder.scale.setScalar(Math.max(easeOutBack(c), 0.0001));
    if (this.coinMat) {
      this.coinMat.opacity = clamp01(c * 1.6);
      this.coinMat.visible = this.coinMat.opacity > 0.005;
    }
    this.screenLines.forEach(({ line, segments }, i) => {
      // Each line is a real stroke; revealing its segments from the start draws it L→R.
      // Staggered so the lines come in one after another.
      const draw = easeOutCubic(clamp01((this.screenT * 1.5 - 0.3 - i * 0.12) / 0.5));
      const geo = line.geometry as LineGeometry;
      geo.instanceCount = Math.max(0, Math.ceil(draw * segments));
      line.visible = draw > 0.002;
    });
  }

  /**
   * Router halo: the inner ring eases in first, then the pale outer ring follows
   * (staggered). It plays once and holds — no loop. When the sequence is rewound
   * (back to welcome) it eases back out.
   */
  private updateHalo(dt: number, active: boolean) {
    if (this.reducedMotion) {
      this.haloInner = active ? 1 : 0;
      this.haloOuter = active ? 1 : 0;
      this.applyHalo();
      return;
    }

    if (active) {
      this.haloClock += dt;
      const IN = 0.5; // ring ease-in duration
      const STAGGER = 0.28; // inner leads, outer follows
      this.haloInner = easeInOutCubic(clamp01(this.haloClock / IN));
      this.haloOuter = easeInOutCubic(clamp01((this.haloClock - STAGGER) / IN));
    } else {
      // Not on the settled router view: ease back out, then reset so it can replay later.
      this.haloClock = 0;
      this.haloInner = Math.max(0, this.haloInner - dt / 0.3);
      this.haloOuter = Math.max(0, this.haloOuter - dt / 0.3);
    }
    this.applyHalo();
  }

  private applyHalo() {
    // Each ring grows slightly as it appears (0.78 → 1), so it reads as a gentle pop.
    this.haloInnerHolder.scale.setScalar(Math.max(lerp(0.78, 1, this.haloInner), 0.0001));
    this.haloOuterHolder.scale.setScalar(Math.max(lerp(0.78, 1, this.haloOuter), 0.0001));
    if (this.haloInnerMat) this.haloInnerMat.visible = this.haloInnerMat.opacity > 0.005;
    if (this.haloOuterMat) this.haloOuterMat.visible = this.haloOuterMat.opacity > 0.005;
  }

  /* ── Artwork layers ───────────────────────────────────────────────────── */

  /** Camera-facing plane for an artwork, origin at its top-left (px, y-down → local y-up). */
  private artPlane(piece: ArtPiece, role: ArtRole, order: number) {
    const geo = new THREE.PlaneGeometry(piece.w, piece.h);
    geo.translate(piece.w / 2, -piece.h / 2, 0);
    const material = new THREE.MeshBasicMaterial({
      color: WHITE,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      visible: false,
    });
    const mesh = new THREE.Mesh(geo, material);
    mesh.renderOrder = order;
    mesh.userData.piece = piece;
    this.artMaterials.push({ material, role });
    return mesh;
  }

  /** Place a child at a parent-px position (y-down). */
  private place<T extends THREE.Object3D>(obj: T, x: number, y: number): T {
    obj.position.set(x, -y, 0);
    return obj;
  }

  /** A plane at its own position in the parent's px. */
  private placed(piece: ArtPiece, role: ArtRole, order: number) {
    return this.place(this.artPlane(piece, role, order), piece.x, piece.y);
  }

  /**
   * A full-size plane (its content drawn anywhere inside it) inside a holder that
   * sits at a given point in the plane's own px, so the holder can scale the plane
   * about that point. Used for the halos and the £ coin, which are full-scene planes.
   */
  private centredFull(holder: THREE.Group, piece: ArtPiece, role: ArtRole, order: number, centre: { x: number; y: number }) {
    this.place(holder, centre.x, centre.y);
    const plane = this.artPlane(piece, role, order);
    plane.position.set(-centre.x, centre.y, 0);
    holder.add(plane);
    return plane;
  }

  private buildHierarchy() {
    // ── Map, in map px.
    this.artRoot.add(this.mapGroup);
    this.mapGroup.add(this.place(this.landHolder, MAP_LAND.x, MAP_LAND.y));
    this.landHolder.add(this.artPlane(MAP_LAND, "map", ORDER.land));

    // Buildings rise from their base centre: holder at bottom-centre, plane offset inside.
    [...MAP_BUILDINGS]
      .sort((p, q) => p.y + p.h - (q.y + q.h))
      .forEach((piece, i) => {
        const holder = this.place(new THREE.Group(), piece.x + piece.w / 2, piece.y + piece.h);
        const plane = this.artPlane(piece, "map", ORDER.buildings + i * 0.01);
        plane.position.set(-piece.w / 2, piece.h, 0);
        holder.add(plane);
        this.mapGroup.add(holder);
        this.buildingHolders.push(holder);
      });

    // ── Shop, in shop px, at the scale the map draws it (rises from its base like the others).
    const s = SHOP_ON_MAP.scale;
    const baseX = SHOP_ON_MAP.x + 360 * s;
    const baseY = SHOP_ON_MAP.y + 440 * s;
    this.place(this.shopHolder, baseX, baseY);
    this.mapGroup.add(this.shopHolder);
    this.shopGroup.scale.setScalar(s);
    this.shopGroup.position.set(SHOP_ON_MAP.x - baseX, -(SHOP_ON_MAP.y - baseY), 0);
    this.shopHolder.add(this.shopGroup);

    this.shopGroup.add(this.placed(SHOP_BACKING, "backing", ORDER.backing));
    this.shopGroup.add(this.placed(SHOP_BASE, "shop", ORDER.shop));

    // The map's own drawing of the shop + its router, back in map px (shop px → map px inverse).
    const mapLod = new THREE.Group();
    mapLod.scale.setScalar(1 / s);
    this.place(mapLod, -SHOP_ON_MAP.x / s, -SHOP_ON_MAP.y / s);
    mapLod.add(this.placed(MAP_SHOP, "mapShop", ORDER.mapShop));
    mapLod.add(this.placed(MAP_ROUTER, "mapRouter", ORDER.mapShop + 0.1));
    this.shopGroup.add(mapLod);

    // ── The interior scene (one drawing: desk, router + halos, laptop), placed inside
    // the shop so its router lands on the window. Seen only through the window.
    this.place(this.sceneGroup, SCENE_IN_SHOP.x, SCENE_IN_SHOP.y);
    this.sceneGroup.scale.setScalar(SCENE_IN_SHOP.scale);
    this.shopGroup.add(this.sceneGroup);

    // The static base, with a twin rasterised for the far view (thin lines stay continuous there).
    const far = <T extends THREE.Mesh>(mesh: T) => ((mesh.userData.rasterScale = 1), mesh);
    this.sceneGroup.add(far(this.placed(SCENE_BASE, "sceneFar", ORDER.scene)));
    this.sceneGroup.add(this.placed(SCENE_BASE, "scene", ORDER.scene + 0.01));

    // Green halos (already skewed to the router's perspective in the art). Each is a
    // full-scene plane; we scale it about its own centre so it can pop in.
    this.haloOuterMat = this.centredFull(this.haloOuterHolder, SCENE_HALO_OUTER, "haloOuter", ORDER.halo, SCENE_HALO_OUTER_CENTRE)
      .material as THREE.MeshBasicMaterial;
    this.haloInnerMat = this.centredFull(this.haloInnerHolder, SCENE_HALO_INNER, "haloInner", ORDER.halo + 0.02, SCENE_HALO_INNER_CENTRE)
      .material as THREE.MeshBasicMaterial;
    this.sceneGroup.add(this.haloOuterHolder, this.haloInnerHolder);

    // Laptop screen content: £ pops in, then the text lines draw themselves in L→R.
    const coin = this.centredFull(this.coinHolder, SCENE_COIN, "manual", ORDER.screen, SCENE_COIN_CENTRE);
    this.coinMat = coin.material as THREE.MeshBasicMaterial;
    this.sceneGroup.add(this.coinHolder);

    // Real strokes (fat lines) so each draws out from its left end rather than being scaled.
    // Width is set in world units matching the SVG stroke at the scene's placement.
    const lineMat = new LineMaterial({
      color: SCENE_PURPLE,
      worldUnits: true,
      linewidth: SCENE_LINE_STROKE * SCENE_IN_SHOP.scale,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    lineMat.clippingPlanes = this.clipPlanes;
    this.screenLineMat = lineMat;
    SCENE_LINES.forEach(({ a, b }, i) => {
      // Subdivide so setDrawRange reveals the stroke smoothly from the left (a) to the right (b).
      const SEG = 48;
      const positions: number[] = [];
      for (let k = 0; k <= SEG; k++) {
        const t = k / SEG;
        positions.push(a[0] + (b[0] - a[0]) * t, -(a[1] + (b[1] - a[1]) * t), 0);
      }
      const geo = new LineGeometry();
      geo.setPositions(positions);
      const line = new Line2(geo, lineMat);
      line.renderOrder = ORDER.screen + 0.01 + i * 0.01;
      line.computeLineDistances();
      this.sceneGroup.add(line);
      this.screenLines.push({ line, segments: SEG });
    });
    this.sceneGroup.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m && !Array.isArray(m)) m.clippingPlanes = this.clipPlanes;
    });

    // ── Van, on the street in front of the shop (shop px).
    this.shopGroup.add(this.vanHolder);
    const van = this.artPlane(VAN, "van", ORDER.van);
    van.position.set(-VAN.anchorX, VAN.anchorY, 0);
    this.vanHolder.add(van);
    this.placeVan(VAN_DRIVE_DISTANCE);
    this.setRouterReveal(0);

    // Map world scale: 1 world unit = 1 shop px when the shop is at full size.
    this.mapGroup.scale.setScalar(1 / s);
  }

  /** Rasterise every artwork at a resolution that stays crisp at its closest view. */
  private async loadArtwork() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxSize = Math.min(this.renderer.capabilities.maxTextureSize, 4096);
    const closest = (piece: ArtPiece) => {
      if (piece === MAP_LAND || MAP_BUILDINGS.includes(piece) || piece === MAP_SHOP || piece === MAP_ROUTER) return 3.3;
      if (piece === SHOP_BASE) return 3;
      if (piece === VAN) return 2.4;
      if (piece === SHOP_BACKING) return 0.5;
      // Scene layers are drawn at ~6.5× their shop footprint on products/billing; 1 is plenty
      // since the scene is already a large (1663×736) drawing.
      return 1;
    };
    const jobs: Promise<void>[] = [];
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      const piece = mesh.userData?.piece as ArtPiece | undefined;
      if (!piece) return;
      const own = mesh.userData.rasterScale as number | undefined;
      const scale = Math.min((own ?? closest(piece)) * dpr, maxSize / Math.max(piece.w, piece.h));
      jobs.push(
        rasterise(piece.svg, piece.w, piece.h, scale).then((canvas) => {
          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
          const material = mesh.material as THREE.MeshBasicMaterial;
          material.map = texture;
          material.needsUpdate = true;
        }),
      );
    });
    await Promise.all(jobs);
  }

  /* ── Camera poses (each frames its drawer's illustration area) ────────── */

  private rectPose(group: THREE.Object3D, [x0, y0, x1, y1]: readonly number[]): Pose {
    this.scene.updateMatrixWorld(true);
    const p0 = group.localToWorld(v3(x0, -y0, 0));
    const p1 = group.localToWorld(v3(x1, -y1, 0));
    const centre = p0.clone().add(p1).multiplyScalar(0.5);
    return {
      a: centre.dot(R),
      b: centre.dot(U),
      w: Math.abs(p1.clone().sub(p0).dot(R)),
      h: Math.abs(p1.clone().sub(p0).dot(U)),
    };
  }

  private computePoses() {
    this.poses.welcome = this.rectPose(this.mapGroup, FRAMES.welcome);
    this.poses.tracking = this.rectPose(this.shopGroup, FRAMES.tracking);
    // Products/billing are framed in the scene's own px (it's a nested group with its own scale).
    this.poses.products = this.rectPose(this.sceneGroup, FRAMES.products);
    this.poses.billing = this.rectPose(this.sceneGroup, FRAMES.billing);
  }
}
