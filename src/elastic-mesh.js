/*!
 * ElasticMesh adaptation based on React Bits.
 * Copyright (c) 2026 David Haz.
 * MIT + Commons Clause License Condition v1.0.
 * Permission is granted to use, copy, modify, merge, publish, and distribute
 * the software as part of an application, website, or product, provided this
 * notice is retained. The component itself may not be sold, sublicensed, or
 * redistributed alone, in a bundle, or as a ported version.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 * Full terms: THIRD_PARTY_NOTICES.md and https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
 */
import { Renderer, Geometry, Program, Mesh, Texture } from "ogl";

const DIST = 4.6;
const FIT = 1;
const VERT = `
precision highp float;
attribute vec2 aGrid;
attribute vec2 uv;
attribute vec3 aOffset;
attribute vec3 aNormal;
uniform float uAspect;
uniform float uTilt;
uniform float uDist;
uniform float uFit;
uniform vec2 uUvScale;
uniform vec2 uUvOffset;
varying vec2 vUv;
varying vec3 vNormal;
varying float vDepth;
void main() {
  vUv = uUvOffset + uv * uUvScale;
  vec2 base = vec2((aGrid.x * 2.0 - 1.0) * uAspect, 1.0 - aGrid.y * 2.0);
  vec3 p = vec3(base + aOffset.xy, aOffset.z);
  float ct = cos(uTilt);
  float st = sin(uTilt);
  float ry = p.y * ct - p.z * st;
  float rz = p.y * st + p.z * ct;
  p.y = ry;
  p.z = rz;
  float persp = uDist / (uDist - p.z);
  vec2 clip = vec2(p.x / uAspect, p.y) * persp * uFit;
  vNormal = aNormal;
  vDepth = aOffset.z;
  gl_Position = vec4(clip, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
varying float vDepth;
uniform sampler2D tMap;
uniform float uHasImage;
uniform vec3 uHighlight;
uniform float uShading;
uniform vec2 uRes;
uniform float uRadius;
void main() {
  vec3 base = texture2D(tMap, vUv).rgb;
  vec3 N = normalize(vNormal);
  vec3 L = normalize(vec3(-0.35, 0.55, 0.78));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float diff = clamp(dot(N, L), 0.0, 1.0);
  float specRaw = pow(clamp(dot(N, H), 0.0, 1.0), 26.0);
  float specFlat = pow(clamp(H.z, 0.0, 1.0), 26.0);
  float spec = clamp((specRaw - specFlat) / (1.0 - specFlat), 0.0, 1.0);
  float ao = clamp(1.0 + vDepth * 0.45, 0.65, 1.25);
  vec3 lit = base * (1.0 - uShading * 0.28);
  lit += base * diff * uShading * 0.55;
  lit *= ao;
  lit += uHighlight * spec * uShading * 0.25;
  vec2 p = (vUv - 0.5) * uRes;
  vec2 halfRes = uRes * 0.5;
  float r = min(uRadius, min(halfRes.x, halfRes.y));
  vec2 q = abs(p) - (halfRes - r);
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  float alpha = 1.0 - smoothstep(-1.25, 1.25, sd);
  if (alpha <= 0.002) discard;
  gl_FragColor = vec4(lit, alpha);
}`;

async function createElasticMesh(container, image, config = {}) {
  if (!container || !image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (!container.isConnected) return () => {};

  const options = {
    stiffness: 0.05,
    damping: 0.2,
    grabRadius: 0.6,
    pull: 0.4,
    wobble: 5,
    tilt: 5,
    shading: 0.72,
    resolution: 25,
    borderRadius: 30,
    ...config,
  };
  const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const N = Math.max(6, Math.min(40, Math.round(options.resolution)));
  const nodeCount = N * N;
  const aGrid = new Float32Array(nodeCount * 2);
  const uv = new Float32Array(nodeCount * 2);
  const aOffset = new Float32Array(nodeCount * 3);
  const aNormal = new Float32Array(nodeCount * 3);
  for (let j = 0; j < N; j += 1) {
    for (let i = 0; i < N; i += 1) {
      const idx = j * N + i;
      const u = i / (N - 1);
      const v = j / (N - 1);
      aGrid[idx * 2] = u;
      aGrid[idx * 2 + 1] = v;
      uv[idx * 2] = u;
      uv[idx * 2 + 1] = v;
      aNormal[idx * 3 + 2] = 1;
    }
  }
  const index = new Uint16Array((N - 1) * (N - 1) * 6);
  let indexOffset = 0;
  for (let j = 0; j < N - 1; j += 1) {
    for (let i = 0; i < N - 1; i += 1) {
      const a = j * N + i;
      const b = a + 1;
      const c = a + N;
      const d = c + 1;
      index[indexOffset++] = a;
      index[indexOffset++] = c;
      index[indexOffset++] = b;
      index[indexOffset++] = b;
      index[indexOffset++] = c;
      index[indexOffset++] = d;
    }
  }
  const geometry = new Geometry(gl, {
    aGrid: { size: 2, data: aGrid },
    uv: { size: 2, data: uv },
    aOffset: { size: 3, data: aOffset },
    aNormal: { size: 3, data: aNormal },
    index: { data: index },
  });
  const texture = new Texture(gl, { generateMipmaps: false, flipY: false });
  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    transparent: true,
    cullFace: null,
    uniforms: {
      tMap: { value: texture },
      uHasImage: { value: 0 },
      uHighlight: { value: [1, 1, 1] },
      uShading: { value: options.shading },
      uRes: { value: [1, 1] },
      uRadius: { value: options.borderRadius },
      uAspect: { value: 1 },
      uTilt: { value: (options.tilt * Math.PI) / 180 },
      uDist: { value: DIST },
      uFit: { value: FIT },
      uUvScale: { value: [1, 1] },
      uUvOffset: { value: [0, 0] },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });
  const baseX = new Float32Array(nodeCount);
  const baseY = new Float32Array(nodeCount);
  const pos = new Float32Array(nodeCount * 3);
  const vel = new Float32Array(nodeCount * 3);
  const accel = new Float32Array(nodeCount * 3);
  let aspect = 1;
  let destroyed = false;
  let ready = false;
  let resumeTimer = 0;

  gl.canvas.className = "ad-elastic-mesh-canvas";
  container.appendChild(gl.canvas);
  const imageElement = new Image();
  imageElement.crossOrigin = "anonymous";
  imageElement.onload = () => {
    if (destroyed) return;
    texture.image = imageElement;
    updateTextureFit();
    program.uniforms.uHasImage.value = 1;
    ready = true;
    gl.canvas.addClass?.("is-ready");
    gl.canvas.classList.add("is-ready");
  };
  imageElement.src = image;

  function refreshBase() {
    for (let idx = 0; idx < nodeCount; idx += 1) {
      baseX[idx] = (aGrid[idx * 2] * 2 - 1) * aspect;
      baseY[idx] = 1 - aGrid[idx * 2 + 1] * 2;
    }
  }
  function resize() {
    const width = container.offsetWidth || 1;
    const height = container.offsetHeight || 1;
    renderer.setSize(width, height);
    aspect = width / height;
    program.uniforms.uAspect.value = aspect;
    program.uniforms.uRes.value = [width, height];
    updateTextureFit();
    refreshBase();
  }
  function updateTextureFit() {
    if (!imageElement.naturalWidth || !imageElement.naturalHeight) return;
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width || 1;
    const height = containerRect.height || 1;
    const imageAspect = imageElement.naturalWidth / imageElement.naturalHeight;
    const source = options.sourceElement;
    if (source?.isConnected) {
      const sourceRect = source.getBoundingClientRect();
      const style = getComputedStyle(source);
      const positionParts = style.objectPosition.trim().split(/\s+/);
      const positionValue = (part, fallback) => {
        const value = parseFloat(part);
        return Number.isFinite(value) && part?.includes("%") ? value / 100 : fallback;
      };
      const positionX = positionValue(positionParts[0], .5);
      const positionY = positionValue(positionParts[1], .5);
      const boxWidth = sourceRect.width || width;
      const boxHeight = sourceRect.height || height;
      const boxAspect = boxWidth / boxHeight;
      let renderedWidth;
      let renderedHeight;
      if (imageAspect > boxAspect) {
        renderedHeight = boxHeight;
        renderedWidth = renderedHeight * imageAspect;
      } else {
        renderedWidth = boxWidth;
        renderedHeight = renderedWidth / imageAspect;
      }
      const renderedLeft = sourceRect.left + (boxWidth - renderedWidth) * positionX;
      const renderedTop = sourceRect.top + (boxHeight - renderedHeight) * positionY;
      program.uniforms.uUvScale.value = [width / renderedWidth, height / renderedHeight];
      program.uniforms.uUvOffset.value = [
        (containerRect.left - renderedLeft) / renderedWidth,
        (containerRect.top - renderedTop) / renderedHeight,
      ];
      return;
    }
    const viewAspect = width / height;
    const scaleX = imageAspect > viewAspect ? viewAspect / imageAspect : 1;
    const scaleY = imageAspect > viewAspect ? 1 : imageAspect / viewAspect;
    program.uniforms.uUvScale.value = [scaleX, scaleY];
    program.uniforms.uUvOffset.value = [(1 - scaleX) / 2, (1 - scaleY) / 2];
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false, targetActive: false };
  function toPlane(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    const clipX = ((clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    const clipY = 1 - ((clientY - rect.top) / Math.max(rect.height, 1)) * 2;
    const tilt = (options.tilt * Math.PI) / 180;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    const a = clipY / (ct * FIT * DIST);
    const py = (a * DIST) / (1 + a * st);
    const perspective = DIST / (DIST - py * st);
    pointer.tx = (clipX * aspect) / (perspective * FIT);
    pointer.ty = py;
  }
  function onMove(event) {
    toPlane(event.clientX, event.clientY);
    pointer.targetActive = true;
  }
  function onEnter(event) {
    clearTimeout(resumeTimer);
    container.classList.add("is-mesh-interacting");
    updateTextureFit();
    toPlane(event.clientX, event.clientY);
    pointer.x = pointer.tx;
    pointer.y = pointer.ty;
    pointer.targetActive = true;
    gl.canvas.classList.add("is-interacting");
  }
  function onLeave() {
    pointer.targetActive = false;
    gl.canvas.classList.remove("is-interacting");
    resumeTimer = window.setTimeout(() => container.classList.remove("is-mesh-interacting"), 360);
  }
  container.addEventListener("pointermove", onMove);
  container.addEventListener("pointerenter", onEnter);
  container.addEventListener("pointerleave", onLeave);

  const STEP = 1 / 120;
  const MAX_SUB = 5;
  let accumulated = 0;
  let last = performance.now();
  function substep() {
    const retain = 1 - options.damping;
    const coupling = 0.06 + options.wobble * 0.032;
    const active = pointer.active;
    const radius = Math.max(0.08, options.grabRadius) * 1.4;
    const inverseRadius = 1 / radius;
    const force = options.pull * 0.009;
    for (let j = 0; j < N; j += 1) {
      for (let i = 0; i < N; i += 1) {
        const idx = j * N + i;
        const offset = idx * 3;
        const ox = pos[offset];
        const oy = pos[offset + 1];
        const oz = pos[offset + 2];
        let ax = -options.stiffness * ox;
        let ay = -options.stiffness * oy;
        let az = -options.stiffness * oz;
        let sumX = 0;
        let sumY = 0;
        let sumZ = 0;
        let count = 0;
        const addNeighbor = (neighbor) => {
          const n = neighbor * 3;
          sumX += pos[n];
          sumY += pos[n + 1];
          sumZ += pos[n + 2];
          count += 1;
        };
        if (i > 0) addNeighbor(idx - 1);
        if (i < N - 1) addNeighbor(idx + 1);
        if (j > 0) addNeighbor(idx - N);
        if (j < N - 1) addNeighbor(idx + N);
        ax += coupling * (sumX - count * ox);
        ay += coupling * (sumY - count * oy);
        az += coupling * (sumZ - count * oz);
        if (active) {
          const dx = pointer.x - (baseX[idx] + ox);
          const dy = pointer.y - (baseY[idx] + oy);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const normalized = distance * inverseRadius;
          if (normalized < 1) {
            const bump = 1 - normalized * normalized;
            az += force * bump * bump * 6;
            if (distance > 1e-4) {
              const pinch = normalized * (1 - normalized) * (1 - normalized) * 6.75;
              const direction = (force * pinch * 1.6) / distance;
              ax += dx * direction;
              ay += dy * direction;
            }
          }
        }
        accel[offset] = ax;
        accel[offset + 1] = ay;
        accel[offset + 2] = az;
      }
    }
    for (let idx = 0; idx < nodeCount; idx += 1) {
      const offset = idx * 3;
      for (let axis = 0; axis < 3; axis += 1) {
        const velocity = (vel[offset + axis] + accel[offset + axis]) * retain;
        vel[offset + axis] = velocity;
        pos[offset + axis] = Math.max(-1.2, Math.min(1.2, pos[offset + axis] + velocity));
      }
    }
  }
  function commit() {
    for (let j = 0; j < N; j += 1) {
      for (let i = 0; i < N; i += 1) {
        const idx = j * N + i;
        const offset = idx * 3;
        const leftIndex = i > 0 ? idx - 1 : idx;
        const rightIndex = i < N - 1 ? idx + 1 : idx;
        const downIndex = j > 0 ? idx - N : idx;
        const upIndex = j < N - 1 ? idx + N : idx;
        const left = leftIndex * 3;
        const right = rightIndex * 3;
        const down = downIndex * 3;
        const up = upIndex * 3;
        const tangentXx = baseX[rightIndex] + pos[right] - baseX[leftIndex] - pos[left];
        const tangentXy = baseY[rightIndex] + pos[right + 1] - baseY[leftIndex] - pos[left + 1];
        const tangentXz = pos[right + 2] - pos[left + 2];
        const tangentYx = baseX[upIndex] + pos[up] - baseX[downIndex] - pos[down];
        const tangentYy = baseY[upIndex] + pos[up + 1] - baseY[downIndex] - pos[down + 1];
        const tangentYz = pos[up + 2] - pos[down + 2];
        let nx = tangentXy * tangentYz - tangentXz * tangentYy;
        let ny = tangentXz * tangentYx - tangentXx * tangentYz;
        let nz = tangentXx * tangentYy - tangentXy * tangentYx;
        if (nz < 0) { nx = -nx; ny = -ny; nz = -nz; }
        const length = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        aNormal[offset] = nx / length;
        aNormal[offset + 1] = ny / length;
        aNormal[offset + 2] = nz / length;
        aOffset[offset] = pos[offset];
        aOffset[offset + 1] = pos[offset + 1];
        aOffset[offset + 2] = pos[offset + 2];
      }
    }
    geometry.attributes.aOffset.needsUpdate = true;
    geometry.attributes.aNormal.needsUpdate = true;
  }

  let animationFrame = 0;
  function frame(now) {
    if (destroyed) return;
    animationFrame = requestAnimationFrame(frame);
    let delta = Math.min(0.25, (now - last) / 1000);
    last = now;
    const interpolation = 1 - Math.exp(-Math.max(delta, 1e-4) / 0.06);
    pointer.x += (pointer.tx - pointer.x) * interpolation;
    pointer.y += (pointer.ty - pointer.y) * interpolation;
    pointer.active = pointer.targetActive && ready;
    accumulated += delta;
    let substeps = 0;
    while (accumulated >= STEP && substeps < MAX_SUB) {
      substep();
      accumulated -= STEP;
      substeps += 1;
    }
    if (accumulated > STEP) accumulated = 0;
    commit();
    renderer.render({ scene: mesh });
  }
  animationFrame = requestAnimationFrame(frame);

  return () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(animationFrame);
    clearTimeout(resumeTimer);
    container.classList.remove("is-mesh-interacting");
    resizeObserver.disconnect();
    container.removeEventListener("pointermove", onMove);
    container.removeEventListener("pointerenter", onEnter);
    container.removeEventListener("pointerleave", onLeave);
    gl.canvas.remove();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}

export { createElasticMesh };
