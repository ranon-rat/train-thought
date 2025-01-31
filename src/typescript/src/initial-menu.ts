import { Button } from "./buttons";
import { MAX_WIDTH, MAX_HEIGHT } from "./const";

export class InitialMenu {
    play_button: Button
    canvas_height_ratio: number = 8;
    canvas_width_ratio: number = 8;

    constructor(canvas: HTMLCanvasElement) {
        this.play_button = new Button(
            MAX_WIDTH / 2,
            MAX_HEIGHT / 2,
            112,
            61,
            "Play", canvas);
    }
    onClick(x: number, y: number) {
        return this.play_button.isPressed(x, y);
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.play_button.draw(ctx);

    }
    resize(canvas: HTMLCanvasElement) {
        this.play_button.resize(canvas)
    }
}
