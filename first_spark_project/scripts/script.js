/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

import { pack4 } from "Reactive";

//import { mod } from "Reactive";

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// Spark AR Studio extension for VS Code - https://fb.me/spark-vscode-plugin
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

// How to load in modules
const Scene = require("Scene");

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require("Diagnostics");
const Time = require("Time");
const Reactive = require("Reactive");
const Materials = require("Materials");
const Shaders = require("Shaders");
const Textures = require("Textures");

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

(async function () {
  const [cameraTexture, material0] = await Promise.all([
    Textures.findFirst("cameraTexture0"),
    Materials.findFirst("material0"),
  ]);

  function luminance(color) {
    return Reactive.dot(color, Reactive.pack4(0.2125, 0.7154, 0.721, 0));
  }

  function modulate(time, lum) {
    const ct = Reactive.mul(time, 0.001);
    const curve = Reactive.abs(Reactive.sin(ct));
    const modulationColor = Reactive.pack4(curve, 0, 0, 1);
    const lum4 = Reactive.pack4(lum, lum, lum, 1);
    const finalModulation = Reactive.add(lum4, modulationColor);
    return finalModulation;
  }

  function main() {
    const uvs = Shaders.vertexAttribute({
      variableName: Shaders.VertexAttribute.TEX_COORDS,
    });
    const color = Shaders.textureSampler(cameraTexture.signal, uvs);
    const lum = luminance(color);
    const modulationColor = modulate(Time.ms, lum);
    const finalColor = Reactive.mul(color, modulationColor);
    const textureSlot = Shaders.DefaultMaterialTextures.DIFFUSE;
    material0.setTextureSlot(textureSlot, finalColor);
  }
  main();
})();
