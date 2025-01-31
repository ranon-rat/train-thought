import { MAX_WIDTH, MAX_HEIGHT } from "./const"
export class TextInterface {
    original_x: number
    original_y: number
    original_font_size: number

    x: number = 0
    y: number = 0
    font_size: number = 0

    color: string
    content: string

    constructor(x: number, y: number, font_size: number, content: string, color: string, font_family: string = "Arial", canvas: HTMLCanvasElement) {
        this.original_x = x
        this.original_y = y
        this.original_font_size = font_size
        this.resize(canvas)
        this.content = content
        this.color = color

    }
    resize(canvas: HTMLCanvasElement) {
        this.font_size = (this.original_font_size / MAX_WIDTH) * canvas.width
        this.x = (this.original_x / MAX_WIDTH) * canvas.width
        this.y = (this.original_y / MAX_HEIGHT) * canvas.height
    }
    update_text(content: string) {
        this.content = content
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.font = `${this.font_size}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(this.content, this.x, this.y + this.font_size / 2)
    }

}