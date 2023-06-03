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
    update() {
        this.render();
    }
    render() {
        let status = this.status;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}

export {
    Player
}