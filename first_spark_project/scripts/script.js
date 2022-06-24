/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

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

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

(async function () {
  // Enables async/await in JS [part 1]
  const Materials = require("Materials");
  const Shaders = require("Shaders");
  const Textures = require("Textures");
  const [cameraTexture, material0] = await Promise.all([
    Textures.findFirst("cameraTexture0"),
    Materials.findFirst("material0"),
  ]);

  function main() {
    const uvs = Shaders.vertexAttribute({
      variableName: Shaders.VertexAttribute.TEX_COORDS,
    });
    const ct = Reactive.mul(Time.ms, 0.001);
    const curve = Reactive.abs(Reactive.sin(ct));

    const color = Shaders.textureSampler(cameraTexture.signal, uvs);
    const modulationColor = Reactive.pack4(curve, 0, 0, 1);
    //Diagnostics.watch("curve", curve);
    const finalColor = Reactive.mul(color, modulationColor);
    const textureSlot = Shaders.DefaultMaterialTextures.DIFFUSE;
    material0.setTextureSlot(textureSlot, finalColor);
  }
  main();
  // To access scene objects
  // const [directionalLight] = await Promise.all([
  //   Scene.root.findFirst('directionalLight0')
  // ]);

  // To access class properties
  // const directionalLightIntensity = directionalLight.intensity;

  // To log messages to the console
  // Diagnostics.log('Console message logged from the script.');
})(); // Enables async/await in JS [part 2]
