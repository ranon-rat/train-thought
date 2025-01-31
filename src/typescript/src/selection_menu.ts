import { Button } from "./buttons";
import { first_map, second_map, third_map } from "./maps";
import { Kind } from "./types-enum-constants";
import { MAX_WIDTH, MAX_HEIGHT } from "./const";

// here we will have the selection menu

// you will select the levels
export class SelectionMenu {
    buttons: Button[] = []
    // the height and width of the canvas

    // the levels
    levels: Kind[][][] = [first_map, second_map, third_map]
    buttons_per_row: number = 4

    constructor(canvas: HTMLCanvasElement) {

        const button_width = MAX_WIDTH / this.buttons_per_row
        const button_height = MAX_HEIGHT / this.buttons_per_row


        for (let i = 0; i < this.levels.length; i++) {
            this.buttons.push(
                new Button(i * button_width,
                    Math.floor(i / this.buttons_per_row) * button_height,
                    button_width,
                    button_height, `Level ${i + 1}`, canvas)

            )
        }
    }
    resize(canvas: HTMLCanvasElement) {
        for (let i = 0; i < this.levels.length; i++) {
            this.buttons[i].resize(canvas)
        }
    }
    onClick(x: number, y: number): Kind[][] {
        console.log("clicked")
        for (let i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].isPressed(x, y)) {
                return this.levels[i]
            }
        }
        return []
    }
    draw(ctx: CanvasRenderingContext2D) {
        // como maximo quisiera 4 botones por fila
        console.log("drawing")
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw(ctx)
        }
    }
}