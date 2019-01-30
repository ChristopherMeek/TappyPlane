import * as PIXI from 'pixi.js';
import { Plane } from './plane';
import { PixelWidth , PixelHeight } from './maths';
import { Obstacles } from './obstacles';

class TappyPlane {
    constructor(width, height) {
        this.gameObjects = [];
        this.app = new PIXI.Application(width,height, {backgroundColor: 0x1099bb });
        document.body.appendChild(this.app.view);

        this.populateStage();
    }

    populateStage() {        
        const obstacles = new Obstacles(this.app.stage, 1);
        this.gameObjects.push(obstacles);
        this.gameObjects.push(new Plane(this.app.stage, obstacles));
    }

    run() {
        this.app.ticker.add(this.tick.bind(this));
    }

    tick(delta) {
        this.gameObjects.forEach(o=>o.tick(delta/60));
    }
}

const game = new TappyPlane(PixelWidth,PixelHeight);
game.run();