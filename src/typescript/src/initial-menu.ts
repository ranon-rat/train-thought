import { Button } from "./buttons";

export class InitialMenu {
    play_button: Button
    canvas_height_ratio: number = 8;
    canvas_width_ratio: number = 8;

    constructor(height: number, width: number) {
        this.play_button = new Button(
            height / 2,
            width / 2,
            height / this.canvas_height_ratio,
            width / this.canvas_width_ratio,
            "Play");
    }
    onClick(x: number, y: number) {
        return this.play_button.isPressed(x, y);
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.play_button.draw(ctx);

    }
    resize(canvas: HTMLCanvasElement) {
        const width = canvas.width;
        const height = canvas.height;
        const play_button_width = height / this.canvas_height_ratio;
        const play_button_height = width / this.canvas_width_ratio;
        this.play_button.update(
            width / 2 - play_button_width / 2,
            height / 2 - play_button_height / 2,
            play_button_width,
            play_button_height
        );

    }
}
