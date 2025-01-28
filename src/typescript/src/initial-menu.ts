import { Button } from "./buttons";

export class InitialMenu {
    play_button: Button
    canvas_height_ratio: number = 8;
    canvas_width_ratio: number = 8;

    constructor( width: number,height: number) {
        this.play_button = new Button(
            width / 2,
            height / 2,
            width / this.canvas_width_ratio,
            height / this.canvas_height_ratio,
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
        const play_button_width = width / this.canvas_width_ratio;
        const play_button_height = height / this.canvas_height_ratio; 
        this.play_button.update(
            width / 2 - play_button_width / 2,
            height / 2 - play_button_height / 2,
            play_button_width,
            play_button_height
        );

    }
}
