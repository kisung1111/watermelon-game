import {Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS } from "./fruits";

//게임 틀 
const engine = Engine.create();
const render = Render.create({
  engine, 
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
}); 

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true, 
    render: { fillStyle: "#E6B143" }
  })

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true, 
  render: { fillStyle: "#E6B143" }
})

const groundWall = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true, 
  render: { fillStyle: "#E6B143" }
})

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isSensor: true,
  isStatic: true,
  render: { fillStyle: "#E6B143" }
})

World.add(world, [rightWall, leftWall, groundWall, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;

function addFruit() {
  var index = Math.floor(Math.random() * 6);
  var fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` }
    },
    restitution: 0.2
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}

window.onkeydown = (event) => {
  if(disableAction) { 
    return;
  }
  
  switch(event.code) {
    case "KeyA":
      if(currentBody.position.x - currentFruit.radius > 30)
      Body.setPosition(currentBody, {
      x: currentBody.position.x - 10,
      y: currentBody.position.y,
    });
    break;

    case "KeyD":
      if(currentBody.position.x - currentFruit.radius < 520)
      Body.setPosition(currentBody, {
      x: currentBody.position.x + 10,
      y: currentBody.position.y,
    });
    break;

    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 800);
      
      break;
  }
}

Events.on(engine,"collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if(collision.bodyA.index === collision.bodyB.index){
      const index = collision.bodyA.index;

      if(index === FRUITS.length - 1){
        return;
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index + 1 ];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
          sprite: { texture: `${newFruit.name}.png` }
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);
    }

    if(
      !disableAction && 
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine"))
    alert("Game over");
  });
});

addFruit();
//how to enter the website through the terminal. 
//run operator : in terminal 
//1. npm install matter-js
//2. npum run dev
//3. then the local host comes out

