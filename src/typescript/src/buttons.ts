import { MAX_HEIGHT, MAX_WIDTH } from "./const"
import { TextInterface } from "./text"
// this is  a class for checking the buttons
// i should probably add a way of having a way of centralizing the buttons
export class Button {
    original_x: number
    original_y: number
    original_width: number
    original_height: number
    width: number = 0
    height: number = 0
    x: number = 0
    y: number = 0
    text: TextInterface
    color: string
    constructor(x: number, y: number, width: number, height: number, content: string, canvas: HTMLCanvasElement, font_size: number = 10, color: string = "white") {
        this.original_x = x
        this.original_y = y
        this.original_width = width
        this.original_height = height
        this.text = new TextInterface(x + width / 2, y + height / 2, 20, content, "black", "Arial", canvas)

        this.resize(canvas)

        this.color = color

    }

    resize(canvas: HTMLCanvasElement) {
        this.x = (this.original_x / MAX_WIDTH) * canvas.width
        this.y = (this.original_y / MAX_HEIGHT) * canvas.height
        this.width = (this.original_width / MAX_WIDTH) * canvas.width
        this.height = (this.original_height / MAX_HEIGHT) * canvas.height
        this.text.resize(canvas)

    }
    isPressed(x: number, y: number) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        this.text.draw(ctx)
    }


}