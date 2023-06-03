import { AcGameObject } from "../ac_game_object/base.js";

class Player extends AcGameObject {
    constructor(root, info) {
        super();
        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;
        this.vx = 0;
        this.vy = 0;
        this.speedx = 400;
        this.speedy = -1000;
        this.gravity = 50;
        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;
        this.status = 3;
        this.animations = new Map();
        this.frame_current_cnt = 0;

    }
    start() {

    }
    update_move() {
        this.vy += this.gravity;
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if (this.status === 3) this.status = 0;
        }
    }
    update_control() {
        let a, w, d, space;
        if (this.id === 0) {
            a = this.pressed_keys.has('a');
            w = this.pressed_keys.has('w');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            a = this.pressed_keys.has('ArrowLeft');
            w = this.pressed_keys.has('ArrowUp');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }
        if (this.status === 0 || this.status === 1) {
            if (w) {
                if (d) {
                    this.vx += this.speedx;
                } else if (a) {
                    this.vx -= this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy += this.speedy;
                this.status = 3;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else {
                this.status = 0;
                this.vx = 0;
            }
        }

    }
    update() {
        this.update_control();
        this.update_move();
        this.render();
    }
    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}

export {
    Player
}