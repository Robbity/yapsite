import React, { useEffect, useRef } from 'react';
import './App.css';
import { Engine, Render, World, Bodies } from 'matter-js';
import Angry from './assets/SVG/Angry.svg';
import Happy from './assets/SVG/Happy.svg';
import Neutral from './assets/SVG/Neutral.svg';
import Sad from './assets/SVG/Sad.svg';
import Scared from './assets/SVG/Scared.svg';

const emotions = [Angry, Happy, Neutral, Sad, Scared];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomRotation() {
  return Math.floor(Math.random() * 360);
}

function App() {
  const sceneRef = useRef(null);
  const engine = useRef(Engine.create());

  useEffect(() => {
    const { current: scene } = sceneRef;
    const { current: engineInstance } = engine;

    const render = Render.create({
      element: scene,
      engine: engineInstance,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Create the borders: floor, left wall, and right wall
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true });
    const leftWall = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
    const rightWall = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });

    World.add(engineInstance.world, [ground, leftWall, rightWall]);

    const size = 100;

    function addRandomEmotion() {
      const Emotion = emotions[getRandomInt(emotions.length)];
      const x = Math.random() * window.innerWidth;
      const y = -size;
      const body = Bodies.rectangle(x, y, size, size, {
        render: {
          sprite: {
            texture: Emotion,
            xScale: size / 100,
            yScale: size / 100,
          },
        },
      });
      World.add(engineInstance.world, body);
    }

    function scheduleNextEmotion() {
      const randomDelay = getRandomInt(2000) + 1000; // Random delay between 1 to 3 seconds
      setTimeout(() => {
        addRandomEmotion();
        scheduleNextEmotion();
      }, randomDelay);
    }

    scheduleNextEmotion();

    Engine.run(engineInstance);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engineInstance.world);
      Engine.clear(engineInstance);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div className="App">
      <div ref={sceneRef} className="scene" />
      <div className="centerText">
        <div className="yapyap">yapyap</div>
        <div className="subtext">under construction!</div>
      </div>
    </div>
  );
}

export default App;
