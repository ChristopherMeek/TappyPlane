import * as PIXI from 'pixi.js';
import { Vector } from "./maths";
import images from './assets/*.png';
import Chance from 'chance';

const chance = new Chance();

const upCollision = [
    new Vector(-54,0),
    new Vector(12,-239),
    new Vector(54,0)
]

const downCollision = [
    new Vector(-54,0),
    new Vector(54,0),
    new Vector(12,239)    
]

class Direction {
    static Up = new Direction(new Vector(8,0), new Vector(0.5,1), images['rockIce'], upCollision);
    static Down = new Direction(new Vector(8,6), new Vector(0.5,0), images['rockIceDown'], downCollision);
    
    constructor(position, anchor, imageUrl, collision) {
        this.anchor = anchor;
        this.position = position;        
        this.imageUrl = imageUrl;
        this.collision = collision;
    }

    switch() {
        return (this === Direction.Up) ? Direction.Down : Direction.Up;
    }
}

export class Obstacles {
    constructor(stage, timeBetweenObstacles) {
        this.stage = stage;
        this.time = 0;
        this.timeBetweenObstacles = timeBetweenObstacles;
        this.obstacles = [];
        this.direction = Direction.Up;
    }

    tick(delta) {
        this.time += delta;
        if(this.time > chance.floating({min:this.timeBetweenObstacles - 0.2,max:this.timeBetweenObstacles + 0.5})  ) {
            this.spawnObstacle();
        }

        this.obstacles.forEach(o=> {
            o.tick(delta);
            if(o.sprite.position.x < 0) this.despawn(o);
        });
    }

    spawnObstacle() {
        this.obstacles.push(new Obstacle(this.stage,this.direction));
        this.time = 0;
        this.direction = this.direction.switch();
    }

    despawn(obstacle) {
        this.stage.removeChild(obstacle.sprite);
        var idx = this.obstacles.indexOf(obstacle);
        this.obstacles.splice(idx,1);
    }
}

const obstacleSpeed = 140;

class Obstacle {
    constructor(stage, direction) {
        this.sprite = PIXI.Sprite.fromImage(direction.imageUrl);
        this.sprite.anchor.set(direction.anchor.x,direction.anchor.y);
        this.sprite.position.x = direction.position.screen.x;
        this.sprite.position.y = direction.position.screen.y;
        stage.addChild(this.sprite);

        this.debug = new PIXI.Graphics();
        stage.addChild(this.debug);

        this.passedPlayer = false;
        this.collisionTemplate = direction.collision;
    }

    tick(delta) {
        this.sprite.position.x -= delta * obstacleSpeed;        
    }

    drawDebug() {
        this.debug.clear();
        this.debug.lineStyle(2,0xFF00FF,1);

        const points = this.points;

        this.debug.moveTo(points[0],points[1]);
        this.debug.lineTo(points[2],points[3]);
        this.debug.lineTo(points[4],points[5]);
        this.debug.lineTo(points[0],points[1]);
    }
    
    get points() {
        return [this.sprite.position.x + this.collisionTemplate[0].x, this.sprite.position.y + this.collisionTemplate[0].y,
        this.sprite.position.x + this.collisionTemplate[1].x, this.sprite.position.y + this.collisionTemplate[1].y,
        this.sprite.position.x + this.collisionTemplate[2].x, this.sprite.position.y + this.collisionTemplate[2].y];
    }
}