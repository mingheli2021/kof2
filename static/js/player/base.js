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
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
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
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
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
    update_direction() {
        if (this.status === 6) return;
        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }
    is_collision(r1, r2) {
        console.log(r1.x1, r1.x2, r2.x1, r2.x2);
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2)) {
            return false;
        }
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2)) {
            return false;
        }
        return true;
    }
    is_attack() {
        if (this.status === 6) return;
        this.status = 5;
        this.frame_current_cnt = 0;

    }
    update_attack() {
        if (this.status === 4) {
            let me = this, you = this.root.players[1 - this.id];
            if (this.frame_current_cnt === 18 && me.id === 0 || this.frame_current_cnt === 7 && me.id === 1) {
                let r1;
                if (this.direction > 0) {
                    r1 = {
                        x1: me.x + 120,
                        y1: me.y + 40,
                        x2: me.x + 120 + 100,
                        y2: me.y + 40 + 20
                    };
                } else {
                    r1 = {
                        x1: me.x + me.width - 120 - 100,
                        y1: me.y + 20,
                        x2: me.x + me.width - 120 - 100 + 100,
                        y2: me.y + 20 + 20
                    }
                }
                let r2 = {
                    x1: you.x,
                    y1: you.y,
                    x2: you.x + you.width,
                    y2: you.y + you.height
                };
                if (this.is_collision(r1, r2)) {
                    you.is_attack();
                }
            }
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();
        this.render();
    }
    render() {
        let status = this.status;
        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if (this.direction === 1) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
                this.ctx.restore();
            }
            this.frame_current_cnt++;
        }

        if (status === 4 || status === 5 || status === 6) {
            if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                if (status === 6) {
                    this.frame_current_cnt--;
                } else {
                    this.status = 0;
                }
            }
        }
        //this.frame_current_cnt++;
    }
}

export {
    Player
}