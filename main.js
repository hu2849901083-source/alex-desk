var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/ogl/src/math/functions/Vec3Func.js
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return x * x + y * y + z * z;
}
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return x * x + y * y + z * z;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x * x + y * y + z * z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
function smoothLerp(out, a, b, decay, dt) {
  const exp = Math.exp(-decay * dt);
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = b[0] + (ax - b[0]) * exp;
  out[1] = b[1] + (ay - b[1]) * exp;
  out[2] = b[2] + (az - b[2]) * exp;
  return out;
}
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function scaleRotateMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
  return out;
}
function transformMat3(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
function transformQuat(out, a, q) {
  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  let uvx = qy * z - qz * y;
  let uvy = qz * x - qx * z;
  let uvz = qx * y - qy * x;
  let uuvx = qy * uvz - qz * uvy;
  let uuvy = qz * uvx - qx * uvz;
  let uuvz = qx * uvy - qy * uvx;
  let w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
var angle;
var init_Vec3Func = __esm({
  "node_modules/ogl/src/math/functions/Vec3Func.js"() {
    angle = /* @__PURE__ */ (function() {
      const tempA = [0, 0, 0];
      const tempB = [0, 0, 0];
      return function(a, b) {
        copy(tempA, a);
        copy(tempB, b);
        normalize(tempA, tempA);
        normalize(tempB, tempB);
        let cosine = dot(tempA, tempB);
        if (cosine > 1) {
          return 0;
        } else if (cosine < -1) {
          return Math.PI;
        } else {
          return Math.acos(cosine);
        }
      };
    })();
  }
});

// node_modules/ogl/src/math/Vec3.js
var Vec3;
var init_Vec3 = __esm({
  "node_modules/ogl/src/math/Vec3.js"() {
    init_Vec3Func();
    Vec3 = class _Vec3 extends Array {
      constructor(x = 0, y = x, z = x) {
        super(x, y, z);
        return this;
      }
      get x() {
        return this[0];
      }
      get y() {
        return this[1];
      }
      get z() {
        return this[2];
      }
      set x(v) {
        this[0] = v;
      }
      set y(v) {
        this[1] = v;
      }
      set z(v) {
        this[2] = v;
      }
      set(x, y = x, z = x) {
        if (x.length) return this.copy(x);
        set(this, x, y, z);
        return this;
      }
      copy(v) {
        copy(this, v);
        return this;
      }
      add(va, vb) {
        if (vb) add(this, va, vb);
        else add(this, this, va);
        return this;
      }
      sub(va, vb) {
        if (vb) subtract(this, va, vb);
        else subtract(this, this, va);
        return this;
      }
      multiply(v) {
        if (v.length) multiply(this, this, v);
        else scale(this, this, v);
        return this;
      }
      divide(v) {
        if (v.length) divide(this, this, v);
        else scale(this, this, 1 / v);
        return this;
      }
      inverse(v = this) {
        inverse(this, v);
        return this;
      }
      // Can't use 'length' as Array.prototype uses it
      len() {
        return length(this);
      }
      distance(v) {
        if (v) return distance(this, v);
        else return length(this);
      }
      squaredLen() {
        return squaredLength(this);
      }
      squaredDistance(v) {
        if (v) return squaredDistance(this, v);
        else return squaredLength(this);
      }
      negate(v = this) {
        negate(this, v);
        return this;
      }
      cross(va, vb) {
        if (vb) cross(this, va, vb);
        else cross(this, this, va);
        return this;
      }
      scale(v) {
        scale(this, this, v);
        return this;
      }
      normalize() {
        normalize(this, this);
        return this;
      }
      dot(v) {
        return dot(this, v);
      }
      equals(v) {
        return exactEquals(this, v);
      }
      applyMatrix3(mat3) {
        transformMat3(this, this, mat3);
        return this;
      }
      applyMatrix4(mat4) {
        transformMat4(this, this, mat4);
        return this;
      }
      scaleRotateMatrix4(mat4) {
        scaleRotateMat4(this, this, mat4);
        return this;
      }
      applyQuaternion(q) {
        transformQuat(this, this, q);
        return this;
      }
      angle(v) {
        return angle(this, v);
      }
      lerp(v, t) {
        lerp(this, this, v, t);
        return this;
      }
      smoothLerp(v, decay, dt) {
        smoothLerp(this, this, v, decay, dt);
        return this;
      }
      clone() {
        return new _Vec3(this[0], this[1], this[2]);
      }
      fromArray(a, o = 0) {
        this[0] = a[o];
        this[1] = a[o + 1];
        this[2] = a[o + 2];
        return this;
      }
      toArray(a = [], o = 0) {
        a[o] = this[0];
        a[o + 1] = this[1];
        a[o + 2] = this[2];
        return a;
      }
      transformDirection(mat4) {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        this[0] = mat4[0] * x + mat4[4] * y + mat4[8] * z;
        this[1] = mat4[1] * x + mat4[5] * y + mat4[9] * z;
        this[2] = mat4[2] * x + mat4[6] * y + mat4[10] * z;
        return this.normalize();
      }
    };
  }
});

// node_modules/ogl/src/core/Geometry.js
var tempVec3, ID, ATTR_ID, isBoundsWarned, Geometry;
var init_Geometry = __esm({
  "node_modules/ogl/src/core/Geometry.js"() {
    init_Vec3();
    tempVec3 = /* @__PURE__ */ new Vec3();
    ID = 1;
    ATTR_ID = 1;
    isBoundsWarned = false;
    Geometry = class {
      constructor(gl, attributes = {}) {
        if (!gl.canvas) console.error("gl not passed as first argument to Geometry");
        this.gl = gl;
        this.attributes = attributes;
        this.id = ID++;
        this.VAOs = {};
        this.drawRange = { start: 0, count: 0 };
        this.instancedCount = 0;
        this.gl.renderer.bindVertexArray(null);
        this.gl.renderer.currentGeometry = null;
        this.glState = this.gl.renderer.state;
        for (let key in attributes) {
          this.addAttribute(key, attributes[key]);
        }
      }
      addAttribute(key, attr) {
        this.attributes[key] = attr;
        attr.id = ATTR_ID++;
        attr.size = attr.size || 1;
        attr.type = attr.type || (attr.data.constructor === Float32Array ? this.gl.FLOAT : attr.data.constructor === Uint16Array ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_INT);
        attr.target = key === "index" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
        attr.normalized = attr.normalized || false;
        attr.stride = attr.stride || 0;
        attr.offset = attr.offset || 0;
        attr.count = attr.count || (attr.stride ? attr.data.byteLength / attr.stride : attr.data.length / attr.size);
        attr.divisor = attr.instanced || 0;
        attr.needsUpdate = false;
        attr.usage = attr.usage || this.gl.STATIC_DRAW;
        if (!attr.buffer) {
          this.updateAttribute(attr);
        }
        if (attr.divisor) {
          this.isInstanced = true;
          if (this.instancedCount && this.instancedCount !== attr.count * attr.divisor) {
            console.warn("geometry has multiple instanced buffers of different length");
            return this.instancedCount = Math.min(this.instancedCount, attr.count * attr.divisor);
          }
          this.instancedCount = attr.count * attr.divisor;
        } else if (key === "index") {
          this.drawRange.count = attr.count;
        } else if (!this.attributes.index) {
          this.drawRange.count = Math.max(this.drawRange.count, attr.count);
        }
      }
      updateAttribute(attr) {
        const isNewBuffer = !attr.buffer;
        if (isNewBuffer) attr.buffer = this.gl.createBuffer();
        if (this.glState.boundBuffer !== attr.buffer) {
          this.gl.bindBuffer(attr.target, attr.buffer);
          this.glState.boundBuffer = attr.buffer;
        }
        if (isNewBuffer) {
          this.gl.bufferData(attr.target, attr.data, attr.usage);
        } else {
          this.gl.bufferSubData(attr.target, 0, attr.data);
        }
        attr.needsUpdate = false;
      }
      setIndex(value) {
        this.addAttribute("index", value);
      }
      setDrawRange(start, count) {
        this.drawRange.start = start;
        this.drawRange.count = count;
      }
      setInstancedCount(value) {
        this.instancedCount = value;
      }
      createVAO(program) {
        this.VAOs[program.attributeOrder] = this.gl.renderer.createVertexArray();
        this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
        this.bindAttributes(program);
      }
      bindAttributes(program) {
        program.attributeLocations.forEach((location, { name, type }) => {
          if (!this.attributes[name]) {
            console.warn(`active attribute ${name} not being supplied`);
            return;
          }
          const attr = this.attributes[name];
          this.gl.bindBuffer(attr.target, attr.buffer);
          this.glState.boundBuffer = attr.buffer;
          let numLoc = 1;
          if (type === 35674) numLoc = 2;
          if (type === 35675) numLoc = 3;
          if (type === 35676) numLoc = 4;
          const size = attr.size / numLoc;
          const stride = numLoc === 1 ? 0 : numLoc * numLoc * 4;
          const offset = numLoc === 1 ? 0 : numLoc * 4;
          for (let i = 0; i < numLoc; i++) {
            this.gl.vertexAttribPointer(location + i, size, attr.type, attr.normalized, attr.stride + stride, attr.offset + i * offset);
            this.gl.enableVertexAttribArray(location + i);
            this.gl.renderer.vertexAttribDivisor(location + i, attr.divisor);
          }
        });
        if (this.attributes.index) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
      }
      draw({ program, mode = this.gl.TRIANGLES }) {
        if (this.gl.renderer.currentGeometry !== `${this.id}_${program.attributeOrder}`) {
          if (!this.VAOs[program.attributeOrder]) this.createVAO(program);
          this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
          this.gl.renderer.currentGeometry = `${this.id}_${program.attributeOrder}`;
        }
        program.attributeLocations.forEach((location, { name }) => {
          const attr = this.attributes[name];
          if (attr.needsUpdate) this.updateAttribute(attr);
        });
        let indexBytesPerElement = 2;
        if (this.attributes.index?.type === this.gl.UNSIGNED_INT) indexBytesPerElement = 4;
        if (this.isInstanced) {
          if (this.attributes.index) {
            this.gl.renderer.drawElementsInstanced(
              mode,
              this.drawRange.count,
              this.attributes.index.type,
              this.attributes.index.offset + this.drawRange.start * indexBytesPerElement,
              this.instancedCount
            );
          } else {
            this.gl.renderer.drawArraysInstanced(mode, this.drawRange.start, this.drawRange.count, this.instancedCount);
          }
        } else {
          if (this.attributes.index) {
            this.gl.drawElements(
              mode,
              this.drawRange.count,
              this.attributes.index.type,
              this.attributes.index.offset + this.drawRange.start * indexBytesPerElement
            );
          } else {
            this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
          }
        }
      }
      getPosition() {
        const attr = this.attributes.position;
        if (attr.data) return attr;
        if (isBoundsWarned) return;
        console.warn("No position buffer data found to compute bounds");
        return isBoundsWarned = true;
      }
      computeBoundingBox(attr) {
        if (!attr) attr = this.getPosition();
        const array = attr.data;
        const stride = attr.size;
        if (!this.bounds) {
          this.bounds = {
            min: new Vec3(),
            max: new Vec3(),
            center: new Vec3(),
            scale: new Vec3(),
            radius: Infinity
          };
        }
        const min = this.bounds.min;
        const max = this.bounds.max;
        const center = this.bounds.center;
        const scale5 = this.bounds.scale;
        min.set(Infinity);
        max.set(-Infinity);
        for (let i = 0, l = array.length; i < l; i += stride) {
          const x = array[i];
          const y = array[i + 1];
          const z = array[i + 2];
          min.x = Math.min(x, min.x);
          min.y = Math.min(y, min.y);
          min.z = Math.min(z, min.z);
          max.x = Math.max(x, max.x);
          max.y = Math.max(y, max.y);
          max.z = Math.max(z, max.z);
        }
        scale5.sub(max, min);
        center.add(min, max).divide(2);
      }
      computeBoundingSphere(attr) {
        if (!attr) attr = this.getPosition();
        const array = attr.data;
        const stride = attr.size;
        if (!this.bounds) this.computeBoundingBox(attr);
        let maxRadiusSq = 0;
        for (let i = 0, l = array.length; i < l; i += stride) {
          tempVec3.fromArray(array, i);
          maxRadiusSq = Math.max(maxRadiusSq, this.bounds.center.squaredDistance(tempVec3));
        }
        this.bounds.radius = Math.sqrt(maxRadiusSq);
      }
      remove() {
        for (let key in this.VAOs) {
          this.gl.renderer.deleteVertexArray(this.VAOs[key]);
          delete this.VAOs[key];
        }
        for (let key in this.attributes) {
          this.gl.deleteBuffer(this.attributes[key].buffer);
          delete this.attributes[key];
        }
      }
    };
  }
});

// node_modules/ogl/src/core/Program.js
function setUniform(gl, type, location, value) {
  value = value.length ? flatten(value) : value;
  const setValue = gl.renderer.state.uniformLocations.get(location);
  if (value.length) {
    if (setValue === void 0 || setValue.length !== value.length) {
      gl.renderer.state.uniformLocations.set(location, value.slice(0));
    } else {
      if (arraysEqual(setValue, value)) return;
      setValue.set ? setValue.set(value) : setArray(setValue, value);
      gl.renderer.state.uniformLocations.set(location, setValue);
    }
  } else {
    if (setValue === value) return;
    gl.renderer.state.uniformLocations.set(location, value);
  }
  switch (type) {
    case 5126:
      return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value);
    // FLOAT
    case 35664:
      return gl.uniform2fv(location, value);
    // FLOAT_VEC2
    case 35665:
      return gl.uniform3fv(location, value);
    // FLOAT_VEC3
    case 35666:
      return gl.uniform4fv(location, value);
    // FLOAT_VEC4
    case 35670:
    // BOOL
    case 5124:
    // INT
    case 35678:
    // SAMPLER_2D
    case 36306:
    // U_SAMPLER_2D
    case 35680:
    // SAMPLER_CUBE
    case 36289:
      return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value);
    // SAMPLER_CUBE
    case 35671:
    // BOOL_VEC2
    case 35667:
      return gl.uniform2iv(location, value);
    // INT_VEC2
    case 35672:
    // BOOL_VEC3
    case 35668:
      return gl.uniform3iv(location, value);
    // INT_VEC3
    case 35673:
    // BOOL_VEC4
    case 35669:
      return gl.uniform4iv(location, value);
    // INT_VEC4
    case 35674:
      return gl.uniformMatrix2fv(location, false, value);
    // FLOAT_MAT2
    case 35675:
      return gl.uniformMatrix3fv(location, false, value);
    // FLOAT_MAT3
    case 35676:
      return gl.uniformMatrix4fv(location, false, value);
  }
}
function addLineNumbers(string) {
  let lines = string.split("\n");
  for (let i = 0; i < lines.length; i++) {
    lines[i] = i + 1 + ": " + lines[i];
  }
  return lines.join("\n");
}
function flatten(a) {
  const arrayLen = a.length;
  const valueLen = a[0].length;
  if (valueLen === void 0) return a;
  const length3 = arrayLen * valueLen;
  let value = arrayCacheF32[length3];
  if (!value) arrayCacheF32[length3] = value = new Float32Array(length3);
  for (let i = 0; i < arrayLen; i++) value.set(a[i], i * valueLen);
  return value;
}
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
function setArray(a, b) {
  for (let i = 0, l = a.length; i < l; i++) {
    a[i] = b[i];
  }
}
function warn(message) {
  if (warnCount > 100) return;
  console.warn(message);
  warnCount++;
  if (warnCount > 100) console.warn("More than 100 program warnings - stopping logs.");
}
var ID2, arrayCacheF32, Program, warnCount;
var init_Program = __esm({
  "node_modules/ogl/src/core/Program.js"() {
    ID2 = 1;
    arrayCacheF32 = {};
    Program = class {
      constructor(gl, {
        vertex,
        fragment,
        uniforms = {},
        transparent = false,
        cullFace = gl.BACK,
        frontFace = gl.CCW,
        depthTest = true,
        depthWrite = true,
        depthFunc = gl.LEQUAL
      } = {}) {
        if (!gl.canvas) console.error("gl not passed as first argument to Program");
        this.gl = gl;
        this.uniforms = uniforms;
        this.id = ID2++;
        if (!vertex) console.warn("vertex shader not supplied");
        if (!fragment) console.warn("fragment shader not supplied");
        this.transparent = transparent;
        this.cullFace = cullFace;
        this.frontFace = frontFace;
        this.depthTest = depthTest;
        this.depthWrite = depthWrite;
        this.depthFunc = depthFunc;
        this.blendFunc = {};
        this.blendEquation = {};
        this.stencilFunc = {};
        this.stencilOp = {};
        if (this.transparent && !this.blendFunc.src) {
          if (this.gl.renderer.premultipliedAlpha) this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
          else this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        }
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        this.setShaders({ vertex, fragment });
      }
      setShaders({ vertex, fragment }) {
        if (vertex) {
          this.gl.shaderSource(this.vertexShader, vertex);
          this.gl.compileShader(this.vertexShader);
          if (this.gl.getShaderInfoLog(this.vertexShader) !== "") {
            console.warn(`${this.gl.getShaderInfoLog(this.vertexShader)}
Vertex Shader
${addLineNumbers(vertex)}`);
          }
        }
        if (fragment) {
          this.gl.shaderSource(this.fragmentShader, fragment);
          this.gl.compileShader(this.fragmentShader);
          if (this.gl.getShaderInfoLog(this.fragmentShader) !== "") {
            console.warn(`${this.gl.getShaderInfoLog(this.fragmentShader)}
Fragment Shader
${addLineNumbers(fragment)}`);
          }
        }
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
          return console.warn(this.gl.getProgramInfoLog(this.program));
        }
        this.uniformLocations = /* @__PURE__ */ new Map();
        let numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
          let uniform = this.gl.getActiveUniform(this.program, uIndex);
          this.uniformLocations.set(uniform, this.gl.getUniformLocation(this.program, uniform.name));
          const split = uniform.name.match(/(\w+)/g);
          uniform.uniformName = split[0];
          uniform.nameComponents = split.slice(1);
        }
        this.attributeLocations = /* @__PURE__ */ new Map();
        const locations = [];
        const numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
          const attribute = this.gl.getActiveAttrib(this.program, aIndex);
          const location = this.gl.getAttribLocation(this.program, attribute.name);
          if (location === -1) continue;
          locations[location] = attribute.name;
          this.attributeLocations.set(attribute, location);
        }
        this.attributeOrder = locations.join("");
      }
      setBlendFunc(src, dst, srcAlpha, dstAlpha) {
        this.blendFunc.src = src;
        this.blendFunc.dst = dst;
        this.blendFunc.srcAlpha = srcAlpha;
        this.blendFunc.dstAlpha = dstAlpha;
        if (src) this.transparent = true;
      }
      setBlendEquation(modeRGB, modeAlpha) {
        this.blendEquation.modeRGB = modeRGB;
        this.blendEquation.modeAlpha = modeAlpha;
      }
      setStencilFunc(func, ref, mask) {
        this.stencilRef = ref;
        this.stencilFunc.func = func;
        this.stencilFunc.ref = ref;
        this.stencilFunc.mask = mask;
      }
      setStencilOp(stencilFail, depthFail, depthPass) {
        this.stencilOp.stencilFail = stencilFail;
        this.stencilOp.depthFail = depthFail;
        this.stencilOp.depthPass = depthPass;
      }
      applyState() {
        if (this.depthTest) this.gl.renderer.enable(this.gl.DEPTH_TEST);
        else this.gl.renderer.disable(this.gl.DEPTH_TEST);
        if (this.cullFace) this.gl.renderer.enable(this.gl.CULL_FACE);
        else this.gl.renderer.disable(this.gl.CULL_FACE);
        if (this.blendFunc.src) this.gl.renderer.enable(this.gl.BLEND);
        else this.gl.renderer.disable(this.gl.BLEND);
        if (this.cullFace) this.gl.renderer.setCullFace(this.cullFace);
        this.gl.renderer.setFrontFace(this.frontFace);
        this.gl.renderer.setDepthMask(this.depthWrite);
        this.gl.renderer.setDepthFunc(this.depthFunc);
        if (this.blendFunc.src) this.gl.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha);
        this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha);
        if (this.stencilFunc.func || this.stencilOp.stencilFail) this.gl.renderer.enable(this.gl.STENCIL_TEST);
        else this.gl.renderer.disable(this.gl.STENCIL_TEST);
        this.gl.renderer.setStencilFunc(this.stencilFunc.func, this.stencilFunc.ref, this.stencilFunc.mask);
        this.gl.renderer.setStencilOp(this.stencilOp.stencilFail, this.stencilOp.depthFail, this.stencilOp.depthPass);
      }
      use({ flipFaces = false } = {}) {
        let textureUnit = -1;
        const programActive = this.gl.renderer.state.currentProgram === this.id;
        if (!programActive) {
          this.gl.useProgram(this.program);
          this.gl.renderer.state.currentProgram = this.id;
        }
        this.uniformLocations.forEach((location, activeUniform) => {
          let uniform = this.uniforms[activeUniform.uniformName];
          for (const component of activeUniform.nameComponents) {
            if (!uniform) break;
            if (component in uniform) {
              uniform = uniform[component];
            } else if (Array.isArray(uniform.value)) {
              break;
            } else {
              uniform = void 0;
              break;
            }
          }
          if (!uniform) {
            return warn(`Active uniform ${activeUniform.name} has not been supplied`);
          }
          if (uniform && uniform.value === void 0) {
            return warn(`${activeUniform.name} uniform is missing a value parameter`);
          }
          if (uniform.value.texture) {
            textureUnit = textureUnit + 1;
            uniform.value.update(textureUnit);
            return setUniform(this.gl, activeUniform.type, location, textureUnit);
          }
          if (uniform.value.length && uniform.value[0].texture) {
            const textureUnits = [];
            uniform.value.forEach((value) => {
              textureUnit = textureUnit + 1;
              value.update(textureUnit);
              textureUnits.push(textureUnit);
            });
            return setUniform(this.gl, activeUniform.type, location, textureUnits);
          }
          setUniform(this.gl, activeUniform.type, location, uniform.value);
        });
        this.applyState();
        if (flipFaces) this.gl.renderer.setFrontFace(this.frontFace === this.gl.CCW ? this.gl.CW : this.gl.CCW);
      }
      remove() {
        this.gl.deleteProgram(this.program);
      }
    };
    warnCount = 0;
  }
});

// node_modules/ogl/src/core/Renderer.js
var tempVec32, ID3, Renderer;
var init_Renderer = __esm({
  "node_modules/ogl/src/core/Renderer.js"() {
    init_Vec3();
    tempVec32 = /* @__PURE__ */ new Vec3();
    ID3 = 1;
    Renderer = class {
      constructor({
        canvas = document.createElement("canvas"),
        width = 300,
        height = 150,
        dpr = 1,
        alpha = false,
        depth = true,
        stencil = false,
        antialias = false,
        premultipliedAlpha = false,
        preserveDrawingBuffer = false,
        powerPreference = "default",
        autoClear = true,
        webgl = 2
      } = {}) {
        const attributes = { alpha, depth, stencil, antialias, premultipliedAlpha, preserveDrawingBuffer, powerPreference };
        this.dpr = dpr;
        this.alpha = alpha;
        this.color = true;
        this.depth = depth;
        this.stencil = stencil;
        this.premultipliedAlpha = premultipliedAlpha;
        this.autoClear = autoClear;
        this.id = ID3++;
        if (webgl === 2) this.gl = canvas.getContext("webgl2", attributes);
        this.isWebgl2 = !!this.gl;
        if (!this.gl) this.gl = canvas.getContext("webgl", attributes);
        if (!this.gl) console.error("unable to create webgl context");
        this.gl.renderer = this;
        this.setSize(width, height);
        this.state = {};
        this.state.blendFunc = { src: this.gl.ONE, dst: this.gl.ZERO };
        this.state.blendEquation = { modeRGB: this.gl.FUNC_ADD };
        this.state.cullFace = false;
        this.state.frontFace = this.gl.CCW;
        this.state.depthMask = true;
        this.state.depthFunc = this.gl.LEQUAL;
        this.state.premultiplyAlpha = false;
        this.state.flipY = false;
        this.state.unpackAlignment = 4;
        this.state.framebuffer = null;
        this.state.viewport = { x: 0, y: 0, width: null, height: null };
        this.state.textureUnits = [];
        this.state.activeTextureUnit = 0;
        this.state.boundBuffer = null;
        this.state.uniformLocations = /* @__PURE__ */ new Map();
        this.state.currentProgram = null;
        this.extensions = {};
        if (this.isWebgl2) {
          this.getExtension("EXT_color_buffer_float");
          this.getExtension("OES_texture_float_linear");
        } else {
          this.getExtension("OES_texture_float");
          this.getExtension("OES_texture_float_linear");
          this.getExtension("OES_texture_half_float");
          this.getExtension("OES_texture_half_float_linear");
          this.getExtension("OES_element_index_uint");
          this.getExtension("OES_standard_derivatives");
          this.getExtension("EXT_sRGB");
          this.getExtension("WEBGL_depth_texture");
          this.getExtension("WEBGL_draw_buffers");
        }
        this.getExtension("WEBGL_compressed_texture_astc");
        this.getExtension("EXT_texture_compression_bptc");
        this.getExtension("WEBGL_compressed_texture_s3tc");
        this.getExtension("WEBGL_compressed_texture_etc1");
        this.getExtension("WEBGL_compressed_texture_pvrtc");
        this.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        this.vertexAttribDivisor = this.getExtension("ANGLE_instanced_arrays", "vertexAttribDivisor", "vertexAttribDivisorANGLE");
        this.drawArraysInstanced = this.getExtension("ANGLE_instanced_arrays", "drawArraysInstanced", "drawArraysInstancedANGLE");
        this.drawElementsInstanced = this.getExtension("ANGLE_instanced_arrays", "drawElementsInstanced", "drawElementsInstancedANGLE");
        this.createVertexArray = this.getExtension("OES_vertex_array_object", "createVertexArray", "createVertexArrayOES");
        this.bindVertexArray = this.getExtension("OES_vertex_array_object", "bindVertexArray", "bindVertexArrayOES");
        this.deleteVertexArray = this.getExtension("OES_vertex_array_object", "deleteVertexArray", "deleteVertexArrayOES");
        this.drawBuffers = this.getExtension("WEBGL_draw_buffers", "drawBuffers", "drawBuffersWEBGL");
        this.parameters = {};
        this.parameters.maxTextureUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        this.parameters.maxAnisotropy = this.getExtension("EXT_texture_filter_anisotropic") ? this.gl.getParameter(this.getExtension("EXT_texture_filter_anisotropic").MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
      }
      setSize(width, height) {
        this.width = width;
        this.height = height;
        this.gl.canvas.width = width * this.dpr;
        this.gl.canvas.height = height * this.dpr;
        if (!this.gl.canvas.style) return;
        Object.assign(this.gl.canvas.style, {
          width: width + "px",
          height: height + "px"
        });
      }
      setViewport(width, height, x = 0, y = 0) {
        if (this.state.viewport.width === width && this.state.viewport.height === height) return;
        this.state.viewport.width = width;
        this.state.viewport.height = height;
        this.state.viewport.x = x;
        this.state.viewport.y = y;
        this.gl.viewport(x, y, width, height);
      }
      setScissor(width, height, x = 0, y = 0) {
        this.gl.scissor(x, y, width, height);
      }
      enable(id) {
        if (this.state[id] === true) return;
        this.gl.enable(id);
        this.state[id] = true;
      }
      disable(id) {
        if (this.state[id] === false) return;
        this.gl.disable(id);
        this.state[id] = false;
      }
      setBlendFunc(src, dst, srcAlpha, dstAlpha) {
        if (this.state.blendFunc.src === src && this.state.blendFunc.dst === dst && this.state.blendFunc.srcAlpha === srcAlpha && this.state.blendFunc.dstAlpha === dstAlpha)
          return;
        this.state.blendFunc.src = src;
        this.state.blendFunc.dst = dst;
        this.state.blendFunc.srcAlpha = srcAlpha;
        this.state.blendFunc.dstAlpha = dstAlpha;
        if (srcAlpha !== void 0) this.gl.blendFuncSeparate(src, dst, srcAlpha, dstAlpha);
        else this.gl.blendFunc(src, dst);
      }
      setBlendEquation(modeRGB, modeAlpha) {
        modeRGB = modeRGB || this.gl.FUNC_ADD;
        if (this.state.blendEquation.modeRGB === modeRGB && this.state.blendEquation.modeAlpha === modeAlpha) return;
        this.state.blendEquation.modeRGB = modeRGB;
        this.state.blendEquation.modeAlpha = modeAlpha;
        if (modeAlpha !== void 0) this.gl.blendEquationSeparate(modeRGB, modeAlpha);
        else this.gl.blendEquation(modeRGB);
      }
      setCullFace(value) {
        if (this.state.cullFace === value) return;
        this.state.cullFace = value;
        this.gl.cullFace(value);
      }
      setFrontFace(value) {
        if (this.state.frontFace === value) return;
        this.state.frontFace = value;
        this.gl.frontFace(value);
      }
      setDepthMask(value) {
        if (this.state.depthMask === value) return;
        this.state.depthMask = value;
        this.gl.depthMask(value);
      }
      setDepthFunc(value) {
        if (this.state.depthFunc === value) return;
        this.state.depthFunc = value;
        this.gl.depthFunc(value);
      }
      setStencilMask(value) {
        if (this.state.stencilMask === value) return;
        this.state.stencilMask = value;
        this.gl.stencilMask(value);
      }
      setStencilFunc(func, ref, mask) {
        if (this.state.stencilFunc === func && this.state.stencilRef === ref && this.state.stencilFuncMask === mask) return;
        this.state.stencilFunc = func || this.gl.ALWAYS;
        this.state.stencilRef = ref || 0;
        this.state.stencilFuncMask = mask || 0;
        this.gl.stencilFunc(func || this.gl.ALWAYS, ref || 0, mask || 0);
      }
      setStencilOp(stencilFail, depthFail, depthPass) {
        if (this.state.stencilFail === stencilFail && this.state.stencilDepthFail === depthFail && this.state.stencilDepthPass === depthPass) return;
        this.state.stencilFail = stencilFail;
        this.state.stencilDepthFail = depthFail;
        this.state.stencilDepthPass = depthPass;
        this.gl.stencilOp(stencilFail, depthFail, depthPass);
      }
      activeTexture(value) {
        if (this.state.activeTextureUnit === value) return;
        this.state.activeTextureUnit = value;
        this.gl.activeTexture(this.gl.TEXTURE0 + value);
      }
      bindFramebuffer({ target = this.gl.FRAMEBUFFER, buffer = null } = {}) {
        if (this.state.framebuffer === buffer) return;
        this.state.framebuffer = buffer;
        this.gl.bindFramebuffer(target, buffer);
      }
      getExtension(extension, webgl2Func, extFunc) {
        if (webgl2Func && this.gl[webgl2Func]) return this.gl[webgl2Func].bind(this.gl);
        if (!this.extensions[extension]) {
          this.extensions[extension] = this.gl.getExtension(extension);
        }
        if (!webgl2Func) return this.extensions[extension];
        if (!this.extensions[extension]) return null;
        return this.extensions[extension][extFunc].bind(this.extensions[extension]);
      }
      sortOpaque(a, b) {
        if (a.renderOrder !== b.renderOrder) {
          return a.renderOrder - b.renderOrder;
        } else if (a.program.id !== b.program.id) {
          return a.program.id - b.program.id;
        } else if (a.zDepth !== b.zDepth) {
          return a.zDepth - b.zDepth;
        } else {
          return b.id - a.id;
        }
      }
      sortTransparent(a, b) {
        if (a.renderOrder !== b.renderOrder) {
          return a.renderOrder - b.renderOrder;
        }
        if (a.zDepth !== b.zDepth) {
          return b.zDepth - a.zDepth;
        } else {
          return b.id - a.id;
        }
      }
      sortUI(a, b) {
        if (a.renderOrder !== b.renderOrder) {
          return a.renderOrder - b.renderOrder;
        } else if (a.program.id !== b.program.id) {
          return a.program.id - b.program.id;
        } else {
          return b.id - a.id;
        }
      }
      getRenderList({ scene, camera, frustumCull, sort }) {
        let renderList = [];
        if (camera && frustumCull) camera.updateFrustum();
        scene.traverse((node) => {
          if (!node.visible) return true;
          if (!node.draw) return;
          if (frustumCull && node.frustumCulled && camera) {
            if (!camera.frustumIntersectsMesh(node)) return;
          }
          renderList.push(node);
        });
        if (sort) {
          const opaque = [];
          const transparent = [];
          const ui = [];
          renderList.forEach((node) => {
            if (!node.program.transparent) {
              opaque.push(node);
            } else if (node.program.depthTest) {
              transparent.push(node);
            } else {
              ui.push(node);
            }
            node.zDepth = 0;
            if (node.renderOrder !== 0 || !node.program.depthTest || !camera) return;
            node.worldMatrix.getTranslation(tempVec32);
            tempVec32.applyMatrix4(camera.projectionViewMatrix);
            node.zDepth = tempVec32.z;
          });
          opaque.sort(this.sortOpaque);
          transparent.sort(this.sortTransparent);
          ui.sort(this.sortUI);
          renderList = opaque.concat(transparent, ui);
        }
        return renderList;
      }
      render({ scene, camera, target = null, update = true, sort = true, frustumCull = true, clear }) {
        if (target === null) {
          this.bindFramebuffer();
          this.setViewport(this.width * this.dpr, this.height * this.dpr);
        } else {
          this.bindFramebuffer(target);
          this.setViewport(target.width, target.height);
        }
        if (clear || this.autoClear && clear !== false) {
          if (this.depth && (!target || target.depth)) {
            this.enable(this.gl.DEPTH_TEST);
            this.setDepthMask(true);
          }
          if (this.stencil || (!target || target.stencil)) {
            this.enable(this.gl.STENCIL_TEST);
            this.setStencilMask(255);
          }
          this.gl.clear(
            (this.color ? this.gl.COLOR_BUFFER_BIT : 0) | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0)
          );
        }
        if (update) scene.updateMatrixWorld();
        if (camera) camera.updateMatrixWorld();
        const renderList = this.getRenderList({ scene, camera, frustumCull, sort });
        renderList.forEach((node) => {
          node.draw({ camera });
        });
      }
    };
  }
});

// node_modules/ogl/src/math/functions/Vec4Func.js
function copy2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function set2(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function normalize2(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x * x + y * y + z * z + w * w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
function dot2(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
var init_Vec4Func = __esm({
  "node_modules/ogl/src/math/functions/Vec4Func.js"() {
  }
});

// node_modules/ogl/src/math/functions/QuatFunc.js
function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
function multiply2(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function rotateX(out, a, rad) {
  rad *= 0.5;
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
function rotateY(out, a, rad) {
  rad *= 0.5;
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let by = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
function rotateZ(out, a, rad) {
  rad *= 0.5;
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bz = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
function slerp(out, a, b, t) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];
  let omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > 1e-6) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
function invert(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let dot4 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  let invDot = dot4 ? 1 / dot4 : 0;
  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
function fromMat3(out, m) {
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    let i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    let j = (i + 1) % 3;
    let k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
}
function fromEuler(out, euler, order = "YXZ") {
  let sx = Math.sin(euler[0] * 0.5);
  let cx = Math.cos(euler[0] * 0.5);
  let sy = Math.sin(euler[1] * 0.5);
  let cy = Math.cos(euler[1] * 0.5);
  let sz = Math.sin(euler[2] * 0.5);
  let cz = Math.cos(euler[2] * 0.5);
  if (order === "XYZ") {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === "YXZ") {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === "ZXY") {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === "ZYX") {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === "YZX") {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === "XZY") {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  }
  return out;
}
var copy3, set3, dot3, normalize3;
var init_QuatFunc = __esm({
  "node_modules/ogl/src/math/functions/QuatFunc.js"() {
    init_Vec4Func();
    copy3 = copy2;
    set3 = set2;
    dot3 = dot2;
    normalize3 = normalize2;
  }
});

// node_modules/ogl/src/math/Quat.js
var Quat;
var init_Quat = __esm({
  "node_modules/ogl/src/math/Quat.js"() {
    init_QuatFunc();
    Quat = class extends Array {
      constructor(x = 0, y = 0, z = 0, w = 1) {
        super(x, y, z, w);
        this.onChange = () => {
        };
        this._target = this;
        const triggerProps = ["0", "1", "2", "3"];
        return new Proxy(this, {
          set(target, property) {
            const success = Reflect.set(...arguments);
            if (success && triggerProps.includes(property)) target.onChange();
            return success;
          }
        });
      }
      get x() {
        return this[0];
      }
      get y() {
        return this[1];
      }
      get z() {
        return this[2];
      }
      get w() {
        return this[3];
      }
      set x(v) {
        this._target[0] = v;
        this.onChange();
      }
      set y(v) {
        this._target[1] = v;
        this.onChange();
      }
      set z(v) {
        this._target[2] = v;
        this.onChange();
      }
      set w(v) {
        this._target[3] = v;
        this.onChange();
      }
      identity() {
        identity(this._target);
        this.onChange();
        return this;
      }
      set(x, y, z, w) {
        if (x.length) return this.copy(x);
        set3(this._target, x, y, z, w);
        this.onChange();
        return this;
      }
      rotateX(a) {
        rotateX(this._target, this._target, a);
        this.onChange();
        return this;
      }
      rotateY(a) {
        rotateY(this._target, this._target, a);
        this.onChange();
        return this;
      }
      rotateZ(a) {
        rotateZ(this._target, this._target, a);
        this.onChange();
        return this;
      }
      inverse(q = this._target) {
        invert(this._target, q);
        this.onChange();
        return this;
      }
      conjugate(q = this._target) {
        conjugate(this._target, q);
        this.onChange();
        return this;
      }
      copy(q) {
        copy3(this._target, q);
        this.onChange();
        return this;
      }
      normalize(q = this._target) {
        normalize3(this._target, q);
        this.onChange();
        return this;
      }
      multiply(qA, qB) {
        if (qB) {
          multiply2(this._target, qA, qB);
        } else {
          multiply2(this._target, this._target, qA);
        }
        this.onChange();
        return this;
      }
      dot(v) {
        return dot3(this._target, v);
      }
      fromMatrix3(matrix3) {
        fromMat3(this._target, matrix3);
        this.onChange();
        return this;
      }
      fromEuler(euler, isInternal) {
        fromEuler(this._target, euler, euler.order);
        if (!isInternal) this.onChange();
        return this;
      }
      fromAxisAngle(axis, a) {
        setAxisAngle(this._target, axis, a);
        this.onChange();
        return this;
      }
      slerp(q, t) {
        slerp(this._target, this._target, q, t);
        this.onChange();
        return this;
      }
      fromArray(a, o = 0) {
        this._target[0] = a[o];
        this._target[1] = a[o + 1];
        this._target[2] = a[o + 2];
        this._target[3] = a[o + 3];
        this.onChange();
        return this;
      }
      toArray(a = [], o = 0) {
        a[o] = this[0];
        a[o + 1] = this[1];
        a[o + 2] = this[2];
        a[o + 3] = this[3];
        return a;
      }
    };
  }
});

// node_modules/ogl/src/math/functions/Mat4Func.js
function copy4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function set4(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function identity2(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function invert2(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
function multiply3(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
function translate(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}
function scale3(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function rotate(out, a, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.hypot(x, y, z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;
  if (Math.abs(len) < EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
function getMaxScaleOnAxis(mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  const x = m11 * m11 + m12 * m12 + m13 * m13;
  const y = m21 * m21 + m22 * m22 + m23 * m23;
  const z = m31 * m31 + m32 * m32 + m33 * m33;
  return Math.sqrt(Math.max(x, y, z));
}
function decompose(srcMat, dstRotation, dstTranslation, dstScale) {
  let sx = length([srcMat[0], srcMat[1], srcMat[2]]);
  const sy = length([srcMat[4], srcMat[5], srcMat[6]]);
  const sz = length([srcMat[8], srcMat[9], srcMat[10]]);
  const det = determinant(srcMat);
  if (det < 0) sx = -sx;
  dstTranslation[0] = srcMat[12];
  dstTranslation[1] = srcMat[13];
  dstTranslation[2] = srcMat[14];
  const _m1 = srcMat.slice();
  const invSX = 1 / sx;
  const invSY = 1 / sy;
  const invSZ = 1 / sz;
  _m1[0] *= invSX;
  _m1[1] *= invSX;
  _m1[2] *= invSX;
  _m1[4] *= invSY;
  _m1[5] *= invSY;
  _m1[6] *= invSY;
  _m1[8] *= invSZ;
  _m1[9] *= invSZ;
  _m1[10] *= invSZ;
  getRotation(dstRotation, _m1);
  dstScale[0] = sx;
  dstScale[1] = sy;
  dstScale[2] = sz;
}
function compose(dstMat, srcRotation, srcTranslation, srcScale) {
  const te = dstMat;
  const x = srcRotation[0], y = srcRotation[1], z = srcRotation[2], w = srcRotation[3];
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;
  const sx = srcScale[0], sy = srcScale[1], sz = srcScale[2];
  te[0] = (1 - (yy + zz)) * sx;
  te[1] = (xy + wz) * sx;
  te[2] = (xz - wy) * sx;
  te[3] = 0;
  te[4] = (xy - wz) * sy;
  te[5] = (1 - (xx + zz)) * sy;
  te[6] = (yz + wx) * sy;
  te[7] = 0;
  te[8] = (xz + wy) * sz;
  te[9] = (yz - wx) * sz;
  te[10] = (1 - (xx + yy)) * sz;
  te[11] = 0;
  te[12] = srcTranslation[0];
  te[13] = srcTranslation[1];
  te[14] = srcTranslation[2];
  te[15] = 1;
  return te;
}
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function perspective(out, fovy, aspect, near, far) {
  let f = 1 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
}
function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
function targetTo(out, eye, target, up) {
  let eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
  let z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
  let len = z0 * z0 + z1 * z1 + z2 * z2;
  if (len === 0) {
    z2 = 1;
  } else {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }
  let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;
  if (len === 0) {
    if (upz) {
      upx += 1e-6;
    } else if (upy) {
      upz += 1e-6;
    } else {
      upy += 1e-6;
    }
    x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
  }
  len = 1 / Math.sqrt(len);
  x0 *= len;
  x1 *= len;
  x2 *= len;
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
function add3(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
function subtract2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
var EPSILON, getRotation;
var init_Mat4Func = __esm({
  "node_modules/ogl/src/math/functions/Mat4Func.js"() {
    init_Vec3Func();
    EPSILON = 1e-6;
    getRotation = /* @__PURE__ */ (function() {
      const temp = [1, 1, 1];
      return function(out, mat) {
        let scaling = temp;
        getScaling(scaling, mat);
        let is1 = 1 / scaling[0];
        let is2 = 1 / scaling[1];
        let is3 = 1 / scaling[2];
        let sm11 = mat[0] * is1;
        let sm12 = mat[1] * is2;
        let sm13 = mat[2] * is3;
        let sm21 = mat[4] * is1;
        let sm22 = mat[5] * is2;
        let sm23 = mat[6] * is3;
        let sm31 = mat[8] * is1;
        let sm32 = mat[9] * is2;
        let sm33 = mat[10] * is3;
        let trace = sm11 + sm22 + sm33;
        let S = 0;
        if (trace > 0) {
          S = Math.sqrt(trace + 1) * 2;
          out[3] = 0.25 * S;
          out[0] = (sm23 - sm32) / S;
          out[1] = (sm31 - sm13) / S;
          out[2] = (sm12 - sm21) / S;
        } else if (sm11 > sm22 && sm11 > sm33) {
          S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
          out[3] = (sm23 - sm32) / S;
          out[0] = 0.25 * S;
          out[1] = (sm12 + sm21) / S;
          out[2] = (sm31 + sm13) / S;
        } else if (sm22 > sm33) {
          S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
          out[3] = (sm31 - sm13) / S;
          out[0] = (sm12 + sm21) / S;
          out[1] = 0.25 * S;
          out[2] = (sm23 + sm32) / S;
        } else {
          S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
          out[3] = (sm12 - sm21) / S;
          out[0] = (sm31 + sm13) / S;
          out[1] = (sm23 + sm32) / S;
          out[2] = 0.25 * S;
        }
        return out;
      };
    })();
  }
});

// node_modules/ogl/src/math/Mat4.js
var Mat4;
var init_Mat4 = __esm({
  "node_modules/ogl/src/math/Mat4.js"() {
    init_Mat4Func();
    Mat4 = class extends Array {
      constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
        super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
        return this;
      }
      get x() {
        return this[12];
      }
      get y() {
        return this[13];
      }
      get z() {
        return this[14];
      }
      get w() {
        return this[15];
      }
      set x(v) {
        this[12] = v;
      }
      set y(v) {
        this[13] = v;
      }
      set z(v) {
        this[14] = v;
      }
      set w(v) {
        this[15] = v;
      }
      set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        if (m00.length) return this.copy(m00);
        set4(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
        return this;
      }
      translate(v, m = this) {
        translate(this, m, v);
        return this;
      }
      rotate(v, axis, m = this) {
        rotate(this, m, v, axis);
        return this;
      }
      scale(v, m = this) {
        scale3(this, m, typeof v === "number" ? [v, v, v] : v);
        return this;
      }
      add(ma, mb) {
        if (mb) add3(this, ma, mb);
        else add3(this, this, ma);
        return this;
      }
      sub(ma, mb) {
        if (mb) subtract2(this, ma, mb);
        else subtract2(this, this, ma);
        return this;
      }
      multiply(ma, mb) {
        if (!ma.length) {
          multiplyScalar(this, this, ma);
        } else if (mb) {
          multiply3(this, ma, mb);
        } else {
          multiply3(this, this, ma);
        }
        return this;
      }
      identity() {
        identity2(this);
        return this;
      }
      copy(m) {
        copy4(this, m);
        return this;
      }
      fromPerspective({ fov, aspect, near, far } = {}) {
        perspective(this, fov, aspect, near, far);
        return this;
      }
      fromOrthogonal({ left, right, bottom, top, near, far }) {
        ortho(this, left, right, bottom, top, near, far);
        return this;
      }
      fromQuaternion(q) {
        fromQuat(this, q);
        return this;
      }
      setPosition(v) {
        this.x = v[0];
        this.y = v[1];
        this.z = v[2];
        return this;
      }
      inverse(m = this) {
        invert2(this, m);
        return this;
      }
      compose(q, pos, scale5) {
        compose(this, q, pos, scale5);
        return this;
      }
      decompose(q, pos, scale5) {
        decompose(this, q, pos, scale5);
        return this;
      }
      getRotation(q) {
        getRotation(q, this);
        return this;
      }
      getTranslation(pos) {
        getTranslation(pos, this);
        return this;
      }
      getScaling(scale5) {
        getScaling(scale5, this);
        return this;
      }
      getMaxScaleOnAxis() {
        return getMaxScaleOnAxis(this);
      }
      lookAt(eye, target, up) {
        targetTo(this, eye, target, up);
        return this;
      }
      determinant() {
        return determinant(this);
      }
      fromArray(a, o = 0) {
        this[0] = a[o];
        this[1] = a[o + 1];
        this[2] = a[o + 2];
        this[3] = a[o + 3];
        this[4] = a[o + 4];
        this[5] = a[o + 5];
        this[6] = a[o + 6];
        this[7] = a[o + 7];
        this[8] = a[o + 8];
        this[9] = a[o + 9];
        this[10] = a[o + 10];
        this[11] = a[o + 11];
        this[12] = a[o + 12];
        this[13] = a[o + 13];
        this[14] = a[o + 14];
        this[15] = a[o + 15];
        return this;
      }
      toArray(a = [], o = 0) {
        a[o] = this[0];
        a[o + 1] = this[1];
        a[o + 2] = this[2];
        a[o + 3] = this[3];
        a[o + 4] = this[4];
        a[o + 5] = this[5];
        a[o + 6] = this[6];
        a[o + 7] = this[7];
        a[o + 8] = this[8];
        a[o + 9] = this[9];
        a[o + 10] = this[10];
        a[o + 11] = this[11];
        a[o + 12] = this[12];
        a[o + 13] = this[13];
        a[o + 14] = this[14];
        a[o + 15] = this[15];
        return a;
      }
    };
  }
});

// node_modules/ogl/src/math/functions/EulerFunc.js
function fromRotationMatrix(out, m, order = "YXZ") {
  if (order === "XYZ") {
    out[1] = Math.asin(Math.min(Math.max(m[8], -1), 1));
    if (Math.abs(m[8]) < 0.99999) {
      out[0] = Math.atan2(-m[9], m[10]);
      out[2] = Math.atan2(-m[4], m[0]);
    } else {
      out[0] = Math.atan2(m[6], m[5]);
      out[2] = 0;
    }
  } else if (order === "YXZ") {
    out[0] = Math.asin(-Math.min(Math.max(m[9], -1), 1));
    if (Math.abs(m[9]) < 0.99999) {
      out[1] = Math.atan2(m[8], m[10]);
      out[2] = Math.atan2(m[1], m[5]);
    } else {
      out[1] = Math.atan2(-m[2], m[0]);
      out[2] = 0;
    }
  } else if (order === "ZXY") {
    out[0] = Math.asin(Math.min(Math.max(m[6], -1), 1));
    if (Math.abs(m[6]) < 0.99999) {
      out[1] = Math.atan2(-m[2], m[10]);
      out[2] = Math.atan2(-m[4], m[5]);
    } else {
      out[1] = 0;
      out[2] = Math.atan2(m[1], m[0]);
    }
  } else if (order === "ZYX") {
    out[1] = Math.asin(-Math.min(Math.max(m[2], -1), 1));
    if (Math.abs(m[2]) < 0.99999) {
      out[0] = Math.atan2(m[6], m[10]);
      out[2] = Math.atan2(m[1], m[0]);
    } else {
      out[0] = 0;
      out[2] = Math.atan2(-m[4], m[5]);
    }
  } else if (order === "YZX") {
    out[2] = Math.asin(Math.min(Math.max(m[1], -1), 1));
    if (Math.abs(m[1]) < 0.99999) {
      out[0] = Math.atan2(-m[9], m[5]);
      out[1] = Math.atan2(-m[2], m[0]);
    } else {
      out[0] = 0;
      out[1] = Math.atan2(m[8], m[10]);
    }
  } else if (order === "XZY") {
    out[2] = Math.asin(-Math.min(Math.max(m[4], -1), 1));
    if (Math.abs(m[4]) < 0.99999) {
      out[0] = Math.atan2(m[6], m[5]);
      out[1] = Math.atan2(m[8], m[0]);
    } else {
      out[0] = Math.atan2(-m[9], m[10]);
      out[1] = 0;
    }
  }
  return out;
}
var init_EulerFunc = __esm({
  "node_modules/ogl/src/math/functions/EulerFunc.js"() {
  }
});

// node_modules/ogl/src/math/Euler.js
var tmpMat4, Euler;
var init_Euler = __esm({
  "node_modules/ogl/src/math/Euler.js"() {
    init_EulerFunc();
    init_Mat4();
    tmpMat4 = /* @__PURE__ */ new Mat4();
    Euler = class extends Array {
      constructor(x = 0, y = x, z = x, order = "YXZ") {
        super(x, y, z);
        this.order = order;
        this.onChange = () => {
        };
        this._target = this;
        const triggerProps = ["0", "1", "2"];
        return new Proxy(this, {
          set(target, property) {
            const success = Reflect.set(...arguments);
            if (success && triggerProps.includes(property)) target.onChange();
            return success;
          }
        });
      }
      get x() {
        return this[0];
      }
      get y() {
        return this[1];
      }
      get z() {
        return this[2];
      }
      set x(v) {
        this._target[0] = v;
        this.onChange();
      }
      set y(v) {
        this._target[1] = v;
        this.onChange();
      }
      set z(v) {
        this._target[2] = v;
        this.onChange();
      }
      set(x, y = x, z = x) {
        if (x.length) return this.copy(x);
        this._target[0] = x;
        this._target[1] = y;
        this._target[2] = z;
        this.onChange();
        return this;
      }
      copy(v) {
        this._target[0] = v[0];
        this._target[1] = v[1];
        this._target[2] = v[2];
        this.onChange();
        return this;
      }
      reorder(order) {
        this._target.order = order;
        this.onChange();
        return this;
      }
      fromRotationMatrix(m, order = this.order) {
        fromRotationMatrix(this._target, m, order);
        this.onChange();
        return this;
      }
      fromQuaternion(q, order = this.order, isInternal) {
        tmpMat4.fromQuaternion(q);
        this._target.fromRotationMatrix(tmpMat4, order);
        if (!isInternal) this.onChange();
        return this;
      }
      fromArray(a, o = 0) {
        this._target[0] = a[o];
        this._target[1] = a[o + 1];
        this._target[2] = a[o + 2];
        return this;
      }
      toArray(a = [], o = 0) {
        a[o] = this[0];
        a[o + 1] = this[1];
        a[o + 2] = this[2];
        return a;
      }
    };
  }
});

// node_modules/ogl/src/core/Transform.js
var Transform;
var init_Transform = __esm({
  "node_modules/ogl/src/core/Transform.js"() {
    init_Vec3();
    init_Quat();
    init_Mat4();
    init_Euler();
    Transform = class {
      constructor() {
        this.parent = null;
        this.children = [];
        this.visible = true;
        this.matrix = new Mat4();
        this.worldMatrix = new Mat4();
        this.matrixAutoUpdate = true;
        this.worldMatrixNeedsUpdate = false;
        this.position = new Vec3();
        this.quaternion = new Quat();
        this.scale = new Vec3(1);
        this.rotation = new Euler();
        this.up = new Vec3(0, 1, 0);
        this.rotation._target.onChange = () => this.quaternion.fromEuler(this.rotation, true);
        this.quaternion._target.onChange = () => this.rotation.fromQuaternion(this.quaternion, void 0, true);
      }
      setParent(parent, notifyParent = true) {
        if (this.parent && parent !== this.parent) this.parent.removeChild(this, false);
        this.parent = parent;
        if (notifyParent && parent) parent.addChild(this, false);
      }
      addChild(child, notifyChild = true) {
        if (!~this.children.indexOf(child)) this.children.push(child);
        if (notifyChild) child.setParent(this, false);
      }
      removeChild(child, notifyChild = true) {
        if (!!~this.children.indexOf(child)) this.children.splice(this.children.indexOf(child), 1);
        if (notifyChild) child.setParent(null, false);
      }
      updateMatrixWorld(force) {
        if (this.matrixAutoUpdate) this.updateMatrix();
        if (this.worldMatrixNeedsUpdate || force) {
          if (this.parent === null) this.worldMatrix.copy(this.matrix);
          else this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
          this.worldMatrixNeedsUpdate = false;
          force = true;
        }
        for (let i = 0, l = this.children.length; i < l; i++) {
          this.children[i].updateMatrixWorld(force);
        }
      }
      updateMatrix() {
        this.matrix.compose(this.quaternion, this.position, this.scale);
        this.worldMatrixNeedsUpdate = true;
      }
      traverse(callback) {
        if (callback(this)) return;
        for (let i = 0, l = this.children.length; i < l; i++) {
          this.children[i].traverse(callback);
        }
      }
      decompose() {
        this.matrix.decompose(this.quaternion._target, this.position, this.scale);
        this.rotation.fromQuaternion(this.quaternion);
      }
      lookAt(target, invert4 = false) {
        if (invert4) this.matrix.lookAt(this.position, target, this.up);
        else this.matrix.lookAt(target, this.position, this.up);
        this.matrix.getRotation(this.quaternion._target);
        this.rotation.fromQuaternion(this.quaternion);
      }
    };
  }
});

// node_modules/ogl/src/math/functions/Mat3Func.js
function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}
function fromQuat2(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}
function copy5(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
function set5(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
function identity3(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
function invert3(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];
  let b01 = a22 * a11 - a12 * a21;
  let b11 = -a22 * a10 + a12 * a20;
  let b21 = a21 * a10 - a11 * a20;
  let det = a00 * b01 + a01 * b11 + a02 * b21;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
function multiply4(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];
  let b00 = b[0], b01 = b[1], b02 = b[2];
  let b10 = b[3], b11 = b[4], b12 = b[5];
  let b20 = b[6], b21 = b[7], b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
function translate2(out, a, v) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
function rotate2(out, a, rad) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
function scale4(out, a, v) {
  let x = v[0], y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
function normalFromMat4(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}
var init_Mat3Func = __esm({
  "node_modules/ogl/src/math/functions/Mat3Func.js"() {
  }
});

// node_modules/ogl/src/math/Mat3.js
var Mat3;
var init_Mat3 = __esm({
  "node_modules/ogl/src/math/Mat3.js"() {
    init_Mat3Func();
    Mat3 = class extends Array {
      constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
        super(m00, m01, m02, m10, m11, m12, m20, m21, m22);
        return this;
      }
      set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        if (m00.length) return this.copy(m00);
        set5(this, m00, m01, m02, m10, m11, m12, m20, m21, m22);
        return this;
      }
      translate(v, m = this) {
        translate2(this, m, v);
        return this;
      }
      rotate(v, m = this) {
        rotate2(this, m, v);
        return this;
      }
      scale(v, m = this) {
        scale4(this, m, v);
        return this;
      }
      multiply(ma, mb) {
        if (mb) {
          multiply4(this, ma, mb);
        } else {
          multiply4(this, this, ma);
        }
        return this;
      }
      identity() {
        identity3(this);
        return this;
      }
      copy(m) {
        copy5(this, m);
        return this;
      }
      fromMatrix4(m) {
        fromMat4(this, m);
        return this;
      }
      fromQuaternion(q) {
        fromQuat2(this, q);
        return this;
      }
      fromBasis(vec3a, vec3b, vec3c) {
        this.set(vec3a[0], vec3a[1], vec3a[2], vec3b[0], vec3b[1], vec3b[2], vec3c[0], vec3c[1], vec3c[2]);
        return this;
      }
      inverse(m = this) {
        invert3(this, m);
        return this;
      }
      getNormalMatrix(m) {
        normalFromMat4(this, m);
        return this;
      }
    };
  }
});

// node_modules/ogl/src/core/Mesh.js
var ID4, Mesh;
var init_Mesh = __esm({
  "node_modules/ogl/src/core/Mesh.js"() {
    init_Transform();
    init_Mat3();
    init_Mat4();
    ID4 = 0;
    Mesh = class extends Transform {
      constructor(gl, { geometry, program, mode = gl.TRIANGLES, frustumCulled = true, renderOrder = 0 } = {}) {
        super();
        if (!gl.canvas) console.error("gl not passed as first argument to Mesh");
        this.gl = gl;
        this.id = ID4++;
        this.geometry = geometry;
        this.program = program;
        this.mode = mode;
        this.frustumCulled = frustumCulled;
        this.renderOrder = renderOrder;
        this.modelViewMatrix = new Mat4();
        this.normalMatrix = new Mat3();
        this.beforeRenderCallbacks = [];
        this.afterRenderCallbacks = [];
      }
      onBeforeRender(f) {
        this.beforeRenderCallbacks.push(f);
        return this;
      }
      onAfterRender(f) {
        this.afterRenderCallbacks.push(f);
        return this;
      }
      draw({ camera } = {}) {
        if (camera) {
          if (!this.program.uniforms.modelMatrix) {
            Object.assign(this.program.uniforms, {
              modelMatrix: { value: null },
              viewMatrix: { value: null },
              modelViewMatrix: { value: null },
              normalMatrix: { value: null },
              projectionMatrix: { value: null },
              cameraPosition: { value: null }
            });
          }
          this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
          this.program.uniforms.cameraPosition.value = camera.worldPosition;
          this.program.uniforms.viewMatrix.value = camera.viewMatrix;
          this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
          this.normalMatrix.getNormalMatrix(this.modelViewMatrix);
          this.program.uniforms.modelMatrix.value = this.worldMatrix;
          this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
          this.program.uniforms.normalMatrix.value = this.normalMatrix;
        }
        this.beforeRenderCallbacks.forEach((f) => f && f({ mesh: this, camera }));
        let flipFaces = this.program.cullFace && this.worldMatrix.determinant() < 0;
        this.program.use({ flipFaces });
        this.geometry.draw({ mode: this.mode, program: this.program });
        this.afterRenderCallbacks.forEach((f) => f && f({ mesh: this, camera }));
      }
    };
  }
});

// node_modules/ogl/src/core/Texture.js
function isPowerOf2(value) {
  return (value & value - 1) === 0;
}
var emptyPixel, ID5, Texture;
var init_Texture = __esm({
  "node_modules/ogl/src/core/Texture.js"() {
    emptyPixel = new Uint8Array(4);
    ID5 = 1;
    Texture = class {
      constructor(gl, {
        image,
        target = gl.TEXTURE_2D,
        type = gl.UNSIGNED_BYTE,
        format = gl.RGBA,
        internalFormat = format,
        wrapS = gl.CLAMP_TO_EDGE,
        wrapT = gl.CLAMP_TO_EDGE,
        wrapR = gl.CLAMP_TO_EDGE,
        generateMipmaps = target === (gl.TEXTURE_2D || gl.TEXTURE_CUBE_MAP),
        minFilter = generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR,
        magFilter = gl.LINEAR,
        premultiplyAlpha = false,
        unpackAlignment = 4,
        flipY = target == (gl.TEXTURE_2D || gl.TEXTURE_3D) ? true : false,
        anisotropy = 0,
        level = 0,
        width,
        // used for RenderTargets or Data Textures
        height = width,
        length: length3 = 1
      } = {}) {
        this.gl = gl;
        this.id = ID5++;
        this.image = image;
        this.target = target;
        this.type = type;
        this.format = format;
        this.internalFormat = internalFormat;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.wrapR = wrapR;
        this.generateMipmaps = generateMipmaps;
        this.premultiplyAlpha = premultiplyAlpha;
        this.unpackAlignment = unpackAlignment;
        this.flipY = flipY;
        this.anisotropy = Math.min(anisotropy, this.gl.renderer.parameters.maxAnisotropy);
        this.level = level;
        this.width = width;
        this.height = height;
        this.length = length3;
        this.texture = this.gl.createTexture();
        this.store = {
          image: null
        };
        this.glState = this.gl.renderer.state;
        this.state = {};
        this.state.minFilter = this.gl.NEAREST_MIPMAP_LINEAR;
        this.state.magFilter = this.gl.LINEAR;
        this.state.wrapS = this.gl.REPEAT;
        this.state.wrapT = this.gl.REPEAT;
        this.state.anisotropy = 0;
      }
      bind() {
        if (this.glState.textureUnits[this.glState.activeTextureUnit] === this.id) return;
        this.gl.bindTexture(this.target, this.texture);
        this.glState.textureUnits[this.glState.activeTextureUnit] = this.id;
      }
      update(textureUnit = 0) {
        const needsUpdate = !(this.image === this.store.image && !this.needsUpdate);
        if (needsUpdate || this.glState.textureUnits[textureUnit] !== this.id) {
          this.gl.renderer.activeTexture(textureUnit);
          this.bind();
        }
        if (!needsUpdate) return;
        this.needsUpdate = false;
        if (this.flipY !== this.glState.flipY) {
          this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
          this.glState.flipY = this.flipY;
        }
        if (this.premultiplyAlpha !== this.glState.premultiplyAlpha) {
          this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
          this.glState.premultiplyAlpha = this.premultiplyAlpha;
        }
        if (this.unpackAlignment !== this.glState.unpackAlignment) {
          this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, this.unpackAlignment);
          this.glState.unpackAlignment = this.unpackAlignment;
        }
        if (this.minFilter !== this.state.minFilter) {
          this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
          this.state.minFilter = this.minFilter;
        }
        if (this.magFilter !== this.state.magFilter) {
          this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
          this.state.magFilter = this.magFilter;
        }
        if (this.wrapS !== this.state.wrapS) {
          this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.wrapS);
          this.state.wrapS = this.wrapS;
        }
        if (this.wrapT !== this.state.wrapT) {
          this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.wrapT);
          this.state.wrapT = this.wrapT;
        }
        if (this.wrapR !== this.state.wrapR) {
          this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_R, this.wrapR);
          this.state.wrapR = this.wrapR;
        }
        if (this.anisotropy && this.anisotropy !== this.state.anisotropy) {
          this.gl.texParameterf(this.target, this.gl.renderer.getExtension("EXT_texture_filter_anisotropic").TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropy);
          this.state.anisotropy = this.anisotropy;
        }
        if (this.image) {
          if (this.image.width) {
            this.width = this.image.width;
            this.height = this.image.height;
          }
          if (this.target === this.gl.TEXTURE_CUBE_MAP) {
            for (let i = 0; i < 6; i++) {
              this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.level, this.internalFormat, this.format, this.type, this.image[i]);
            }
          } else if (ArrayBuffer.isView(this.image)) {
            if (this.target === this.gl.TEXTURE_2D) {
              this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.image);
            } else if (this.target === this.gl.TEXTURE_2D_ARRAY || this.target === this.gl.TEXTURE_3D) {
              this.gl.texImage3D(this.target, this.level, this.internalFormat, this.width, this.height, this.length, 0, this.format, this.type, this.image);
            }
          } else if (this.image.isCompressedTexture) {
            for (let level = 0; level < this.image.length; level++) {
              this.gl.compressedTexImage2D(this.target, level, this.internalFormat, this.image[level].width, this.image[level].height, 0, this.image[level].data);
            }
          } else {
            if (this.target === this.gl.TEXTURE_2D) {
              this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
            } else {
              this.gl.texImage3D(this.target, this.level, this.internalFormat, this.width, this.height, this.length, 0, this.format, this.type, this.image);
            }
          }
          if (this.generateMipmaps) {
            if (!this.gl.renderer.isWebgl2 && (!isPowerOf2(this.image.width) || !isPowerOf2(this.image.height))) {
              this.generateMipmaps = false;
              this.wrapS = this.wrapT = this.gl.CLAMP_TO_EDGE;
              this.minFilter = this.gl.LINEAR;
            } else {
              this.gl.generateMipmap(this.target);
            }
          }
          this.onUpdate && this.onUpdate();
        } else {
          if (this.target === this.gl.TEXTURE_CUBE_MAP) {
            for (let i = 0; i < 6; i++) {
              this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
            }
          } else if (this.width) {
            if (this.target === this.gl.TEXTURE_2D) {
              this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
            } else {
              this.gl.texImage3D(this.target, this.level, this.internalFormat, this.width, this.height, this.length, 0, this.format, this.type, null);
            }
          } else {
            this.gl.texImage2D(this.target, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
          }
        }
        this.store.image = this.image;
      }
    };
  }
});

// node_modules/ogl/src/index.js
var init_src = __esm({
  "node_modules/ogl/src/index.js"() {
    init_Geometry();
    init_Program();
    init_Renderer();
    init_Mesh();
    init_Texture();
  }
});

// src/elastic-mesh.js
var elastic_mesh_exports = {};
__export(elastic_mesh_exports, {
  createElasticMesh: () => createElasticMesh
});
async function createElasticMesh(container, image, config = {}) {
  if (!container || !image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {
  };
  if (!container.isConnected) return () => {
  };
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
    ...config
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
    index: { data: index }
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
      uTilt: { value: options.tilt * Math.PI / 180 },
      uDist: { value: DIST },
      uFit: { value: FIT },
      uUvScale: { value: [1, 1] },
      uUvOffset: { value: [0, 0] }
    }
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
      const positionX = positionValue(positionParts[0], 0.5);
      const positionY = positionValue(positionParts[1], 0.5);
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
        (containerRect.top - renderedTop) / renderedHeight
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
    const clipX = (clientX - rect.left) / Math.max(rect.width, 1) * 2 - 1;
    const clipY = 1 - (clientY - rect.top) / Math.max(rect.height, 1) * 2;
    const tilt = options.tilt * Math.PI / 180;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    const a = clipY / (ct * FIT * DIST);
    const py = a * DIST / (1 + a * st);
    const perspective2 = DIST / (DIST - py * st);
    pointer.tx = clipX * aspect / (perspective2 * FIT);
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
    const force = options.pull * 9e-3;
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
          const distance2 = Math.sqrt(dx * dx + dy * dy);
          const normalized = distance2 * inverseRadius;
          if (normalized < 1) {
            const bump = 1 - normalized * normalized;
            az += force * bump * bump * 6;
            if (distance2 > 1e-4) {
              const pinch = normalized * (1 - normalized) * (1 - normalized) * 6.75;
              const direction = force * pinch * 1.6 / distance2;
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
        if (nz < 0) {
          nx = -nx;
          ny = -ny;
          nz = -nz;
        }
        const length3 = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        aNormal[offset] = nx / length3;
        aNormal[offset + 1] = ny / length3;
        aNormal[offset + 2] = nz / length3;
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
    let delta = Math.min(0.25, (now - last) / 1e3);
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
var DIST, FIT, VERT, FRAG;
var init_elastic_mesh = __esm({
  "src/elastic-mesh.js"() {
    init_src();
    DIST = 4.6;
    FIT = 1;
    VERT = `
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
    FRAG = `
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
  }
});

// src/audio-meter.ps1
var require_audio_meter = __commonJS({
  "src/audio-meter.ps1"(exports2, module2) {
    module2.exports = `Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public enum EDataFlow { eRender = 0, eCapture = 1, eAll = 2 }
public enum ERole { eConsole = 0, eMultimedia = 1, eCommunications = 2 }

[ComImport, Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDeviceEnumerator {
    int EnumAudioEndpoints(EDataFlow dataFlow, int stateMask, out object devices);
    int GetDefaultAudioEndpoint(EDataFlow dataFlow, ERole role, out IMMDevice endpoint);
    int GetDevice(string id, out IMMDevice device);
    int RegisterEndpointNotificationCallback(IntPtr client);
    int UnregisterEndpointNotificationCallback(IntPtr client);
}

[ComImport, Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDevice {
    int Activate(ref Guid iid, int clsCtx, IntPtr activationParams, [MarshalAs(UnmanagedType.IUnknown)] out object instance);
    int OpenPropertyStore(int access, out IntPtr properties);
    int GetId([MarshalAs(UnmanagedType.LPWStr)] out string id);
    int GetState(out int state);
}

[ComImport, Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IAudioMeterInformation {
    int GetPeakValue(out float peak);
    int GetMeteringChannelCount(out int channelCount);
    int GetChannelsPeakValues(int channelCount, [Out, MarshalAs(UnmanagedType.LPArray, SizeParamIndex = 0)] float[] peakValues);
    int QueryHardwareSupport(out int hardwareSupportMask);
}

public static class AlexDeskAudioMeter {
    static IAudioMeterInformation meter;

    static void Connect() {
        var type = Type.GetTypeFromCLSID(new Guid("BCDE0395-E52F-467C-8E3D-C4579291692E"));
        var enumerator = (IMMDeviceEnumerator)Activator.CreateInstance(type);
        IMMDevice device;
        Marshal.ThrowExceptionForHR(enumerator.GetDefaultAudioEndpoint(EDataFlow.eRender, ERole.eMultimedia, out device));
        var iid = new Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064");
        object instance;
        Marshal.ThrowExceptionForHR(device.Activate(ref iid, 23, IntPtr.Zero, out instance));
        meter = (IAudioMeterInformation)instance;
    }

    public static float Read() {
        if (meter == null) Connect();
        float peak;
        var result = meter.GetPeakValue(out peak);
        if (result != 0) {
            meter = null;
            Connect();
            Marshal.ThrowExceptionForHR(meter.GetPeakValue(out peak));
        }
        return Math.Max(0f, Math.Min(1f, peak));
    }
}
'@

$culture = [System.Globalization.CultureInfo]::InvariantCulture
while ($true) {
    try {
        $peak = [AlexDeskAudioMeter]::Read()
        [Console]::Out.WriteLine($peak.ToString("F5", $culture))
        [Console]::Out.Flush()
    } catch {
        [Console]::Error.WriteLine($_.Exception.Message)
        [Console]::Error.Flush()
    }
    Start-Sleep -Milliseconds 45
}
`;
  }
});

// src/main.js
var {
  Plugin,
  ItemView,
  PluginSettingTab,
  Setting,
  Notice,
  TFile,
  normalizePath,
  setIcon,
  MarkdownRenderer
} = require("obsidian");
var { spawn } = require("child_process");
var { createElasticMesh: createElasticMesh2 } = (init_elastic_mesh(), __toCommonJS(elastic_mesh_exports));
var audioMeterModule = require_audio_meter();
var AUDIO_METER_SCRIPT = audioMeterModule.default || audioMeterModule;
var VIEW_TYPE = "alex-desk-view";
var DEFAULT_SETTINGS = {
  autoOpen: true,
  displayName: "\u670B\u53CB",
  motto: "\u4ECA\u5929\u4E5F\u628A\u559C\u6B22\u7684\u4E8B\uFF0C\u8BA4\u771F\u505A\u4E00\u70B9\u3002",
  avatarPath: "",
  avatarPositionY: 50,
  heroCaption: "\u628A\u559C\u6B22\u7684\u753B\u9762\uFF0C\u7559\u5728\u6BCF\u5929\u5F00\u59CB\u7684\u5730\u65B9\u3002",
  heroImages: "",
  carouselEnabled: true,
  carouselSeconds: 8,
  heroAutoPan: true,
  heroImagePositions: {},
  systemSpectrumEnabled: false,
  systemSpectrumColor: "",
  systemSpectrumStyle: "soft-bars",
  systemSpectrumThreshold: 12,
  colorMode: "auto",
  palette: "reading",
  insightsTitle: "\u77E5\u8BC6\u6982\u89C8",
  insightMetrics: "notes,characters,monthUpdates,activeDays",
  todayTitle: "\u5F53\u4E0B",
  heatmapTitle: "\u6587\u5B57\u70ED\u529B\u56FE",
  heatmapWeeks: 26,
  rediscoverySoundEnabled: true,
  rediscoverySoundVolume: 0.22,
  birthDate: "",
  lifeProgressTitle: "\u4EBA\u751F\u8FDB\u5EA6",
  lifeProgressMark: "\u4EBA",
  lifeProgressMarkColor: "",
  lifeProgressMarkFont: "PingFang SC",
  dailyFolder: "\u4ECA\u65E5\u968F\u7B14",
  clippingsFolder: "Clippings",
  taskFolders: "",
  recentLimit: 4
};
var PALETTES = /* @__PURE__ */ new Set(["reading", "monochrome", "pink", "ocean"]);
function el(parent, tag, cls = "", text = "") {
  return parent.createEl(tag, { cls, text });
}
function gummyArrow(parent) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M8.3 6.7C9.95 8.3 11.8 10.05 13.55 11.55C13.9 11.85 13.9 12.35 13.55 12.65C11.8 14.15 9.95 15.9 8.3 17.5");
  svg.appendChild(path);
  parent.appendChild(svg);
}
function plainText(source) {
  return String(source || "").replace(/^---[\s\S]*?---/m, "").replace(/```[\s\S]*?```/g, "").replace(/!\[\[[^\]]+\]\]/g, "").replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias || target).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/<[^>]+>/g, "").replace(/[#>*_`~=-]/g, "").replace(/\s+/g, " ").trim();
}
function withoutMarkdownImages(source) {
  return String(source || "").replace(/!\[\[[^\]]+\]\]/g, "").replace(/!\[[^\]]*\]\([^)]+\)/g, "").replace(/<img\b[^>]*>/gi, "").trim();
}
function clampRenderedText(container, limit = 32) {
  const nodes = [];
  const walker = document.createTreeWalker(container, 4);
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const fullText = Array.from(String(container.textContent || "").replace(/\s+/g, " ").trim());
  if (fullText.length <= limit) return;
  let remaining = limit;
  let lastKept = null;
  let previousWasSpace = false;
  nodes.forEach((node) => {
    if (remaining <= 0) {
      node.nodeValue = "";
      return;
    }
    let nextValue = "";
    for (const character of Array.from(node.nodeValue || "")) {
      const isSpace = /\s/.test(character);
      if (isSpace && (previousWasSpace || !nextValue && !lastKept)) continue;
      const normalized = isSpace ? " " : character;
      if (remaining <= 0) break;
      nextValue += normalized;
      remaining -= 1;
      previousWasSpace = isSpace;
    }
    node.nodeValue = nextValue;
    if (nextValue.trim()) lastKept = node;
  });
  if (lastKept) lastKept.nodeValue = `${lastKept.nodeValue.replace(/[.…\s]+$/u, "")}\u2026`;
}
function excerpt(source, limit = 180) {
  const text = plainText(source);
  return text.length > limit ? `${text.slice(0, limit).trim()}\u2026` : text;
}
function countCharacters(source) {
  return plainText(source).replace(/\s/g, "").length;
}
function compactNumber(value) {
  if (value >= 1e5) return `${(value / 1e4).toFixed(1)}\u4E07`;
  if (value >= 1e4) return `${(value / 1e4).toFixed(1)}\u4E07`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}k`;
  return String(value);
}
function greeting(hour) {
  if (hour < 6) return "\u591C\u6DF1\u4E86";
  if (hour < 11) return "\u65E9\u4E0A\u597D";
  if (hour < 14) return "\u4E2D\u5348\u597D";
  if (hour < 18) return "\u4E0B\u5348\u597D";
  return "\u665A\u4E0A\u597D";
}
function heatLevel(count) {
  if (!count) return 0;
  if (count < 200) return 1;
  if (count < 600) return 2;
  if (count < 1200) return 3;
  return 4;
}
var AlexDeskView = class extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.renderId = 0;
    this.heroIndex = 0;
    this.carouselTimer = 0;
    this.insightDetailKey = "";
    this.rediscoveryIndex = 0;
    this.optionWheelFrame = 0;
    this.optionWheelTimer = 0;
    this.wheelLastTick = 0;
    this.wheelAudioContext = null;
    this.lifeWheelFrame = 0;
    this.lifeWheelTimer = 0;
    this.calendarLayer = null;
    this.calendarOutsideHandler = null;
    this.spectrumFrame = 0;
    this.spectrumLastSoundAt = 0;
    this.heroMeshCleanup = null;
    this.heroMeshToken = 0;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "\u6BCF\u65E5\u4E13\u6CE8\u4E3B\u9875";
  }
  getIcon() {
    return "sparkles";
  }
  async onOpen() {
    this.plugin.views.add(this);
    this.contentEl.addClass("alex-desk-root");
    await this.render();
  }
  async onClose() {
    this.plugin.views.delete(this);
    window.clearInterval(this.carouselTimer);
    window.cancelAnimationFrame(this.optionWheelFrame);
    window.clearTimeout(this.optionWheelTimer);
    window.cancelAnimationFrame(this.lifeWheelFrame);
    window.cancelAnimationFrame(this.spectrumFrame);
    window.clearTimeout(this.lifeWheelTimer);
    if (this.calendarOutsideHandler) document.removeEventListener("pointerdown", this.calendarOutsideHandler, true);
    this.calendarOutsideHandler = null;
    this.calendarLayer?.remove();
    this.calendarLayer = null;
    this.heroMeshToken += 1;
    this.heroMeshCleanup?.();
    this.heroMeshCleanup = null;
    this.wheelAudioContext?.close?.().catch(() => {
    });
    this.wheelAudioContext = null;
  }
  effectiveMode() {
    if (this.plugin.settings.colorMode === "day") return "day";
    if (this.plugin.settings.colorMode === "night") return "night";
    return document.body.classList.contains("theme-dark") ? "night" : "day";
  }
  applyAppearance() {
    this.contentEl.classList.remove("is-day", "is-night", "palette-reading", "palette-monochrome", "palette-pink", "palette-ocean");
    this.contentEl.classList.add(`is-${this.effectiveMode()}`);
    const palette = PALETTES.has(this.plugin.settings.palette) ? this.plugin.settings.palette : "reading";
    this.contentEl.classList.add(`palette-${palette}`);
  }
  async render() {
    const id = ++this.renderId;
    window.clearInterval(this.carouselTimer);
    window.cancelAnimationFrame(this.optionWheelFrame);
    window.clearTimeout(this.optionWheelTimer);
    window.cancelAnimationFrame(this.lifeWheelFrame);
    window.cancelAnimationFrame(this.spectrumFrame);
    window.clearTimeout(this.lifeWheelTimer);
    if (this.calendarOutsideHandler) document.removeEventListener("pointerdown", this.calendarOutsideHandler, true);
    this.calendarOutsideHandler = null;
    this.calendarLayer?.remove();
    this.calendarLayer = null;
    this.heroMeshToken += 1;
    this.heroMeshCleanup?.();
    this.heroMeshCleanup = null;
    this.optionWheelFrame = 0;
    this.lifeWheelFrame = 0;
    this.spectrumFrame = 0;
    this.spectrumLastSoundAt = performance.now();
    this.applyAppearance();
    const root = this.contentEl;
    root.empty();
    el(root, "div", "ad-loading", "\u6B63\u5728\u6574\u7406\u4ECA\u5929\u7684\u684C\u9762\u2026");
    try {
      const data = await this.plugin.collectData();
      if (id !== this.renderId) return;
      root.empty();
      this.renderPage(root, data);
    } catch (error) {
      console.error("[\u6BCF\u65E5\u4E13\u6CE8\u4E3B\u9875]", error);
      root.empty();
      const card = el(root, "div", "ad-error");
      el(card, "strong", "", "\u684C\u9762\u6682\u65F6\u6CA1\u6709\u51C6\u5907\u597D");
      el(card, "p", "", error.message || String(error));
      const retry = el(card, "button", "ad-solid-button", "\u518D\u8BD5\u4E00\u6B21");
      retry.addEventListener("click", () => this.render());
    }
  }
  renderPage(root, data) {
    const page = el(root, "div", "ad-page");
    this.renderGreeting(page, data);
    this.renderHero(page, data);
    this.renderInsights(page, data);
    const dashboard = el(page, "div", "ad-dashboard");
    this.renderToday(dashboard, data);
    this.renderHeatmap(dashboard, data);
    const footer = el(page, "footer", "ad-footer");
    el(footer, "span", "", "\u6240\u6709\u5185\u5BB9\u5747\u4FDD\u5B58\u5728\u672C\u5730");
    el(footer, "span", "", `${data.totalNotes} \u7BC7\u7B14\u8BB0`);
  }
  renderGreeting(parent, data) {
    const section = el(parent, "header", "ad-greeting");
    const identity4 = el(section, "div", "ad-identity");
    const avatar = el(identity4, "div", "ad-avatar");
    if (data.avatarUrl) {
      const image = el(avatar, "img");
      image.src = data.avatarUrl;
      image.alt = `${this.plugin.settings.displayName} \u7684\u5934\u50CF`;
      const avatarPosition = Number(this.plugin.settings.avatarPositionY);
      image.style.objectPosition = `50% ${Number.isFinite(avatarPosition) ? Math.min(100, Math.max(0, avatarPosition)) : 50}%`;
    } else {
      avatar.appendText((this.plugin.settings.displayName || "A").slice(0, 1).toUpperCase());
    }
    const copy6 = el(identity4, "div", "ad-greeting-copy");
    const line = el(copy6, "span", "ad-decor-line");
    el(line, "i");
    const title = el(copy6, "h1");
    title.appendText(`${data.greeting}\uFF0C`);
    el(title, "em", "", this.plugin.settings.displayName || "\u670B\u53CB");
    el(copy6, "p", "ad-date", `${data.dateLabel} \xB7 ${data.weekday}`);
    el(copy6, "p", "ad-motto", this.plugin.settings.motto);
    const tools = el(section, "div", "ad-greeting-tools");
    const paletteNames = {
      reading: ["book-open", "\u9605\u8BFB\u6696\u7EB8"],
      monochrome: ["circle", "\u9ED1\u767D\u6781\u7B80"],
      pink: ["heart", "\u67D4\u548C\u7C89\u7EA2"],
      ocean: ["waves", "\u9759\u8C27\u6D77\u84DD"]
    };
    const activePalette = PALETTES.has(this.plugin.settings.palette) ? this.plugin.settings.palette : "reading";
    const palette = el(tools, "button", `ad-tool-button ad-palette-button palette-${activePalette}`);
    setIcon(palette, paletteNames[activePalette][0]);
    palette.setAttribute("aria-label", `\u5F53\u524D\u4E3B\u9898\uFF1A${paletteNames[activePalette][1]}\uFF0C\u70B9\u51FB\u5207\u6362`);
    palette.addEventListener("click", () => this.cyclePalette());
    const mode = el(tools, "button", "ad-tool-button");
    setIcon(mode, this.effectiveMode() === "night" ? "sun" : "moon");
    mode.setAttribute("aria-label", this.effectiveMode() === "night" ? "\u5207\u6362\u5230\u767D\u5929\u6A21\u5F0F" : "\u5207\u6362\u5230\u9ED1\u591C\u6A21\u5F0F");
    mode.addEventListener("click", () => this.toggleMode());
  }
  async toggleMode() {
    this.plugin.settings.colorMode = this.effectiveMode() === "night" ? "day" : "night";
    await this.plugin.saveSettings();
    this.render();
  }
  async cyclePalette() {
    const palettes = ["reading", "monochrome", "pink", "ocean"];
    const current = palettes.indexOf(this.plugin.settings.palette);
    this.plugin.settings.palette = palettes[(current + 1 + palettes.length) % palettes.length];
    await this.plugin.saveSettings();
    this.render();
  }
  renderHero(parent, data) {
    const hero = el(parent, "section", "ad-hero");
    hero.toggleClass("is-auto-pan", this.plugin.settings.heroAutoPan !== false);
    this.heroImages = data.heroImages;
    this.heroSlides = [];
    if (data.heroImages.length) {
      this.heroIndex = (this.heroIndex % data.heroImages.length + data.heroImages.length) % data.heroImages.length;
      this.heroTrack = el(hero, "div", "ad-hero-track");
      data.heroImages.forEach((item, index) => {
        const slide = el(this.heroTrack, "button", "ad-hero-slide");
        slide.setAttribute("aria-label", item.noteFile ? `\u6253\u5F00\u56FE\u7247\u6240\u5728\u7B14\u8BB0\uFF1A${item.noteFile.basename}` : item.name);
        const image = el(slide, "img", "ad-hero-image");
        image.src = item.url;
        image.alt = item.name;
        image.draggable = false;
        this.heroSlides.push({ slide, imageUrl: item.url, imageElement: image });
        const savedPosition = Number(this.plugin.settings.heroImagePositions?.[item.path]);
        if (Number.isFinite(savedPosition)) {
          image.style.setProperty("--ad-hero-pan", `${savedPosition}%`);
          slide.addClass("is-user-positioned");
        }
        this.bindHeroPan(slide, image, item);
        const panHint = el(slide, "span", "ad-pan-hint");
        const panIcon = el(panHint, "i");
        setIcon(panIcon, "grip-horizontal");
        el(panHint, "span", "", "\u4E0A\u4E0B\u62D6\u52A8\u53D6\u666F");
        const plate = el(slide, "span", "ad-image-plate");
        el(plate, "time", "", item.date);
        const source = el(plate, "span");
        setIcon(source, item.noteFile ? "file-text" : "image");
        const sourceName = el(source, "strong", "", item.noteFile?.basename || item.name);
        sourceName.setAttribute("title", item.noteFile?.basename || item.name);
        slide.addEventListener("click", (event) => {
          if (slide.dataset.wasDragged === "true") {
            event.preventDefault();
            return;
          }
          if (item.noteFile) this.plugin.openFile(item.noteFile);
          else new Notice("\u4ED3\u5E93\u4E2D\u6682\u672A\u627E\u5230\u5F15\u7528\u8FD9\u5F20\u56FE\u7247\u7684\u7B14\u8BB0\u3002");
        });
      });
      this.updateHeroTrack(false);
    } else {
      el(hero, "div", "ad-hero-fallback");
    }
    el(hero, "div", "ad-hero-shade");
    el(hero, "div", "ad-hero-blur");
    el(hero, "strong", "ad-hero-caption", this.plugin.settings.heroCaption);
    this.renderSystemSpectrum(hero);
    this.heroDots = [];
    const controls = el(hero, "div", "ad-carousel");
    if (data.heroImages.length > 1) {
      const previous = el(controls, "button", "ad-carousel-arrow");
      previous.addClass("is-previous");
      gummyArrow(previous);
      previous.setAttribute("aria-label", "\u4E0A\u4E00\u5F20\u5C01\u9762");
      previous.addEventListener("click", () => this.changeHero(-1));
      const dots = el(controls, "span", "ad-dots");
      data.heroImages.forEach((_, index) => {
        const dot4 = el(dots, "button");
        dot4.setAttribute("aria-label", `\u7B2C ${index + 1} \u5F20\u5C01\u9762`);
        dot4.addEventListener("click", () => {
          this.heroIndex = index;
          this.updateHeroTrack(true);
        });
        this.heroDots.push(dot4);
      });
      const next = el(controls, "button", "ad-carousel-arrow");
      next.addClass("is-next");
      gummyArrow(next);
      next.setAttribute("aria-label", "\u4E0B\u4E00\u5F20\u5C01\u9762");
      next.addEventListener("click", () => this.changeHero(1));
    } else {
      el(controls, "span", "ad-single-dot");
    }
    this.updateHeroDots();
    if (this.plugin.settings.carouselEnabled && data.heroImages.length > 1) {
      const seconds = Math.max(3, Math.min(60, Number(this.plugin.settings.carouselSeconds) || 8));
      this.carouselTimer = window.setInterval(() => this.changeHero(1), seconds * 1e3);
    }
  }
  renderSystemSpectrum(hero) {
    if (this.plugin.settings.systemSpectrumEnabled !== true) return;
    const spectrum = el(hero, "div", "ad-system-spectrum");
    spectrum.setAttribute("aria-hidden", "true");
    const availableStyles = /* @__PURE__ */ new Set(["soft-bars", "mirror", "dots", "blocks"]);
    const selectedStyle = availableStyles.has(this.plugin.settings.systemSpectrumStyle) ? this.plugin.settings.systemSpectrumStyle : "soft-bars";
    spectrum.addClass(`style-${selectedStyle}`);
    const customColor = String(this.plugin.settings.systemSpectrumColor || "").trim();
    if (customColor) spectrum.style.setProperty("--ad-spectrum-color", customColor);
    const bars = Array.from({ length: 54 }, () => el(spectrum, "i"));
    const draw = () => {
      if (!spectrum.isConnected || this.plugin.settings.systemSpectrumEnabled !== true) return;
      const levels = this.plugin.readSystemSpectrum(bars.length);
      const now = performance.now();
      if (this.plugin.isSystemAudioAudible(levels)) this.spectrumLastSoundAt = now;
      const shouldHide = now - this.spectrumLastSoundAt >= 1e4;
      spectrum.toggleClass("is-silent-hidden", shouldHide);
      if (!levels) {
        spectrum.removeClass("is-listening");
        spectrum.removeClass("is-active");
        if (!this.plugin.systemAudioUnavailable || !shouldHide) this.spectrumFrame = window.requestAnimationFrame(draw);
        return;
      }
      let active = false;
      bars.forEach((bar, index) => {
        const level = levels?.[index] || 0;
        if (level > 0.035) active = true;
        bar.style.setProperty("--ad-spectrum-level", String(Math.max(0.16, Math.min(1, level))));
        bar.style.setProperty("--ad-spectrum-dot-offset", `${((0.5 - level) * 15).toFixed(2)}px`);
        bar.style.setProperty("--ad-spectrum-dot-scale", String((0.72 + level * 0.38).toFixed(3)));
      });
      spectrum.addClass("is-listening");
      spectrum.toggleClass("is-active", active);
      this.spectrumFrame = window.requestAnimationFrame(draw);
    };
    this.plugin.startSystemAudioCapture(false).finally(() => {
      if (!this.spectrumFrame && spectrum.isConnected) draw();
    });
    draw();
  }
  bindHeroPan(slide, image, item) {
    let drag = null;
    const clamp = (value) => Math.max(-6, Math.min(6, value));
    const currentPosition = () => {
      const inline = parseFloat(image.style.getPropertyValue("--ad-hero-pan"));
      return Number.isFinite(inline) ? inline : 0;
    };
    const applyPosition = (value) => {
      const next = clamp(value);
      image.style.setProperty("--ad-hero-pan", `${next}%`);
      return next;
    };
    const finish = async (event) => {
      if (!drag) return;
      const completed = drag;
      drag = null;
      slide.removeClass("is-panning");
      if (slide.hasPointerCapture?.(event.pointerId)) slide.releasePointerCapture(event.pointerId);
      if (!completed.moved) return;
      slide.dataset.wasDragged = "true";
      window.setTimeout(() => {
        slide.dataset.wasDragged = "false";
      }, 0);
      slide.addClass("is-user-positioned");
      const positions = { ...this.plugin.settings.heroImagePositions || {} };
      positions[item.path] = Number(currentPosition().toFixed(2));
      this.plugin.settings.heroImagePositions = positions;
      await this.plugin.saveSettings();
    };
    slide.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      drag = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startPosition: currentPosition(),
        moved: false
      };
      slide.addClass("is-panning");
    });
    slide.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const delta = event.clientY - drag.startY;
      if (!drag.moved && Math.abs(delta) > 4) {
        drag.moved = true;
        slide.setPointerCapture?.(event.pointerId);
      }
      if (!drag.moved) return;
      event.preventDefault();
      applyPosition(drag.startPosition + delta / Math.max(slide.clientHeight, 1) * 18);
    });
    slide.addEventListener("pointerup", finish);
    slide.addEventListener("pointercancel", finish);
  }
  changeHero(direction) {
    if (!this.heroImages?.length) return;
    this.heroIndex = (this.heroIndex + direction + this.heroImages.length) % this.heroImages.length;
    this.updateHeroTrack(true);
  }
  updateHeroTrack(animate = true) {
    if (!this.heroTrack || !this.heroImages?.length) return;
    this.heroTrack.toggleClass("is-animated", animate);
    this.heroTrack.style.transform = `translate3d(-${this.heroIndex * 100}%, 0, 0)`;
    this.updateHeroDots();
    this.activateHeroMesh();
  }
  updateHeroDots() {
    this.heroDots?.forEach((dot4, index) => dot4.toggleClass("is-active", index === this.heroIndex));
  }
  activateHeroMesh() {
    const token = ++this.heroMeshToken;
    this.heroMeshCleanup?.();
    this.heroMeshCleanup = null;
    const current = this.heroSlides?.[this.heroIndex];
    const meshFactory = this.plugin.createElasticMesh;
    if (!current?.slide?.isConnected || !current.imageUrl || typeof meshFactory !== "function") return;
    meshFactory(current.slide, current.imageUrl, {
      interaction: "hover",
      tilt: 0,
      shading: 0.78,
      resolution: 25,
      stiffness: 0.05,
      damping: 0.2,
      grabRadius: 0.6,
      pull: 0.4,
      wobble: 5,
      borderRadius: 30,
      sourceElement: current.imageElement
    }).then((cleanup) => {
      if (token !== this.heroMeshToken || !current.slide.isConnected) {
        cleanup?.();
        return;
      }
      this.heroMeshCleanup = cleanup;
    }).catch((error) => console.warn("[\u6BCF\u65E5\u4E13\u6CE8\u4E3B\u9875] \u5F39\u6027\u6A2A\u5E45\u4E0D\u53EF\u7528", error));
  }
  renderInsights(parent, data) {
    const section = el(parent, "section", "ad-insights");
    const head = el(section, "header", "ad-section-title");
    el(head, "span", "ad-decor-line").createEl("i");
    el(head, "h2", "", this.plugin.settings.insightsTitle || "\u77E5\u8BC6\u6982\u89C8");
    const grid = el(section, "div", "ad-insight-grid");
    const selected = String(this.plugin.settings.insightMetrics || "").split(",").map((item) => item.trim()).filter((item) => data.insightMetrics[item]);
    const metricKeys = selected.length ? selected : ["notes", "characters", "monthUpdates", "activeDays"];
    metricKeys.forEach((key) => {
      const metric = data.insightMetrics[key];
      const card = el(grid, "button", `ad-insight-card ${this.insightDetailKey === key ? "is-active" : ""}`);
      const iconWrap = el(card, "span", "ad-insight-icon");
      setIcon(iconWrap, metric.icon);
      const copy6 = el(card, "span", "ad-insight-copy");
      el(copy6, "strong", "", compactNumber(metric.value));
      el(copy6, "small", "", metric.label);
      const disclosure = el(card, "i", "ad-insight-disclosure");
      setIcon(disclosure, this.insightDetailKey === key ? "chevron-up" : "chevron-down");
      card.addEventListener("click", () => {
        this.insightDetailKey = this.insightDetailKey === key ? "" : key;
        this.render();
      });
    });
    if (this.insightDetailKey && data.insightMetrics[this.insightDetailKey]) {
      const metric = data.insightMetrics[this.insightDetailKey];
      const detail = el(section, "div", "ad-insight-detail");
      const detailHead = el(detail, "header");
      el(detailHead, "strong", "", metric.detailTitle);
      el(detailHead, "span", "", `${metric.items.length} \u9879`);
      const list = el(detail, "div", "ad-source-list");
      metric.items.forEach((item) => {
        const row = el(list, "button", "ad-source-row");
        const text = el(row, "span");
        el(text, "strong", "", item.label);
        el(text, "small", "", item.meta);
        const arrow = el(row, "i");
        setIcon(arrow, "arrow-up-right");
        row.addEventListener("click", () => this.plugin.openFile(item.file));
      });
      if (!metric.items.length) el(list, "p", "ad-source-empty", "\u8FD9\u4E2A\u8303\u56F4\u5185\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u7B14\u8BB0\u3002");
    }
  }
  panel(parent, title, className) {
    const panel = el(parent, "section", `ad-panel ${className}`);
    const head = el(panel, "header", "ad-panel-head");
    const titleWrap = el(head, "div", "ad-section-title");
    el(titleWrap, "span", "ad-decor-line").createEl("i");
    el(titleWrap, "h2", "", title);
    return { panel, head, body: el(panel, "div", "ad-panel-body") };
  }
  renderToday(parent, data) {
    const { head, body } = this.panel(parent, this.plugin.settings.todayTitle || "\u5F53\u4E0B", "ad-today-panel");
    const badge = el(head, "span", "ad-day-badge", `\u4ECA\u65E5 ${data.todayCharacters} \u5B57`);
    badge.setAttribute("aria-label", "\u4ECA\u65E5\u5B57\u6570");
    body.addClass("is-today-layout");
    if (!data.todayFile) {
      const empty = el(body, "button", "ad-today-empty");
      el(empty, "strong", "", "\u4ECA\u5929\u8FD8\u662F\u4E00\u5F20\u767D\u7EB8");
      el(empty, "span", "", "\u5199\u4E0B\u7B2C\u4E00\u53E5\u8BDD\uFF0C\u5C31\u5DF2\u7ECF\u662F\u4E00\u6B21\u5F00\u59CB\u3002");
      empty.addEventListener("click", () => this.plugin.openToday());
      this.renderLifeProgress(body, data.lifeProgress);
      return;
    }
    body.addClass("is-populated");
    const mainArea = el(body, "div", "ad-today-main");
    const now = el(mainArea, "div", "ad-now-card");
    now.setAttribute("role", "button");
    now.setAttribute("tabindex", "0");
    const nowCopy = el(now, "span");
    el(nowCopy, "strong", "", data.todayFile.basename);
    const excerptFrame = el(nowCopy, "div", "ad-markdown-frame");
    const excerptEl = el(excerptFrame, "div", "ad-markdown-excerpt");
    this.renderMarkdownExcerpt(excerptEl, data.todayMarkdown, data.todayFile.path);
    now.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      this.plugin.openFile(data.todayFile);
    });
    now.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") this.plugin.openFile(data.todayFile);
    });
    this.renderLifeProgress(body, data.lifeProgress);
    if (data.todayRelated.length) {
      const relatedArea = el(body, "div", "ad-related-section");
      const relatedHead = el(relatedArea, "div", "ad-subsection-title");
      el(relatedHead, "span", "", "\u4ECA\u65E5\u5173\u8054");
      el(relatedHead, "i");
      const related = el(relatedArea, "div", "ad-related-list");
      data.todayRelated.slice(0, 4).forEach((file) => {
        const button = el(related, "button", "ad-related-item");
        const icon = el(button, "i");
        setIcon(icon, "link-2");
        el(button, "span", "", file.basename);
        button.addEventListener("click", () => this.plugin.openFile(file));
      });
    }
  }
  renderLifeProgress(parent, data) {
    const section = el(parent, "section", `ad-life-progress glass-surface ${data.hasBirthDate ? "" : "is-unset"}`);
    const head = el(section, "header", "ad-life-head");
    const identity4 = el(head, "div", "ad-life-identity");
    const lifeMark = (this.plugin.settings.lifeProgressMark || "\u4EBA").slice(0, 2);
    const lifeOrb = el(identity4, "span", "ad-life-orb", lifeMark);
    lifeOrb.addClass(lifeMark.length === 1 ? "is-single" : "is-pair");
    if (/^[a-z\d]{2}$/i.test(lifeMark)) lifeOrb.addClass("is-latin-pair");
    const lifeMarkColor = String(this.plugin.settings.lifeProgressMarkColor || "").trim();
    if (lifeMarkColor && CSS.supports("color", lifeMarkColor)) {
      lifeOrb.style.setProperty("--ad-life-mark-color", lifeMarkColor);
      lifeOrb.style.setProperty("color", lifeMarkColor, "important");
    }
    const lifeMarkFont = String(this.plugin.settings.lifeProgressMarkFont || "PingFang SC").trim();
    if (lifeMarkFont && CSS.supports("font-family", lifeMarkFont)) {
      lifeOrb.style.setProperty("--ad-life-mark-font", lifeMarkFont);
    }
    const copy6 = el(identity4, "div");
    el(copy6, "strong", "", this.plugin.settings.lifeProgressTitle || "\u4EBA\u751F\u8FDB\u5EA6");
    const daysLine = el(copy6, "span", "ad-life-days-line");
    el(daysLine, "em", "", data.hasBirthDate ? "\u5DF2\u7ECF\u8D70\u8FC7" : "\u8BB0\u5F55\u8DE8\u5EA6");
    const daysSlot = el(daysLine, "b", "ad-life-days-slot");
    let displayedLifeDays = data.hasBirthDate ? data.livedDays : data.journalSpanDays;
    el(daysLine, "em", "", "\u5929");
    const digitModulo = (value) => (value % 10 + 10) % 10;
    const buildLifeDigits = (value) => {
      daysSlot.empty();
      String(value.toLocaleString()).split("").forEach((character) => {
        if (!/\d/.test(character)) {
          el(daysSlot, "i", "ad-life-digit-separator", character);
          return;
        }
        const digit = Number(character);
        const cell = el(daysSlot, "i", "ad-life-digit-cell");
        cell.dataset.digit = String(digit);
        cell._position = 20 + digit;
        const reel = el(cell, "span", "ad-life-digit-reel");
        for (let index = 0; index <= 40; index += 1) el(reel, "b", "", String(index % 10));
        reel.style.transition = "none";
        reel.style.transform = `translateY(${-cell._position * 1.28}em)`;
        window.requestAnimationFrame(() => {
          reel.style.transition = "";
        });
      });
    };
    buildLifeDigits(displayedLifeDays);
    const calendarJumpButton = el(head, "button", "ad-life-today-button is-visible");
    const calendarJumpIcon = el(calendarJumpButton, "i");
    setIcon(calendarJumpIcon, "calendar-days");
    el(calendarJumpButton, "span", "", "\u65E5\u671F");
    calendarJumpButton.setAttribute("aria-label", "\u67E5\u770B\u5E76\u8DF3\u8F6C\u65E5\u671F");
    calendarJumpButton.setAttribute("aria-haspopup", "dialog");
    calendarJumpButton.setAttribute("aria-expanded", "false");
    const wheel = el(section, "div", "ad-life-wheel");
    wheel.setAttribute("role", "listbox");
    wheel.setAttribute("tabindex", "0");
    wheel.setAttribute("aria-description", "\u4F7F\u7528\u6EDA\u8F6E\u6216\u62D6\u52A8\u56DE\u770B\u8FC7\u53BB\u65E5\u671F");
    el(wheel, "span", "ad-life-wheel-glow");
    const dateTrigger = el(wheel, "button", "ad-life-selected-label", "\u4ECA\u5929");
    const selectedLabel = dateTrigger;
    dateTrigger.setAttribute("aria-description", "\u6253\u5F00\u65E5\u671F\u5B9A\u4F4D");
    dateTrigger.setAttribute("aria-haspopup", "dialog");
    dateTrigger.setAttribute("aria-expanded", "false");
    const calendarLayer = document.body.createDiv({ cls: "ad-life-calendar-layer" });
    calendarLayer.addClass(`is-${this.effectiveMode()}`);
    this.calendarLayer = calendarLayer;
    const appearance = getComputedStyle(this.contentEl);
    ["--ad-bg", "--ad-card", "--ad-line", "--ad-accent", "--ad-text", "--ad-sub", "--ad-muted", "--ad-soft", "--ad-on-heat", "--ad-glass-strong"].forEach((property) => calendarLayer.style.setProperty(property, appearance.getPropertyValue(property)));
    const calendar = el(calendarLayer, "div", "ad-life-calendar");
    calendar.setAttribute("role", "dialog");
    calendar.setAttribute("aria-label", "\u9009\u62E9\u4EBA\u751F\u8FDB\u5EA6\u65E5\u671F");
    calendar.setAttribute("aria-hidden", "true");
    const returnButton = el(wheel, "button", "ad-life-calendar-trigger");
    for (let index = 0; index < 6; index += 1) {
      const ring = el(returnButton, "span", "ad-life-magic-ring");
      ring.style.setProperty("--ad-ring-size", `${16 + index * 5}px`);
      ring.style.setProperty("--ad-ring-angle", `${index * 31}deg`);
      ring.style.setProperty("--ad-ring-mix", `${56 - index * 5}%`);
      ring.style.setProperty("--ad-ring-peak", String(0.5 - index * 0.055));
      ring.style.setProperty("--ad-ring-mid", String(0.32 - index * 0.04));
      ring.style.setProperty("--ad-ring-duration", `${4.15 + index * 0.28}s`);
      ring.style.setProperty("--ad-ring-delay", `${index * -0.61}s`);
    }
    returnButton.setAttribute("aria-label", "\u56DE\u5230\u4ECA\u5929");
    returnButton.disabled = true;
    const slotCount = 11;
    const centerSlot = Math.floor(slotCount / 2);
    const slots = Array.from({ length: slotCount }, (_, index) => {
      const button = el(wheel, "button", "ad-life-day");
      button.setAttribute("role", "option");
      el(button, "strong");
      el(button, "span");
      el(button, "i");
      el(button, "b", "ad-life-dial-tick");
      button.dataset.relative = String(index - centerSlot);
      return button;
    });
    let position = 0;
    let target = 0;
    let selectedOffset = 0;
    let lastFrame = performance.now();
    let drag = null;
    let dragMoved = false;
    const dayWidth = 58;
    const clamp = (value) => Math.max(0, Math.min(data.maxOffset, value));
    const entryForOffset = (offset) => {
      const key = window.moment().startOf("day").subtract(offset, "days").format("YYYY-MM-DD");
      return { key, entry: data.noteDays.get(key), moment: window.moment(key, "YYYY-MM-DD") };
    };
    const updateLifeDays = (offset) => {
      const nextValue = Math.max(0, (data.hasBirthDate ? data.livedDays : data.journalSpanDays) - offset);
      if (nextValue === displayedLifeDays) return;
      const previousText = displayedLifeDays.toLocaleString();
      const nextText = nextValue.toLocaleString();
      if (previousText.length !== nextText.length) {
        displayedLifeDays = nextValue;
        buildLifeDigits(nextValue);
        return;
      }
      const direction = nextValue < displayedLifeDays ? -1 : 1;
      const children = Array.from(daysSlot.children);
      nextText.split("").forEach((character, index) => {
        const cell = children[index];
        if (!cell || !/\d/.test(character) || cell.dataset.digit === character) return;
        const targetDigit = Number(character);
        let nextPosition = Number(cell._position);
        do
          nextPosition += direction;
        while (digitModulo(nextPosition) !== targetDigit);
        cell._position = nextPosition;
        cell.dataset.digit = character;
        const reel = cell.querySelector(".ad-life-digit-reel");
        const inertiaDelay = Math.max(0, nextText.length - 1 - index) * 18;
        reel.style.transitionDelay = `${inertiaDelay}ms`;
        reel.style.transform = `translateY(${-nextPosition * 1.28}em)`;
        window.clearTimeout(cell._rebaseTimer);
        cell._rebaseTimer = window.setTimeout(() => {
          if (cell._position >= 10 && cell._position <= 30) return;
          const rebased = 20 + Number(cell.dataset.digit);
          reel.style.transition = "none";
          cell._position = rebased;
          reel.style.transform = `translateY(${-rebased * 1.28}em)`;
          window.requestAnimationFrame(() => {
            reel.style.transition = "";
          });
        }, 520 + inertiaDelay);
      });
      displayedLifeDays = nextValue;
    };
    const updateSelected = (offset, withSound = true) => {
      const next = Math.round(clamp(offset));
      if (next === selectedOffset && selectedLabel.textContent) return;
      selectedOffset = next;
      const { moment } = entryForOffset(next);
      selectedLabel.setText(next === 0 ? "\u4ECA\u5929" : moment.format("M\u6708D\u65E5"));
      updateLifeDays(next);
      returnButton.disabled = next === 0;
      returnButton.toggleClass("is-available", next > 0);
      if (withSound) this.playWheelTick();
    };
    const layoutDays = (value) => {
      const base = Math.floor(value);
      const fraction = value - base;
      slots.forEach((button, index) => {
        const relative = index - centerSlot;
        const offset = base + relative;
        const distance2 = relative - fraction;
        if (offset < -centerSlot || offset > data.maxOffset) {
          button.hidden = true;
          return;
        }
        button.hidden = false;
        const { entry, moment } = entryForOffset(offset);
        if (button.dataset.offset !== String(offset)) {
          button.dataset.offset = String(offset);
          button.querySelector("strong").setText(String(moment.date()));
          button.querySelector("span").setText(moment.format("M\u6708"));
          button.setAttribute("aria-label", `${moment.format("YYYY\u5E74M\u6708D\u65E5")}${entry ? "\uFF0C\u6709\u65E5\u8BB0" : ""}`);
        }
        button.toggleClass("has-note", Boolean(entry));
        button.toggleClass("is-future", offset < 0);
        button.toggleClass("is-selected", offset === Math.round(value));
        button.setAttribute("aria-selected", String(offset === Math.round(value)));
        const x = distance2 * dayWidth;
        const y = Math.pow(Math.abs(distance2), 1.5) * 2.05;
        const rotation = distance2 * 5.1;
        const opacity = Math.max(0.12, 1 - Math.abs(distance2) * 0.13);
        const blur = Math.min(Math.abs(distance2) * 0.46, 2.8);
        const focus = Math.exp(-Math.pow(distance2 * 0.88, 2));
        const tick = button.querySelector(".ad-life-dial-tick");
        tick.style.height = `${(7 + focus * 25).toFixed(2)}px`;
        tick.style.opacity = String(0.22 + focus * 0.78);
        tick.style.filter = `blur(${Math.min(Math.abs(distance2) * 0.7, 2.8).toFixed(2)}px)`;
        tick.style.transform = `translateX(-50%) rotate(${(distance2 * 3.2).toFixed(2)}deg)`;
        button.style.transform = `translate(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px)) rotate(${rotation.toFixed(2)}deg)`;
        button.style.opacity = String(opacity);
        button.style.filter = `blur(${blur.toFixed(2)}px)`;
      });
    };
    const runFrame = (now) => {
      const delta = Math.min((now - lastFrame) / 1e3, 0.05);
      lastFrame = now;
      const smoothing = 1 - Math.exp(-delta / 0.16);
      position += (target - position) * smoothing;
      const settled = Math.abs(target - position) < 1e-3;
      if (settled) position = target;
      layoutDays(position);
      updateSelected(position);
      this.lifeWheelFrame = settled ? 0 : window.requestAnimationFrame(runFrame);
    };
    const startLoop = () => {
      window.cancelAnimationFrame(this.lifeWheelFrame);
      lastFrame = performance.now();
      this.lifeWheelFrame = window.requestAnimationFrame(runFrame);
    };
    const applyTarget = (value, snap = false) => {
      wheel.removeClass("is-returning");
      returnButton.removeClass("is-returning");
      if (!snap && value < 0) target = Math.max(-0.42, value * 0.18);
      else target = clamp(snap ? Math.round(value) : value);
      startLoop();
    };
    const returnToToday = () => {
      const startPosition = Math.max(0, position);
      if (startPosition < 1e-3) return;
      window.cancelAnimationFrame(this.lifeWheelFrame);
      window.clearTimeout(this.lifeWheelTimer);
      target = 0;
      const startedAt = performance.now();
      const duration = Math.min(1650, 760 + Math.log1p(startPosition) * 115);
      wheel.addClass("is-returning");
      returnButton.addClass("is-returning");
      const returnFrame = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        position = startPosition * (1 - eased);
        layoutDays(position);
        updateSelected(position);
        if (progress < 1) {
          this.lifeWheelFrame = window.requestAnimationFrame(returnFrame);
          return;
        }
        position = 0;
        target = 0;
        layoutDays(0);
        updateSelected(0, false);
        wheel.removeClass("is-returning");
        returnButton.removeClass("is-returning");
        this.lifeWheelFrame = 0;
      };
      this.lifeWheelFrame = window.requestAnimationFrame(returnFrame);
    };
    returnButton.addEventListener("click", returnToToday);
    const todayMoment = window.moment().startOf("day");
    const minimumMoment = todayMoment.clone().subtract(data.maxOffset, "days");
    let pickerMoment = todayMoment.clone();
    const closeCalendar = () => {
      calendarLayer.removeClass("is-open");
      calendar.removeClass("is-open");
      calendar.setAttribute("aria-hidden", "true");
      dateTrigger.setAttribute("aria-expanded", "false");
      calendarJumpButton.setAttribute("aria-expanded", "false");
      if (this.calendarOutsideHandler) document.removeEventListener("pointerdown", this.calendarOutsideHandler, true);
      this.calendarOutsideHandler = null;
    };
    const selectCalendarDate = (moment) => {
      pickerMoment = moment.clone().startOf("day");
      const offset = todayMoment.diff(pickerMoment, "days");
      applyTarget(offset, true);
      closeCalendar();
    };
    const renderCalendar = () => {
      calendar.empty();
      const calendarHead = el(calendar, "header", "ad-life-calendar-head");
      const previous = el(calendarHead, "button", "ad-life-calendar-nav");
      setIcon(previous, "chevron-left");
      const selects = el(calendarHead, "div", "ad-life-calendar-selects");
      const yearSelect = el(selects, "select");
      for (let year = todayMoment.year(); year >= minimumMoment.year(); year -= 1) {
        const option = yearSelect.createEl("option", { text: `${year}\u5E74` });
        option.value = String(year);
        option.selected = year === pickerMoment.year();
      }
      const monthSelect = el(selects, "select");
      for (let month = 0; month < 12; month += 1) {
        const option = monthSelect.createEl("option", { text: `${month + 1}\u6708` });
        option.value = String(month);
        option.selected = month === pickerMoment.month();
      }
      const next = el(calendarHead, "button", "ad-life-calendar-nav");
      setIcon(next, "chevron-right");
      const weekdays = el(calendar, "div", "ad-life-calendar-weekdays");
      "\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u65E5".split("").forEach((day) => el(weekdays, "span", "", day));
      const days = el(calendar, "div", "ad-life-calendar-days");
      const start = pickerMoment.clone().startOf("month").startOf("isoWeek");
      for (let index = 0; index < 42; index += 1) {
        const dayMoment = start.clone().add(index, "days");
        const disabled = dayMoment.isAfter(todayMoment, "day") || dayMoment.isBefore(minimumMoment, "day");
        const button = el(days, "button", "ad-life-calendar-day", String(dayMoment.date()));
        button.toggleClass("is-outside", dayMoment.month() !== pickerMoment.month());
        button.toggleClass("is-selected", dayMoment.isSame(pickerMoment, "day"));
        button.toggleClass("has-note", Boolean(data.noteDays.get(dayMoment.format("YYYY-MM-DD"))));
        button.disabled = disabled;
        if (!disabled) button.addEventListener("click", () => selectCalendarDate(dayMoment));
      }
      const changeMonth = (delta) => {
        const candidate = pickerMoment.clone().add(delta, "month").startOf("month");
        if (candidate.isAfter(todayMoment, "month") || candidate.isBefore(minimumMoment, "month")) return;
        pickerMoment = candidate;
        renderCalendar();
      };
      previous.addEventListener("click", () => changeMonth(-1));
      next.addEventListener("click", () => changeMonth(1));
      yearSelect.addEventListener("change", () => {
        pickerMoment.date(1).year(Number(yearSelect.value));
        if (pickerMoment.isAfter(todayMoment, "day")) pickerMoment = todayMoment.clone();
        if (pickerMoment.isBefore(minimumMoment, "day")) pickerMoment = minimumMoment.clone();
        renderCalendar();
      });
      monthSelect.addEventListener("change", () => {
        pickerMoment.date(1).month(Number(monthSelect.value));
        if (pickerMoment.isAfter(todayMoment, "day")) pickerMoment = todayMoment.clone();
        if (pickerMoment.isBefore(minimumMoment, "day")) pickerMoment = minimumMoment.clone();
        renderCalendar();
      });
    };
    dateTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (calendar.hasClass("is-open")) {
        closeCalendar();
        return;
      }
      pickerMoment = entryForOffset(selectedOffset).moment.clone();
      renderCalendar();
      calendarLayer.addClass("is-open");
      calendar.addClass("is-open");
      calendar.setAttribute("aria-hidden", "false");
      dateTrigger.setAttribute("aria-expanded", "true");
      calendarJumpButton.setAttribute("aria-expanded", "true");
      this.calendarOutsideHandler = (outsideEvent) => {
        if (calendar.contains(outsideEvent.target) || dateTrigger.contains(outsideEvent.target) || calendarJumpButton.contains(outsideEvent.target)) return;
        closeCalendar();
      };
      window.setTimeout(() => {
        if (this.calendarOutsideHandler) document.addEventListener("pointerdown", this.calendarOutsideHandler, true);
      }, 0);
    });
    dateTrigger.addEventListener("pointerdown", (event) => event.stopPropagation());
    returnButton.addEventListener("pointerdown", (event) => event.stopPropagation());
    calendarJumpButton.addEventListener("pointerdown", (event) => event.stopPropagation());
    calendarJumpButton.addEventListener("click", (event) => {
      event.stopPropagation();
      dateTrigger.click();
    });
    slots.forEach((button) => {
      button.addEventListener("click", () => {
        if (dragMoved) return;
        const offset = Number(button.dataset.offset);
        if (!Number.isFinite(offset)) return;
        if (offset < 0) {
          applyTarget(-0.36, false);
          window.clearTimeout(this.lifeWheelTimer);
          this.lifeWheelTimer = window.setTimeout(() => applyTarget(0, true), 150);
          return;
        }
        const { entry } = entryForOffset(offset);
        if (offset === selectedOffset && entry) this.plugin.openFile(entry.file);
        else applyTarget(offset, true);
      });
    });
    wheel.addEventListener("wheel", (event) => {
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 24 : event.deltaY;
      const step = Math.max(-1, Math.min(1, delta / dayWidth));
      applyTarget(target + step, false);
      window.clearTimeout(this.lifeWheelTimer);
      this.lifeWheelTimer = window.setTimeout(() => applyTarget(target, true), 140);
    }, { passive: false });
    wheel.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, start: target };
      dragMoved = false;
      wheel.addClass("is-dragging");
    });
    wheel.addEventListener("pointermove", (event) => {
      if (!drag || drag.id !== event.pointerId) return;
      const delta = event.clientX - drag.x;
      if (!dragMoved && Math.abs(delta) > 4) {
        dragMoved = true;
        wheel.setPointerCapture?.(event.pointerId);
      }
      if (dragMoved) applyTarget(drag.start - delta / dayWidth, false);
    });
    const finishDrag = (event) => {
      if (!drag) return;
      drag = null;
      wheel.removeClass("is-dragging");
      if (wheel.hasPointerCapture?.(event.pointerId)) wheel.releasePointerCapture(event.pointerId);
      if (dragMoved) applyTarget(target, true);
      window.setTimeout(() => {
        dragMoved = false;
      }, 0);
    };
    wheel.addEventListener("pointerup", finishDrag);
    wheel.addEventListener("pointercancel", finishDrag);
    wheel.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Enter" || event.key === " ") {
        const { entry } = entryForOffset(selectedOffset);
        if (entry) this.plugin.openFile(entry.file);
        return;
      }
      applyTarget(Math.round(target) + (event.key === "ArrowLeft" ? 1 : -1), true);
    });
    updateSelected(0, false);
    layoutDays(0);
  }
  renderHeatmap(parent, data) {
    const { panel, head, body } = this.panel(parent, this.plugin.settings.heatmapTitle || "\u6587\u5B57\u70ED\u529B\u56FE", "ad-heatmap-panel");
    panel.id = "alex-desk-heatmap";
    const summary = el(head, "span", "ad-heatmap-range", `\u8FD1 ${data.heatmap.days.length} \u5929`);
    const stats = el(body, "div", "ad-heatmap-stats");
    [
      [compactNumber(data.heatmap.totalCharacters), `\u8FD1${data.heatmap.weeks}\u5468\u65E5\u8BB0\u5B57\u6570`],
      [String(data.heatmap.activeDays), `\u8FD1${data.heatmap.weeks}\u5468\u5199\u4F5C\u65E5`],
      [compactNumber(data.heatmap.averageCharacters), "\u6D3B\u8DC3\u65E5\u5747\u5B57\u6570"]
    ].forEach(([value, label]) => {
      const item = el(stats, "div");
      el(item, "strong", "", value);
      el(item, "span", "", label);
    });
    const chart = el(body, "div", "ad-heatmap-chart");
    const monthRow = el(chart, "div", "ad-heatmap-months");
    monthRow.style.setProperty("--weeks", String(data.heatmap.weeks));
    data.heatmap.monthLabels.forEach((item) => {
      const label = el(monthRow, "span", "", item.label);
      label.style.gridColumn = String(item.column + 1);
    });
    const weekdayLabels = el(chart, "div", "ad-heatmap-weekdays");
    el(weekdayLabels, "span", "", "\u4E00");
    el(weekdayLabels, "span", "", "\u4E09");
    el(weekdayLabels, "span", "", "\u4E94");
    const grid = el(chart, "div", "ad-heatmap-grid");
    grid.style.setProperty("--weeks", String(data.heatmap.weeks));
    data.heatmap.days.forEach((day) => {
      const cell = el(grid, "button", `ad-heat-cell heat-${heatLevel(day.characters)}`);
      if (day.isToday) cell.addClass("is-today");
      cell.setAttribute("aria-label", `${day.label}\uFF0C${day.characters} \u5B57`);
      cell.setAttribute("data-tooltip-position", "top");
      cell.addEventListener("click", () => {
        if (day.dailyFile) this.plugin.openFile(day.dailyFile);
        else if (day.isToday) this.plugin.openToday();
      });
    });
    const legend = el(body, "div", "ad-heat-legend");
    el(legend, "span", "", "\u5C11");
    for (let level = 1; level <= 4; level += 1) el(legend, "i", `heat-${level}`);
    el(legend, "span", "", "\u591A");
    const best = el(legend, "button", "ad-best-day");
    el(best, "span", "", `\u5355\u65E5\u65E5\u8BB0\u6700\u9AD8 ${compactNumber(data.heatmap.bestDay.characters)} \u5B57`);
    if (data.heatmap.bestDay.dailyFile) {
      best.setAttribute("aria-label", `\u6253\u5F00 ${data.heatmap.bestDay.dailyFile.basename}`);
      const preview = el(best, "span", "ad-best-preview");
      el(preview, "strong", "", data.heatmap.bestDay.label);
      best.addEventListener("click", () => this.plugin.openFile(data.heatmap.bestDay.dailyFile));
    } else {
      best.disabled = true;
    }
    this.renderTaskQueue(body, data.taskQueue);
  }
  renderTaskQueue(parent, taskData) {
    const pending = taskData?.pending || [];
    const completed = taskData?.completed || [];
    const section = el(parent, "section", "ad-task-queue");
    const head = el(section, "header", "ad-subsection-title");
    const heading = el(head, "span", "ad-task-heading");
    el(heading, "strong", "", "\u5F85\u529E\u62FE\u53D6");
    el(head, "i");
    el(head, "small", "ad-task-queue-count", `\u6563\u843D\u5728 ${taskData?.sourceCount || 0} \u7BC7\u7B14\u8BB0\u4E2D`);
    const overview = el(section, "div", "ad-task-overview");
    const total = pending.length + (taskData?.completedTotal || 0);
    const completedRatio = total ? Math.round((taskData?.completedTotal || 0) / total * 100) : 0;
    const encouragement = !total ? "\u6E05\u5355\u8FD8\u662F\u7A7A\u7684" : completedRatio === 100 ? "\u4ECA\u5929\u7684\u6E05\u5355\uFF0C\u6F02\u4EAE\u6536\u5C3E" : completedRatio >= 75 ? "\u53EA\u5DEE\u4E00\u70B9\uFF0C\u7A33\u7A33\u6536\u5C3E" : completedRatio >= 50 ? "\u5DF2\u7ECF\u8D70\u8FC7\u4E00\u534A" : completedRatio >= 25 ? "\u8282\u594F\u6B63\u5728\u5F62\u6210" : completedRatio > 0 ? "\u5DF2\u7ECF\u5F00\u59CB\uFF0C\u5F88\u597D" : "\u5148\u5B8C\u6210\u6700\u5C0F\u7684\u4E00\u4EF6";
    section.toggleClass("is-complete", total > 0 && completedRatio === 100);
    const summary = el(overview, "span");
    el(summary, "strong", "", `${completedRatio}%`);
    const progress = el(overview, "i");
    progress.style.setProperty("--ad-task-progress", `${completedRatio}%`);
    const currentStage = !total || completedRatio === 0 ? 0 : completedRatio < 25 ? 1 : completedRatio < 50 ? 2 : completedRatio < 75 ? 3 : completedRatio < 100 ? 4 : 5;
    const encouragementPill = el(overview, "div", `ad-task-encouragement stage-${currentStage}`);
    const reactionOptions = [["\u{1F642}", "\u5148\u5B8C\u6210\u6700\u5C0F\u7684\u4E00\u4EF6"], ["\u{1F44D}", "\u5DF2\u7ECF\u5F00\u59CB\uFF0C\u5F88\u597D"], ["\u{1F44F}\u{1F3FB}", "\u8282\u594F\u6B63\u5728\u5F62\u6210"], ["\u2728", "\u5DF2\u7ECF\u8D70\u8FC7\u4E00\u534A"], ["\u{1F389}", "\u6F02\u4EAE\u6536\u5C3E"]];
    const activeReaction = [0, 1, 2, 3, 3, 4][currentStage];
    const reactionRail = el(encouragementPill, "div", "ad-task-reactions");
    reactionOptions.forEach(([emoji, label], index) => {
      const displayLabel = index === activeReaction ? encouragement : label;
      const reaction = el(reactionRail, "span", index === activeReaction ? "is-active" : "", emoji);
      reaction.dataset.label = displayLabel;
      reaction.setAttribute("role", "img");
      reaction.setAttribute("aria-label", displayLabel);
    });
    const filters = el(section, "div", "ad-task-filters");
    const pendingFilter = el(filters, "button", "is-active", `\u5F85\u5B8C\u6210 ${pending.length}`);
    const completedFilter = el(filters, "button", "", `\u6700\u8FD1\u5B8C\u6210 ${completed.length}`);
    const list = el(section, "div", "ad-task-queue-list");
    const renderTask = (task) => {
      const row = el(list, "div", `ad-task-queue-item ${task.completed ? "is-completed" : ""}`);
      const checkbox = el(row, "input", "ad-task-checkbox");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", task.completed ? `\u6062\u590D\u5F85\u529E\uFF1A${plainText(task.text)}` : `\u5B8C\u6210\u5F85\u529E\uFF1A${plainText(task.text)}`);
      checkbox.addEventListener("change", async (event) => {
        event.stopPropagation();
        checkbox.disabled = true;
        try {
          const shouldCelebrate = !task.completed && checkbox.checked;
          const checkboxBounds = checkbox.getBoundingClientRect();
          await this.plugin.toggleTask(task);
          if (shouldCelebrate) this.celebrateTaskCheck(checkboxBounds);
        } catch (error) {
          console.error("[\u6BCF\u65E5\u4E13\u6CE8\u4E3B\u9875] \u5F85\u529E\u72B6\u6001\u66F4\u65B0\u5931\u8D25", error);
          checkbox.checked = task.completed;
          checkbox.disabled = false;
          new Notice("\u5F85\u529E\u72B6\u6001\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u6253\u5F00\u539F\u7B14\u8BB0\u68C0\u67E5\u3002");
        }
      });
      const copy6 = el(row, "div", "ad-task-copy");
      copy6.tabIndex = 0;
      copy6.setAttribute("role", "button");
      copy6.setAttribute("aria-label", `\u6253\u5F00 ${task.file.basename}`);
      const markdown = el(copy6, "div", "ad-task-markdown");
      MarkdownRenderer.render(this.app, withoutMarkdownImages(task.text), markdown, task.file.path, this).then(() => clampRenderedText(markdown, 32)).catch((error) => {
        console.error("[\u6BCF\u65E5\u4E13\u6CE8\u4E3B\u9875] \u5F85\u529E Markdown \u6E32\u67D3\u5931\u8D25", error);
        markdown.setText(excerpt(task.text, 32));
      });
      el(copy6, "small", "", task.file.basename);
      const arrow = el(row, "b");
      setIcon(arrow, "arrow-up-right");
      const openTask = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.plugin.openFile(task.file);
      };
      copy6.addEventListener("click", openTask);
      copy6.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") openTask(event);
      });
    };
    const renderList = (mode) => {
      list.empty();
      pendingFilter.toggleClass("is-active", mode === "pending");
      completedFilter.toggleClass("is-active", mode === "completed");
      pendingFilter.setAttribute("aria-pressed", String(mode === "pending"));
      completedFilter.setAttribute("aria-pressed", String(mode === "completed"));
      const tasks = mode === "pending" ? pending : completed;
      if (!tasks.length) {
        const empty = el(list, "div", "ad-task-queue-empty");
        const mark = el(empty, "i");
        setIcon(mark, mode === "pending" ? "check-check" : "history");
        el(empty, "span", "", mode === "pending" ? "\u5F53\u524D\u6CA1\u6709\u6563\u843D\u7684\u672A\u5B8C\u6210\u4E8B\u9879" : "\u8FD8\u6CA1\u6709\u6700\u8FD1\u5B8C\u6210\u7684\u4E8B\u9879");
        return;
      }
      tasks.forEach(renderTask);
    };
    pendingFilter.addEventListener("click", () => renderList("pending"));
    completedFilter.addEventListener("click", () => renderList("completed"));
    renderList(pending.length ? "pending" : "completed");
  }
  celebrateTaskCheck(bounds) {
    const celebration = document.body.createDiv({ cls: "ad-task-check-celebration" });
    const appearance = window.getComputedStyle(this.contentEl);
    celebration.style.left = `${bounds.left + bounds.width / 2}px`;
    celebration.style.top = `${bounds.top + bounds.height / 2}px`;
    celebration.style.setProperty("--ad-task-check-accent", appearance.getPropertyValue("--ad-accent").trim());
    celebration.createSpan({ cls: "ad-task-check-ring" });
    const core = celebration.createSpan({ cls: "ad-task-check-core" });
    setIcon(core, "check");
    for (let index = 0; index < 12; index += 1) {
      const spark = celebration.createSpan({ cls: `ad-task-check-spark shape-${index % 3}` });
      spark.style.setProperty("--angle", `${index * 30 + (Math.random() * 8 - 4)}deg`);
      spark.style.setProperty("--distance", `${20 + Math.random() * 13}px`);
      spark.style.setProperty("--delay", `${Math.random() * 55}ms`);
      spark.style.setProperty("--spin", `${90 + Math.random() * 220}deg`);
    }
    window.setTimeout(() => celebration.remove(), 900);
    this.playTaskCheckSound();
  }
  playTaskCheckSound() {
    if (this.plugin.settings.rediscoverySoundEnabled === false) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!this.wheelAudioContext || this.wheelAudioContext.state === "closed") {
      this.wheelAudioContext = new AudioContext();
    }
    const context = this.wheelAudioContext;
    context.resume?.().catch(() => {
    });
    const rawVolume = Number(this.plugin.settings.rediscoverySoundVolume);
    const volume = Number.isFinite(rawVolume) ? Math.max(0, Math.min(1, rawVolume)) : 0.22;
    [659.25, 880].forEach((frequency, index) => {
      const start = context.currentTime + index * 0.045;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(1e-4, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(2e-4, volume * 0.055), start + 0.012);
      gain.gain.exponentialRampToValueAtTime(1e-4, start + 0.16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.17);
    });
  }
  playWheelTick() {
    if (this.plugin.settings.rediscoverySoundEnabled === false) return;
    const now = performance.now();
    if (now - this.wheelLastTick < 70) return;
    this.wheelLastTick = now;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!this.wheelAudioContext || this.wheelAudioContext.state === "closed") {
      this.wheelAudioContext = new AudioContext();
    }
    const context = this.wheelAudioContext;
    context.resume?.().catch(() => {
    });
    const duration = 0.026;
    const length3 = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length3, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < length3; index += 1) {
      const envelope = Math.pow(1 - index / length3, 4);
      channel[index] = (Math.random() * 2 - 1) * envelope;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = "bandpass";
    filter.frequency.value = 1500;
    filter.Q.value = 0.7;
    const rawVolume = Number(this.plugin.settings.rediscoverySoundVolume);
    const volume = Number.isFinite(rawVolume) ? Math.max(0, Math.min(1, rawVolume)) : 0.22;
    gain.gain.setValueAtTime(volume * 0.11, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(1e-4, context.currentTime + duration);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    source.stop(context.currentTime + duration);
  }
  async renderMarkdownExcerpt(container, markdown, sourcePath) {
    const cleaned = String(markdown || "").replace(/^---[\s\S]*?---\s*/m, "").replace(/^#\s+\d{4}年\d{1,2}月\d{1,2}日\s*$/m, "").trim();
    if (!cleaned) {
      el(container, "p", "", "\u4ECA\u5929\u5DF2\u7ECF\u7559\u4E0B\u4E86\u4E00\u4E9B\u6587\u5B57\u3002");
      return;
    }
    try {
      await MarkdownRenderer.render(this.app, cleaned, container, sourcePath, this);
    } catch (error) {
      console.error("[\u6BCF\u65E5\u4E13\u6CE8\u4E3B\u9875] Markdown \u6E32\u67D3\u5931\u8D25", error);
      container.setText(plainText(markdown));
    }
  }
};
var AlexDeskSettingTab = class extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("alex-desk-settings");
    containerEl.createEl("p", { text: "\u4E3B\u9875\u53EA\u4FDD\u7559\u9700\u8981\u88AB\u770B\u89C1\u7684\u4FE1\u606F\u3002\u5168\u90E8\u6570\u636E\u5747\u4ECE\u672C\u5730\u4ED3\u5E93\u8BFB\u53D6\u3002" });
    this.text("\u79F0\u547C", "\u663E\u793A\u5728\u4E3B\u9875\u95EE\u5019\u4E2D\u3002", "displayName");
    new Setting(containerEl).setName("\u5934\u50CF").setDesc(this.plugin.settings.avatarPath || "\u5C1A\u672A\u9009\u62E9\u5934\u50CF\uFF1B\u7559\u7A7A\u65F6\u663E\u793A\u540D\u5B57\u9996\u5B57\u3002").addText((input) => input.setPlaceholder("Image/alex-desk-avatar.png").setValue(this.plugin.settings.avatarPath || "").onChange(async (value) => {
      this.plugin.settings.avatarPath = value.trim();
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    })).addButton((button) => button.setButtonText("\u9009\u62E9\u56FE\u7247").onClick(() => {
      const picker = document.createElement("input");
      picker.type = "file";
      picker.accept = "image/png,image/jpeg,image/webp,image/gif";
      picker.style.display = "none";
      containerEl.appendChild(picker);
      const cleanup = () => picker.remove();
      picker.addEventListener("change", async () => {
        const file = picker.files?.[0];
        if (!file) {
          cleanup();
          return;
        }
        await this.plugin.saveAvatar(file);
        cleanup();
        this.display();
      }, { once: true });
      picker.addEventListener("cancel", cleanup, { once: true });
      picker.click();
    }));
    this.renderAvatarCrop(containerEl);
    this.text("\u6BCF\u65E5\u63D0\u9192", "\u95EE\u5019\u4E0B\u65B9\u7684\u4E00\u53E5\u8BDD\u3002", "motto");
    this.text("\u5C01\u9762\u6587\u6848", "\u663E\u793A\u5728\u6A2A\u5E45\u5E95\u90E8\u3002", "heroCaption");
    new Setting(containerEl).setName("\u5C01\u9762\u56FE\u7247").setDesc("\u6BCF\u884C\u586B\u5199\u4E00\u5F20\u4ED3\u5E93\u5185\u56FE\u7247\u8DEF\u5F84\u3002").addTextArea((input) => input.setValue(this.plugin.settings.heroImages || "").onChange(async (value) => {
      this.plugin.settings.heroImages = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    }));
    new Setting(containerEl).setName("\u81EA\u52A8\u8F6E\u64AD").addToggle((toggle) => toggle.setValue(this.plugin.settings.carouselEnabled).onChange(async (value) => {
      this.plugin.settings.carouselEnabled = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    }));
    new Setting(containerEl).setName("\u8F6E\u64AD\u95F4\u9694").setDesc("3\u201330 \u79D2\u3002").addSlider((slider) => slider.setLimits(3, 30, 1).setDynamicTooltip().setValue(Number(this.plugin.settings.carouselSeconds) || 8).onChange(async (value) => {
      this.plugin.settings.carouselSeconds = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    }));
    new Setting(containerEl).setName("\u5C01\u9762\u81EA\u7136\u6E38\u79FB").setDesc("\u56FE\u7247\u4EC5\u505A\u7F13\u6162\u7684\u4E0A\u4E0B\u53D6\u666F\uFF0C\u4E0D\u518D\u81EA\u52A8\u653E\u5927\u7F29\u5C0F\u3002\u624B\u52A8\u62D6\u52A8\u540E\u4F1A\u8BB0\u4F4F\u8BE5\u56FE\u7247\u7684\u4F4D\u7F6E\u3002").addToggle((toggle) => toggle.setValue(this.plugin.settings.heroAutoPan !== false).onChange(async (value) => {
      this.plugin.settings.heroAutoPan = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    }));
    new Setting(containerEl).setName("\u91CD\u7F6E\u5C01\u9762\u53D6\u666F").setDesc("\u6E05\u9664\u6240\u6709\u56FE\u7247\u7684\u624B\u52A8\u4E0A\u4E0B\u4F4D\u7F6E\uFF0C\u6062\u590D\u81EA\u7136\u6E38\u79FB\u3002").addButton((button) => button.setButtonText("\u6062\u590D\u9ED8\u8BA4").onClick(async () => {
      this.plugin.settings.heroImagePositions = {};
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
      new Notice("\u5C01\u9762\u53D6\u666F\u4F4D\u7F6E\u5DF2\u91CD\u7F6E\u3002");
    }));
    new Setting(containerEl).setName("\u7CFB\u7EDF\u97F3\u9891\u9891\u8C31").setDesc("\u5728\u6A2A\u5E45\u5E95\u90E8\u663E\u793A\u968F\u7CFB\u7EDF\u58F0\u97F3\u8DF3\u52A8\u7684\u97F3\u8C31\u3002Windows \u76F4\u63A5\u8BFB\u53D6\u672C\u673A\u626C\u58F0\u5668\u5CF0\u503C\uFF0C\u4E0D\u9700\u8981\u5C4F\u5E55\u5171\u4EAB\u6743\u9650\u3002").addToggle((toggle) => toggle.setValue(this.plugin.settings.systemSpectrumEnabled === true).onChange(async (value) => {
      this.plugin.settings.systemSpectrumEnabled = value;
      const connection = value ? this.plugin.startSystemAudioCapture(true) : Promise.resolve(false);
      if (!value) this.plugin.stopSystemAudioCapture();
      await this.plugin.saveSettings();
      if (value) await connection;
      this.plugin.refreshViews();
    })).addButton((button) => button.setButtonText("\u91CD\u65B0\u8FDE\u63A5").onClick(async () => {
      this.plugin.stopSystemAudioCapture();
      const connected = await this.plugin.startSystemAudioCapture(true);
      if (connected) new Notice("\u7CFB\u7EDF\u58F0\u97F3\u5DF2\u8FDE\u63A5\uFF0C\u64AD\u653E\u97F3\u4E50\u5373\u53EF\u770B\u5230\u9891\u8C31\u8DF3\u52A8\u3002");
      this.plugin.refreshViews();
    }));
    new Setting(containerEl).setName("\u9891\u8C31\u989C\u8272").setDesc("\u9ED8\u8BA4\u8DDF\u968F\u5F53\u524D\u914D\u8272\u4E3B\u9898\uFF1B\u9009\u62E9\u989C\u8272\u540E\u5C06\u56FA\u5B9A\u4F7F\u7528\u81EA\u5B9A\u4E49\u989C\u8272\u3002").addColorPicker((picker) => picker.setValue(this.plugin.settings.systemSpectrumColor || "#a85c45").onChange(async (value) => {
      this.plugin.settings.systemSpectrumColor = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    })).addExtraButton((button) => button.setIcon("rotate-ccw").setTooltip("\u6062\u590D\u8DDF\u968F\u4E3B\u9898").onClick(async () => {
      this.plugin.settings.systemSpectrumColor = "";
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
      this.display();
    }));
    new Setting(containerEl).setName("\u9891\u8C31\u6837\u5F0F").setDesc("\u56DB\u79CD\u6837\u5F0F\u5171\u7528\u540C\u4E00\u5B89\u5168\u9AD8\u5EA6\uFF0C\u4E0D\u4F1A\u4E0E\u6A2A\u5E45\u6587\u6848\u91CD\u53E0\u3002").addDropdown((dropdown) => dropdown.addOption("soft-bars", "\u67D4\u5149\u97F3\u67F1").addOption("mirror", "\u955C\u50CF\u8109\u51B2").addOption("dots", "\u5706\u70B9\u58F0\u6CE2").addOption("blocks", "\u5206\u6BB5\u5747\u8861\u5668").setValue(this.plugin.settings.systemSpectrumStyle || "soft-bars").onChange(async (value) => {
      this.plugin.settings.systemSpectrumStyle = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    }));
    new Setting(containerEl).setName("\u97F3\u9891\u54CD\u5E94\u9608\u503C").setDesc("\u6570\u503C\u8D8A\u4F4E\u8D8A\u7075\u654F\u3001\u8DF3\u52A8\u8D8A\u660E\u663E\uFF1B\u6570\u503C\u8D8A\u9AD8\u8D8A\u5E73\u7F13\u3002\u9AD8\u5EA6\u59CB\u7EC8\u9650\u5236\u5728\u9891\u8C31\u533A\u57DF\u5185\u3002").addSlider((slider) => slider.setLimits(0, 40, 1).setDynamicTooltip().setValue(Number.isFinite(Number(this.plugin.settings.systemSpectrumThreshold)) ? Number(this.plugin.settings.systemSpectrumThreshold) : 12).onChange(async (value) => {
      this.plugin.settings.systemSpectrumThreshold = value;
      await this.plugin.saveSettings();
    }));
    new Setting(containerEl).setName("\u663C\u591C\u6A21\u5F0F").setDesc("\u81EA\u52A8\u6A21\u5F0F\u8DDF\u968F Obsidian\u3002").addDropdown((dropdown) => dropdown.addOption("auto", "\u8DDF\u968F Obsidian").addOption("day", "\u767D\u5929").addOption("night", "\u9ED1\u591C").setValue(this.plugin.settings.colorMode).onChange(async (value) => {
      this.plugin.settings.colorMode = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    }));
    this.text("\u6570\u636E\u6A21\u5757\u6807\u9898", "\u4F8B\u5982\uFF1A\u77E5\u8BC6\u6982\u89C8\u3001\u5199\u4F5C\u6570\u636E\u3001\u6211\u7684\u6C89\u6DC0\u3002", "insightsTitle");
    this.text(
      "\u6570\u636E\u6307\u6807",
      "\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694\uFF1Anotes\uFF08\u7B14\u8BB0\u6570\uFF09\u3001characters\uFF08\u603B\u5B57\u6570\uFF09\u3001monthUpdates\uFF08\u672C\u6708\u66F4\u65B0\uFF09\u3001activeDays\uFF08\u6C89\u6DC0\u5929\u6570\uFF09\u3001todayCharacters\uFF08\u4ECA\u65E5\u5B57\u6570\uFF09\u3001monthCharacters\uFF08\u672C\u6708\u5B57\u6570\uFF09\u3002",
      "insightMetrics"
    );
    this.text("\u5F53\u4E0B\u6A21\u5757\u6807\u9898", "\u4F8B\u5982\uFF1A\u5F53\u4E0B\u3001\u4ECA\u65E5\u8BB0\u5F55\u3001\u6B64\u523B\u3002", "todayTitle");
    this.text("\u4EBA\u751F\u6A21\u5757\u6807\u9898", "\u663E\u793A\u5728\u65E5\u671F\u56DE\u770B\u529F\u80FD\u4E0A\u65B9\uFF0C\u4F8B\u5982\uFF1A\u4EBA\u751F\u8FDB\u5EA6\u3001\u65F6\u95F4\u6F2B\u6E38\u3002", "lifeProgressTitle");
    this.text("\u4EBA\u751F\u6A21\u5757\u5706\u5F62\u6807\u8BB0", "\u663E\u793A 1\u20132 \u4E2A\u5B57\uFF0C\u4F8B\u5982\uFF1A\u4EBA\u3001\u5FC6\u3001\u6211\u3002", "lifeProgressMark");
    new Setting(containerEl).setName("\u5706\u5F62\u6807\u8BB0\u6587\u5B57\u989C\u8272").setDesc("\u53EA\u6539\u53D8\u5706\u5F62\u6807\u8BB0\u5185\u7684\u6587\u5B57\uFF1B\u70B9\u51FB\u53F3\u4FA7\u91CD\u7F6E\u6309\u94AE\u53EF\u6062\u590D\u8DDF\u968F\u5F53\u524D\u4E3B\u9898\u3002").addColorPicker((picker) => picker.setValue(this.plugin.settings.lifeProgressMarkColor || "#2f7187").onChange(async (value) => {
      this.plugin.settings.lifeProgressMarkColor = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    })).addExtraButton((button) => button.setIcon("rotate-ccw").setTooltip("\u6062\u590D\u8DDF\u968F\u4E3B\u9898").onClick(async () => {
      this.plugin.settings.lifeProgressMarkColor = "";
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
      this.display();
    }));
    this.text("\u5706\u5F62\u6807\u8BB0\u5B57\u4F53", "\u586B\u5199\u672C\u673A\u5DF2\u5B89\u88C5\u5B57\u4F53\u7684\u540D\u79F0\uFF1B\u9ED8\u8BA4\u4F7F\u7528\u82F9\u65B9\u7C97\u4F53\uFF0C\u7559\u7A7A\u4E5F\u4F1A\u56DE\u5230\u82F9\u65B9\u3002", "lifeProgressMarkFont");
    new Setting(containerEl).setName("\u51FA\u751F\u65E5\u671F").setDesc("\u7528\u4E8E\u663E\u793A\u5DF2\u7ECF\u8D70\u8FC7\u7684\u5929\u6570\uFF1B\u53EA\u4FDD\u5B58\u5728\u672C\u5730\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u3002").addText((input) => {
      input.inputEl.type = "date";
      input.setValue(this.plugin.settings.birthDate || "").onChange(async (value) => {
        this.plugin.settings.birthDate = value;
        await this.plugin.saveSettings();
        this.plugin.refreshViews();
      });
    });
    this.text("\u70ED\u529B\u56FE\u6807\u9898", "\u4F8B\u5982\uFF1A\u6587\u5B57\u70ED\u529B\u56FE\u3001\u5199\u4F5C\u8DB3\u8FF9\u3001\u65E5\u8BB0\u6C89\u6DC0\u3002", "heatmapTitle");
    new Setting(containerEl).setName("\u70ED\u529B\u56FE\u5468\u6570").setDesc("\u663E\u793A\u6700\u8FD1 12\u201352 \u5468\u3002").addSlider((slider) => slider.setLimits(12, 52, 1).setDynamicTooltip().setValue(Number(this.plugin.settings.heatmapWeeks) || 26).onChange(async (value) => {
      this.plugin.settings.heatmapWeeks = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    }));
    new Setting(containerEl).setName("\u65E5\u671F\u6EDA\u8F6E\u58F0\u97F3").setDesc("\u56DE\u770B\u8FC7\u53BB\u65E5\u671F\u65F6\u64AD\u653E\u8F7B\u5FAE\u7684\u672C\u5730\u523B\u5EA6\u58F0\u3002").addToggle((toggle) => toggle.setValue(this.plugin.settings.rediscoverySoundEnabled !== false).onChange(async (value) => {
      this.plugin.settings.rediscoverySoundEnabled = value;
      await this.plugin.saveSettings();
    }));
    new Setting(containerEl).setName("\u6EDA\u8F6E\u58F0\u97F3\u97F3\u91CF").setDesc("\u58F0\u97F3\u53EA\u5728\u64CD\u4F5C\u65E5\u671F\u6EDA\u8F6E\u65F6\u64AD\u653E\u3002").addSlider((slider) => slider.setLimits(0, 0.6, 0.02).setDynamicTooltip().setValue(Number.isFinite(Number(this.plugin.settings.rediscoverySoundVolume)) ? Number(this.plugin.settings.rediscoverySoundVolume) : 0.22).onChange(async (value) => {
      this.plugin.settings.rediscoverySoundVolume = value;
      await this.plugin.saveSettings();
    }));
    this.text("\u4ECA\u65E5\u968F\u7B14\u6587\u4EF6\u5939", "", "dailyFolder");
    new Setting(containerEl).setName("\u5F85\u529E\u62FE\u53D6\u6587\u4EF6\u5939").setDesc("\u7559\u7A7A\u65F6\u626B\u63CF\u6574\u4E2A\u4ED3\u5E93\uFF1B\u9700\u8981\u9650\u5236\u8303\u56F4\u65F6\uFF0C\u6BCF\u884C\u586B\u5199\u4E00\u4E2A\u6587\u4EF6\u5939\u8DEF\u5F84\uFF0C\u4E5F\u53EF\u4EE5\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694\u3002\u5305\u542B\u8FD9\u4E9B\u6587\u4EF6\u5939\u53CA\u5176\u6240\u6709\u5B50\u6587\u4EF6\u5939\u3002").addTextArea((input) => input.setPlaceholder("\u7559\u7A7A = \u6574\u4E2A\u4ED3\u5E93\n\u4F8B\u5982\uFF1A\u6BCF\u65E5\u968F\u7B14\n\u9879\u76EE").setValue(this.plugin.settings.taskFolders || "").onChange(async (value) => {
      this.plugin.settings.taskFolders = value;
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    }));
    new Setting(containerEl).setName("\u542F\u52A8\u65F6\u6253\u5F00\u4E3B\u9875").addToggle((toggle) => toggle.setValue(this.plugin.settings.autoOpen).onChange(async (value) => {
      this.plugin.settings.autoOpen = value;
      await this.plugin.saveSettings();
    }));
  }
  text(name, desc, key) {
    new Setting(this.containerEl).setName(name).setDesc(desc).addText((input) => input.setValue(String(this.plugin.settings[key] || "")).onChange(async (value) => {
      this.plugin.settings[key] = value.trim();
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    }));
  }
  renderAvatarCrop(containerEl) {
    const avatarUrl = this.plugin.resolveImage(this.plugin.settings.avatarPath);
    if (!avatarUrl) return;
    const crop = containerEl.createDiv({ cls: "ad-avatar-crop-setting" });
    const stage = crop.createDiv({ cls: "ad-avatar-crop-stage" });
    const image = stage.createEl("img", { attr: { src: avatarUrl, alt: "\u5934\u50CF\u88C1\u526A\u9884\u89C8", draggable: "false" } });
    stage.createDiv({ cls: "ad-avatar-crop-guide" });
    const controls = crop.createDiv({ cls: "ad-avatar-crop-controls" });
    controls.createEl("strong", { text: "\u8C03\u6574\u5934\u50CF\u8303\u56F4" });
    controls.createEl("span", { text: "\u5728\u9884\u89C8\u4E2D\u4E0A\u4E0B\u62D6\u52A8\u56FE\u7247\uFF0C\u6216\u4F7F\u7528\u6ED1\u6746\u5FAE\u8C03\u3002" });
    const slider = controls.createEl("input", { attr: { type: "range", min: "0", max: "100", step: "1" } });
    const centerButton = controls.createEl("button", { text: "\u6062\u590D\u5C45\u4E2D", cls: "mod-cta" });
    const savedPosition = Number(this.plugin.settings.avatarPositionY);
    let position = Number.isFinite(savedPosition) ? Math.min(100, Math.max(0, savedPosition)) : 50;
    let startY = 0;
    let startPosition = position;
    const paint = (value) => {
      position = Math.min(100, Math.max(0, Number(value) || 0));
      slider.value = String(Math.round(position));
      image.style.objectPosition = `50% ${position}%`;
    };
    const persist = async () => {
      this.plugin.settings.avatarPositionY = Math.round(position);
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    };
    paint(position);
    slider.addEventListener("input", () => paint(slider.value));
    slider.addEventListener("change", persist);
    stage.addEventListener("pointerdown", (event) => {
      startY = event.clientY;
      startPosition = position;
      stage.setPointerCapture(event.pointerId);
      stage.addClass("is-dragging");
    });
    stage.addEventListener("pointermove", (event) => {
      if (!stage.hasPointerCapture(event.pointerId)) return;
      paint(startPosition - (event.clientY - startY) / Math.max(1, stage.clientHeight) * 100);
    });
    const finishDrag = async (event) => {
      if (!stage.hasPointerCapture(event.pointerId)) return;
      stage.releasePointerCapture(event.pointerId);
      stage.removeClass("is-dragging");
      await persist();
    };
    stage.addEventListener("pointerup", finishDrag);
    stage.addEventListener("pointercancel", finishDrag);
    centerButton.addEventListener("click", async () => {
      paint(50);
      await persist();
    });
  }
};
var AlexDeskPlugin = class extends Plugin {
  async onload() {
    this.views = /* @__PURE__ */ new Set();
    this.createElasticMesh = createElasticMesh2;
    this.systemAudioStream = null;
    this.systemAudioContext = null;
    this.systemAudioAnalyser = null;
    this.systemAudioData = null;
    this.systemAudioCapturePromise = null;
    this.systemAudioUnavailable = false;
    this.systemAudioNativeProcess = null;
    this.systemAudioNativeLevel = 0;
    this.systemAudioNativeSmoothed = 0;
    this.systemAudioNativeUpdatedAt = 0;
    const saved = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
    if (!this.settings.heroImages && saved?.heroImagePath) this.settings.heroImages = saved.heroImagePath;
    this.registerView(VIEW_TYPE, (leaf) => new AlexDeskView(leaf, this));
    this.addRibbonIcon("sparkles", "\u6253\u5F00\u6BCF\u65E5\u4E13\u6CE8\u4E3B\u9875", () => this.activateView());
    this.addCommand({ id: "open-alex-desk", name: "\u6253\u5F00\u4E3B\u9875", callback: () => this.activateView() });
    this.addSettingTab(new AlexDeskSettingTab(this.app, this));
    this.registerEvent(this.app.vault.on("modify", () => this.scheduleRefresh()));
    this.registerEvent(this.app.vault.on("create", () => this.scheduleRefresh()));
    this.app.workspace.onLayoutReady(() => {
      if (this.settings.autoOpen && !this.app.workspace.getLeavesOfType(VIEW_TYPE).length) this.activateView();
    });
  }
  onunload() {
    window.clearTimeout(this.refreshTimer);
    this.stopSystemAudioCapture();
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  refreshViews() {
    this.views.forEach((view) => view.render());
  }
  scheduleRefresh() {
    window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => this.refreshViews(), 750);
  }
  async startSystemAudioCapture(allowPrompt = false) {
    if (this.settings.systemSpectrumEnabled !== true) return false;
    if (this.systemAudioAnalyser && this.systemAudioStream?.active) {
      await this.systemAudioContext?.resume?.().catch(() => {
      });
      return true;
    }
    if (this.systemAudioCapturePromise) return this.systemAudioCapturePromise;
    if (this.systemAudioUnavailable && !allowPrompt) return false;
    if (allowPrompt) this.systemAudioUnavailable = false;
    this.systemAudioCapturePromise = (async () => {
      if (await this.startNativeAudioMeter()) return true;
      let stream = null;
      let firstError = null;
      if (allowPrompt && navigator.mediaDevices?.getDisplayMedia) {
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
            systemAudio: "include",
            selfBrowserSurface: "exclude",
            surfaceSwitching: "exclude"
          });
        } catch (error) {
          firstError = error;
        }
      }
      if (stream && !stream.getAudioTracks?.().length) {
        stream.getTracks?.().forEach((track) => track.stop());
        stream = null;
      }
      try {
        if (!stream) {
          const electron = typeof require === "function" ? require("electron") : null;
          const sources = await electron?.desktopCapturer?.getSources?.({ types: ["screen"] });
          const source = sources?.[0];
          if (source && navigator.mediaDevices?.getUserMedia) {
            stream = await navigator.mediaDevices.getUserMedia({
              audio: { mandatory: { chromeMediaSource: "desktop" } },
              video: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: source.id, maxFrameRate: 1 } }
            });
          }
        }
      } catch (error) {
        firstError || (firstError = error);
      }
      if (!stream?.getAudioTracks?.().length) {
        stream?.getTracks?.().forEach((track) => track.stop());
        throw firstError || new Error("No system audio track was provided");
      }
      stream.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContextClass();
      const analyser = context.createAnalyser();
      analyser.fftSize = 128;
      analyser.minDecibels = -82;
      analyser.maxDecibels = -18;
      analyser.smoothingTimeConstant = 0.78;
      context.createMediaStreamSource(stream).connect(analyser);
      this.systemAudioStream = stream;
      this.systemAudioContext = context;
      this.systemAudioAnalyser = analyser;
      this.systemAudioData = new Uint8Array(analyser.frequencyBinCount);
      stream.getTracks().forEach((track) => track.addEventListener("ended", () => this.stopSystemAudioCapture(), { once: true }));
      await context.resume().catch(() => {
      });
      this.systemAudioUnavailable = false;
      return true;
    })().catch((error) => {
      console.warn("[\u6BCF\u65E5\u4E13\u6CE8\u4E3B\u9875] \u7CFB\u7EDF\u97F3\u9891\u9891\u8C31\u4E0D\u53EF\u7528", error);
      this.systemAudioUnavailable = true;
      this.stopSystemAudioCapture();
      if (allowPrompt) new Notice("\u5F53\u524D Obsidian \u6CA1\u6709\u63D0\u4F9B\u53EF\u7528\u7684\u7CFB\u7EDF\u97F3\u9891\u58F0\u9053\u3002\u8BF7\u786E\u8BA4\u5171\u4EAB\u7A97\u53E3\u4E2D\u52FE\u9009\u4E86\u7CFB\u7EDF\u97F3\u9891\u3002", 6500);
      return false;
    }).finally(() => {
      this.systemAudioCapturePromise = null;
    });
    return this.systemAudioCapturePromise;
  }
  readSystemSpectrum(count = 42) {
    if (this.systemAudioNativeProcess && Date.now() - this.systemAudioNativeUpdatedAt < 800) {
      const thresholdSetting = Math.max(0, Math.min(40, Number(this.settings.systemSpectrumThreshold) || 0));
      const threshold = thresholdSetting / 1e3;
      const peak = Math.max(0, this.systemAudioNativeLevel - threshold);
      this.systemAudioNativeSmoothed = this.systemAudioNativeSmoothed * 0.62 + peak * 0.38;
      const responseGain = 4.4 - thresholdSetting * 0.045;
      const energy = Math.min(1, Math.pow(this.systemAudioNativeSmoothed * responseGain, 0.66));
      const phase = performance.now() / 118;
      return Array.from({ length: count }, (_, index) => {
        const position = count > 1 ? index / (count - 1) : 0.5;
        const centerWeight = 0.74 + (1 - Math.abs(position * 2 - 1)) * 0.26;
        const wave = 0.34 + Math.abs(Math.sin(phase * (0.72 + index % 6 * 0.018) + index * 0.67)) * 0.66;
        const ripple = 0.78 + Math.abs(Math.cos(phase * 0.43 - index * 0.31)) * 0.22;
        return energy * centerWeight * wave * ripple;
      });
    }
    const analyser = this.systemAudioAnalyser;
    const data = this.systemAudioData;
    if (!analyser || !data || !this.systemAudioStream?.active) return null;
    analyser.getByteFrequencyData(data);
    const half = Math.ceil(count / 2);
    const usableBins = Math.max(half, Math.floor(data.length * 0.72));
    const halfLevels = Array.from({ length: half }, (_, index) => {
      const start = Math.floor(index / half * usableBins);
      const end = Math.max(start + 1, Math.floor((index + 1) / half * usableBins));
      let peak = 0;
      for (let bin = start; bin < end; bin += 1) peak = Math.max(peak, data[bin] || 0);
      const normalized = Math.max(0, peak / 255 - 0.025);
      return Math.min(1, Math.pow(normalized * 1.55, 0.82));
    });
    return Array.from({ length: count }, (_, index) => {
      const mirroredIndex = index < count / 2 ? half - 1 - index : index - Math.floor(count / 2);
      return halfLevels[Math.min(half - 1, mirroredIndex)] || 0;
    });
  }
  isSystemAudioAudible(levels) {
    if (this.systemAudioNativeProcess && Date.now() - this.systemAudioNativeUpdatedAt < 800) {
      return this.systemAudioNativeLevel > 4e-3;
    }
    return Array.isArray(levels) && levels.some((level) => level > 0.02);
  }
  stopSystemAudioCapture() {
    const nativeProcess = this.systemAudioNativeProcess;
    this.systemAudioNativeProcess = null;
    this.systemAudioNativeLevel = 0;
    this.systemAudioNativeSmoothed = 0;
    this.systemAudioNativeUpdatedAt = 0;
    nativeProcess?.kill?.();
    const stream = this.systemAudioStream;
    this.systemAudioStream = null;
    this.systemAudioAnalyser = null;
    this.systemAudioData = null;
    stream?.getTracks?.().forEach((track) => track.stop());
    const context = this.systemAudioContext;
    this.systemAudioContext = null;
    context?.close?.().catch(() => {
    });
  }
  async startNativeAudioMeter() {
    if (process.platform !== "win32") return false;
    if (this.systemAudioNativeProcess && Date.now() - this.systemAudioNativeUpdatedAt < 800) return true;
    this.systemAudioNativeProcess?.kill?.();
    this.systemAudioNativeProcess = null;
    const encodedScript = Buffer.from(AUDIO_METER_SCRIPT, "utf16le").toString("base64");
    return new Promise((resolve) => {
      let settled = false;
      let buffer = "";
      let child;
      const finish = (connected) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        if (!connected) child?.kill?.();
        resolve(connected);
      };
      const timeout = window.setTimeout(() => finish(false), 3500);
      try {
        child = spawn("powershell.exe", [
          "-NoLogo",
          "-NoProfile",
          "-NonInteractive",
          "-EncodedCommand",
          encodedScript
        ], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
        this.systemAudioNativeProcess = child;
        child.stderr.on("data", () => {
        });
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", (chunk) => {
          buffer += chunk;
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || "";
          lines.forEach((line) => {
            const value = Number(line.trim());
            if (!Number.isFinite(value)) return;
            this.systemAudioNativeLevel = Math.max(0, Math.min(1, value));
            this.systemAudioNativeUpdatedAt = Date.now();
            finish(true);
          });
        });
        child.on("error", () => finish(false));
        child.on("exit", () => {
          if (this.systemAudioNativeProcess === child) this.systemAudioNativeProcess = null;
          finish(false);
        });
      } catch (_) {
        finish(false);
      }
    });
  }
  async activateView() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getLeaf("tab");
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }
  filesIn(folder) {
    const prefix = normalizePath(folder || "").replace(/\/$/, "");
    if (!prefix) return [];
    return this.app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(`${prefix}/`));
  }
  taskFiles() {
    const allFiles = this.app.vault.getMarkdownFiles();
    const folders = String(this.settings.taskFolders || "").split(/\r?\n|,/).map((folder) => normalizePath(folder.trim()).replace(/^\.\/?/, "").replace(/\/$/, "")).filter(Boolean);
    if (!folders.length) return allFiles;
    return allFiles.filter((file) => folders.some((folder) => file.path === folder || file.path.startsWith(`${folder}/`)));
  }
  async read(file) {
    try {
      return await this.app.vault.cachedRead(file);
    } catch (_) {
      return "";
    }
  }
  resolveImage(path) {
    if (!path) return "";
    const file = this.app.vault.getAbstractFileByPath(normalizePath(path.trim()));
    return file instanceof TFile ? this.app.vault.getResourcePath(file) : "";
  }
  resolveHeroImages(noteEntries) {
    return String(this.settings.heroImages || "").split(/\r?\n|,/).map((path) => normalizePath(path.trim())).filter(Boolean).map((path) => this.app.vault.getAbstractFileByPath(path)).filter((file) => file instanceof TFile).map((file) => {
      const noteEntry = noteEntries.find((entry) => entry.source.includes(file.path) || entry.source.includes(file.name) || entry.source.includes(file.basename));
      const frontmatter = noteEntry ? this.app.metadataCache.getFileCache(noteEntry.file)?.frontmatter : null;
      const rawDate = frontmatter?.date || frontmatter?.created || frontmatter?.createdAt;
      let dateMoment = rawDate ? window.moment(rawDate) : null;
      if (!dateMoment?.isValid()) {
        const basenameDate = noteEntry?.file.basename.match(/\d{4}-\d{2}-\d{2}/)?.[0];
        dateMoment = basenameDate ? window.moment(basenameDate, "YYYY-MM-DD") : window.moment(file.stat.ctime);
      }
      return {
        path: file.path,
        name: file.basename,
        url: this.app.vault.getResourcePath(file),
        noteFile: noteEntry?.file || null,
        date: dateMoment.format("YYYY\u5E74M\u6708D\u65E5")
      };
    });
  }
  async collectData() {
    const now = window.moment();
    const todayName = now.format("YYYY-MM-DD");
    const dailyFiles = this.filesIn(this.settings.dailyFolder);
    const todayFile = dailyFiles.find((file) => file.basename === todayName) || dailyFiles.find((file) => file.basename.includes(now.format("YYYY\u5E74MM\u6708DD\u65E5")));
    const todaySource = todayFile ? await this.read(todayFile) : "";
    const allFiles = this.app.vault.getMarkdownFiles();
    const allSources = await Promise.all(allFiles.map((file) => this.read(file)));
    const allEntries = allFiles.map((file, index) => ({
      file,
      source: allSources[index],
      characters: countCharacters(allSources[index])
    }));
    const totalCharacters = allEntries.reduce((sum, entry) => sum + entry.characters, 0);
    const currentMonthKey = now.format("YYYY-MM");
    const monthEntries = allEntries.filter((entry) => window.moment(entry.file.stat.mtime).format("YYYY-MM") === currentMonthKey);
    const monthUpdates = monthEntries.length;
    const dailyEntries = await Promise.all(dailyFiles.map(async (file) => {
      const source = await this.read(file);
      return {
        file,
        key: file.basename.match(/^\d{4}-\d{2}-\d{2}$/) ? file.basename : "",
        characters: countCharacters(source),
        preview: excerpt(source, 96)
      };
    }));
    const dailyMap = new Map(dailyEntries.filter((entry) => entry.key).map((entry) => [entry.key, entry]));
    const datedDailyEntries = dailyEntries.filter((entry) => entry.key).sort((a, b) => a.key.localeCompare(b.key));
    const earliestDailyMoment = datedDailyEntries.length ? window.moment(datedDailyEntries[0].key, "YYYY-MM-DD", true) : now.clone().startOf("day");
    const configuredBirth = window.moment(String(this.settings.birthDate || ""), "YYYY-MM-DD", true);
    const hasBirthDate = configuredBirth.isValid() && !configuredBirth.isAfter(now, "day");
    const lifeStart = hasBirthDate ? configuredBirth.clone().startOf("day") : earliestDailyMoment.clone().startOf("day");
    const livedDays = Math.max(0, now.clone().startOf("day").diff(lifeStart, "days"));
    const journalSpanDays = Math.max(1, now.clone().startOf("day").diff(earliestDailyMoment, "days") + 1);
    const lifeProgress = {
      hasBirthDate,
      livedDays,
      journalSpanDays,
      maxOffset: hasBirthDate ? Math.max(1, livedDays) : Math.max(365, journalSpanDays - 1),
      noteDays: dailyMap
    };
    const currentMonthDaily = dailyEntries.filter((entry) => entry.key.startsWith(currentMonthKey) && entry.characters);
    const heatmapWeeks = Math.max(12, Math.min(52, Number(this.settings.heatmapWeeks) || 26));
    const heatmapStart = now.clone().startOf("isoWeek").subtract(heatmapWeeks - 1, "weeks");
    const heatmapDays = Array.from({ length: heatmapWeeks * 7 }, (_, index) => {
      const moment = heatmapStart.clone().add(index, "days");
      const key = moment.format("YYYY-MM-DD");
      const entry = dailyMap.get(key);
      return {
        label: moment.format("YYYY\u5E74M\u6708D\u65E5"),
        characters: entry?.characters || 0,
        preview: entry?.preview || "",
        isToday: key === now.format("YYYY-MM-DD"),
        dailyFile: entry?.file
      };
    });
    const monthLabels = [];
    let lastMonth = "";
    for (let column = 0; column < heatmapWeeks; column += 1) {
      const weekMoment = heatmapStart.clone().add(column, "weeks");
      const monthKey = weekMoment.format("YYYY-MM");
      if (monthKey !== lastMonth) {
        monthLabels.push({ column, label: `${weekMoment.month() + 1}\u6708` });
        lastMonth = monthKey;
      }
    }
    const heatmapActive = heatmapDays.filter((day) => day.characters);
    const bestHeatmapDay = heatmapActive.reduce(
      (best, day) => day.characters > best.characters ? day : best,
      { characters: 0, label: "\u6682\u65E0\u8BB0\u5F55", preview: "", dailyFile: null }
    );
    const todayCache = todayFile ? this.app.metadataCache.getFileCache(todayFile) : null;
    const linkCandidates = [...todayCache?.links || [], ...todayCache?.embeds || []];
    const todayRelated = [];
    const seenRelated = /* @__PURE__ */ new Set();
    linkCandidates.forEach((link) => {
      const target = this.app.metadataCache.getFirstLinkpathDest(link.link, todayFile?.path || "");
      if (target instanceof TFile && target.extension === "md" && target.path !== todayFile?.path && !seenRelated.has(target.path)) {
        seenRelated.add(target.path);
        todayRelated.push(target);
      }
    });
    const sourceItem = (entry, meta) => ({
      file: entry.file,
      label: entry.file.basename,
      meta
    });
    const byModified = [...allEntries].sort((a, b) => b.file.stat.mtime - a.file.stat.mtime);
    const byCharacters = [...allEntries].sort((a, b) => b.characters - a.characters);
    const taskFilePaths = new Set(this.taskFiles().map((file) => file.path));
    const taskEntries = allEntries.filter((entry) => taskFilePaths.has(entry.file.path)).flatMap((entry) => String(entry.source || "").split(/\r?\n/).map((line, lineIndex) => {
      const match = line.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.+)$/);
      return match ? {
        file: entry.file,
        text: match[2].trim(),
        rawLine: line,
        lineIndex,
        completed: match[1].toLowerCase() === "x",
        modified: entry.file.stat.mtime
      } : null;
    }).filter(Boolean)).sort((a, b) => b.modified - a.modified);
    const taskQueue = {
      pending: taskEntries.filter((task) => !task.completed),
      completed: taskEntries.filter((task) => task.completed).slice(0, 5),
      completedTotal: taskEntries.filter((task) => task.completed).length,
      sourceCount: new Set(taskEntries.map((task) => task.file.path)).size
    };
    const monthCharacters = currentMonthDaily.reduce((sum, entry) => sum + entry.characters, 0);
    const todayCharacters = countCharacters(todaySource);
    const insightMetrics = {
      notes: {
        icon: "file-text",
        label: "\u5168\u5E93\u7B14\u8BB0",
        value: allFiles.length,
        detailTitle: "\u6784\u6210\u7B14\u8BB0\u603B\u6570\u7684\u6700\u8FD1\u6587\u4EF6",
        items: byModified.map((entry) => sourceItem(entry, `\u66F4\u65B0\u4E8E ${window.moment(entry.file.stat.mtime).format("M\u6708D\u65E5 HH:mm")}`))
      },
      characters: {
        icon: "text",
        label: "\u5168\u5E93\u5B57\u6570",
        value: totalCharacters,
        detailTitle: "\u5B57\u6570\u6700\u591A\u7684\u7B14\u8BB0",
        items: byCharacters.map((entry) => sourceItem(entry, `${compactNumber(entry.characters)} \u5B57`))
      },
      monthUpdates: {
        icon: "calendar-days",
        label: "\u672C\u6708\u6709\u6539\u52A8\u7B14\u8BB0",
        value: monthUpdates,
        detailTitle: "\u672C\u6708\u66F4\u65B0\u8FC7\u7684\u7B14\u8BB0",
        items: monthEntries.sort((a, b) => b.file.stat.mtime - a.file.stat.mtime).map((entry) => sourceItem(entry, window.moment(entry.file.stat.mtime).format("M\u6708D\u65E5 HH:mm")))
      },
      activeDays: {
        icon: "flame",
        label: "\u672C\u6708\u65E5\u8BB0\u5929\u6570",
        value: currentMonthDaily.length,
        detailTitle: "\u672C\u6708\u5199\u4E0B\u6587\u5B57\u7684\u65E5\u8BB0",
        items: currentMonthDaily.sort((a, b) => b.key.localeCompare(a.key)).map((entry) => sourceItem(entry, `${entry.key} \xB7 ${compactNumber(entry.characters)} \u5B57`))
      },
      todayCharacters: {
        icon: "pen-line",
        label: "\u4ECA\u65E5\u65E5\u8BB0\u5B57\u6570",
        value: todayCharacters,
        detailTitle: "\u4ECA\u5929\u7684\u6587\u5B57",
        items: todayFile ? [sourceItem({ file: todayFile }, `${compactNumber(todayCharacters)} \u5B57`)] : []
      },
      monthCharacters: {
        icon: "chart-no-axes-column",
        label: "\u672C\u6708\u65E5\u8BB0\u5B57\u6570",
        value: monthCharacters,
        detailTitle: "\u672C\u6708\u6BCF\u65E5\u6587\u5B57",
        items: currentMonthDaily.sort((a, b) => b.key.localeCompare(a.key)).map((entry) => sourceItem(entry, `${entry.key} \xB7 ${compactNumber(entry.characters)} \u5B57`))
      }
    };
    return {
      greeting: greeting(now.hour()),
      dateLabel: now.format("YYYY\u5E74M\u6708D\u65E5"),
      weekday: `\u661F\u671F${"\u65E5\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D"[now.day()]}`,
      avatarUrl: this.resolveImage(this.settings.avatarPath),
      heroImages: this.resolveHeroImages(allEntries),
      todayFile,
      todayMarkdown: todaySource,
      todayCharacters,
      todayRelated,
      lifeProgress,
      totalNotes: allFiles.length,
      totalCharacters,
      monthUpdates,
      insightMetrics,
      taskQueue,
      heatmap: {
        weeks: heatmapWeeks,
        days: heatmapDays,
        monthLabels,
        activeDays: heatmapActive.length,
        totalCharacters: heatmapActive.reduce((sum, day) => sum + day.characters, 0),
        averageCharacters: heatmapActive.length ? Math.round(heatmapActive.reduce((sum, day) => sum + day.characters, 0) / heatmapActive.length) : 0,
        bestDay: bestHeatmapDay
      }
    };
  }
  async ensureFolder(folder) {
    const normalized = normalizePath(folder);
    if (!this.app.vault.getAbstractFileByPath(normalized)) await this.app.vault.createFolder(normalized);
    return normalized;
  }
  async toggleTask(task) {
    await this.app.vault.process(task.file, (source) => {
      const eol = source.includes("\r\n") ? "\r\n" : "\n";
      const lines = source.split(/\r?\n/);
      let index = task.lineIndex;
      if (lines[index] !== task.rawLine) index = lines.findIndex((line) => line === task.rawLine);
      if (index < 0 || !/^\s*[-*+]\s+\[[ xX]\]\s+/.test(lines[index])) {
        throw new Error("Task line could not be located");
      }
      lines[index] = task.completed ? lines[index].replace(/\[[xX]\]/, "[ ]") : lines[index].replace(/\[ \]/, "[x]");
      return lines.join(eol);
    });
    this.refreshViews();
  }
  async saveAvatar(sourceFile) {
    const folder = await this.ensureFolder("Image");
    const rawExtension = sourceFile.name.split(".").pop()?.toLowerCase() || "png";
    const extension = ["png", "jpg", "jpeg", "webp", "gif"].includes(rawExtension) ? rawExtension : "png";
    const path = normalizePath(`${folder}/alex-desk-avatar.${extension}`);
    const binary = await sourceFile.arrayBuffer();
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof TFile) await this.app.vault.modifyBinary(existing, binary);
    else await this.app.vault.createBinary(path, binary);
    this.settings.avatarPath = path;
    this.settings.avatarPositionY = 50;
    await this.saveSettings();
    this.refreshViews();
    new Notice("\u5934\u50CF\u5DF2\u4FDD\u5B58\u5230\u672C\u5730\u4ED3\u5E93\u3002");
  }
  async openToday() {
    const now = window.moment();
    const folder = await this.ensureFolder(this.settings.dailyFolder || "\u4ECA\u65E5\u968F\u7B14");
    const path = normalizePath(`${folder}/${now.format("YYYY-MM-DD")}.md`);
    let file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      file = await this.app.vault.create(path, `---
date: ${now.format("YYYY-MM-DD")}
tags:
  - \u6BCF\u65E5\u968F\u7B14
---

# ${now.format("YYYY\u5E74M\u6708D\u65E5")}

`);
    }
    await this.openFile(file);
  }
  async openFile(file) {
    if (!(file instanceof TFile)) return;
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.openFile(file);
    this.app.workspace.setActiveLeaf(leaf, { focus: true });
  }
};
module.exports = AlexDeskPlugin;
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
