export const PixelWidth = 800;
export const PixelHeight = 600;

export const Width = 8;
export const Height = 6;

const xSlope = (PixelWidth/Width);
const ySlope = -(PixelHeight/Height);

export class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    multiply(factor) {
        return new Vector(this.x * factor,this.y * factor);
    }

    get orthogonal() {
        return new Vector(-this.y,this.x);
    }

    get screen() {
        return new Vector(xSlope * this.x,ySlope * this.y + PixelHeight);
    }
}