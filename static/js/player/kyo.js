import { Player } from "./base.js";
import { GIF } from "../utils/gif.js"

class Kyo extends Player {
    constructor(root, info) {
        super(root, info);
        this.init_animations();
    }
    init_animations() {
        let offsets = [0, -22, -22, -140, 0, 0, 0, -130];
        for (let i = 0; i < 8; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,
                frame_rate: 5,
                offset_y: offsets[i],
                scale: 2,
                loaded: false
            });

            gif.onload = () => {
                let obj = this.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
            }
        }
    }
}

export {
    Kyo
}