import { Button } from "./buttons";
import { first_map, second_map, third_map } from "./maps";
import { Kind } from "./types-enum-constants";

// here we will have the selection menu

// you will select the levels
export class SelectionMenu {
    buttons: Button[] = []
    // the height and width of the canvas
    height: number
    width: number
    // the levels
    levels: Kind[][][] = [first_map, second_map, third_map]
    buttons_per_row: number = 4

    constructor(height: number, width: number) {
        this.height = height
        this.width = width
        const button_width = this.width / this.buttons_per_row
        const button_height = this.height / this.buttons_per_row
        for (let i = 0; i < this.levels.length; i++) {
            this.buttons.push(new Button(i * button_width, 0, button_width, button_height, `Level ${i + 1}`))
        }
    }
    resize(canvas: HTMLCanvasElement) {
        this.height = canvas.height
        this.width = canvas.width
        const button_width = this.width / this.buttons_per_row
        const button_height = this.height / this.buttons_per_row
        for (let i = 0; i < this.levels.length; i++) {
            this.buttons[i].update(i * button_width, 0, button_width, button_height)
        }
    }
    onClick(x: number, y: number): Kind[][] {
        console.log("clicked")
        for (let i = 0; i < this.buttons.length; i++) {
            if (!this.buttons[i].isPressed(x, y)) {
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