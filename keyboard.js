export class Keyboard {
    constructor(key) {
        this.pressed = false;
        window.addEventListener("keyup",this.listener.bind(this));
    }

    listener() {
        this.pressed = true;
    }

    tick() {
        this.pressed = false;
    }
}