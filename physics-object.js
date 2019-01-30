import { Vector } from './maths';

export class PhysicsObject {
    constructor(initialPosition, hasGravity, mass) {              
        this.velocity = new Vector(0,0);
        this.position = initialPosition;        
        this.gravityForce = hasGravity ? new Vector(0, mass * -9.81) : new Vector(0,0);
        this.mass = mass;
        this.forces = [];
    }

    addForce(force) {
        this.forces.push(force);
    }

    tick(delta) {
        let totalForce = this.forces.reduce((agg,current) => agg.add(current), this.gravityForce);
        const accelleration = totalForce.multiply(1/this.mass);
        this.velocity = this.velocity.add(accelleration.multiply(delta));
        this.position = this.position.add(this.velocity.multiply(delta));

        this.forces = [];
    }
}