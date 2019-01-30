import * as PIXI from 'pixi.js';
import { circlePolygon } from 'intersects';

import { Keyboard } from './keyboard';
import { Vector } from './maths';
import { PhysicsObject } from './physics-object';
import images from './assets/*.png';

export class Plane extends PhysicsObject {
    constructor(stage, obstacleManager) {
        const startingPosition = new Vector(4,3);
        super(startingPosition, true, 1);

        this.sprite = PIXI.Sprite.fromImage(images['planeRed1']);
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.position.x = this.position.screen.x;        
        this.sprite.position.y = this.position.screen.y;

        this.score = 0;
        this.text = new PIXI.Text(`Score: ${this.score}`);
        this.text.x = 50;
        this.text.y = 50;
        stage.addChild(this.text);

        stage.addChild(this.sprite);
        
        this.spacebar = new Keyboard(" ");

        this.obstacleManager = obstacleManager;
    }

    tick(delta) {
        if(this.spacebar.pressed) {
            this.velocity = new Vector(0,0);
            super.addForce(new Vector(0,150));
        }

        super.tick(delta);

        if(this.position.y < 0) {
            this.velocity = new Vector(0,0);
            this.position = new Vector(4,0);
            this.score = 0;
        }

        this.checkObstacles();

        this.text.text = `Score: ${this.score}`;

        this.sprite.position.x = this.position.screen.x;
        this.sprite.position.y = this.position.screen.y;

        this.spacebar.tick();
    }

    checkObstacles() {
        this.obstacleManager.obstacles.filter(o => !o.passedPlayer).forEach(o=> {
            const obstacleRight = o.sprite.getBounds().x + o.sprite.getBounds().width;
            const ourLeft = this.sprite.getBounds().x;
            if(ourLeft > obstacleRight) {
                this.score += 1;
                o.passedPlayer = true;
            }

            if(circlePolygon(this.sprite.position.x,this.sprite.position.y,this.sprite.width/2,o.points)) {
                this.score = 0;
            }
        });  
    }
}
