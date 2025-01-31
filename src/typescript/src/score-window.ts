import { MAX_HEIGHT, MAX_WIDTH } from "./const"
import { TextInterface } from "./text"
export class scoreWindow {
    original_x: number
    original_y: number
    original_width: number
    original_height: number
    x: number = 0
    y: number = 0
    width: number = 0
    height: number = 0
    text: TextInterface
    constructor(canvas: HTMLCanvasElement) {


        this.original_height = MAX_HEIGHT / 10
        this.original_width = MAX_WIDTH / 10
        this.original_x = MAX_WIDTH - this.original_width
        this.original_y = 0
        this.text = new TextInterface(this.original_x + this.original_width / 2, this.original_y + this.original_height / 2, 10, "", "black", "Arial", canvas)
        this.resize(canvas)
    }
    resize(canvas: HTMLCanvasElement) {
        this.x = (this.original_x / MAX_WIDTH) * canvas.width
        this.y = (this.original_y / MAX_HEIGHT) * canvas.height

        this.width = (this.original_width / MAX_WIDTH) * canvas.width
        this.height = (this.original_height / MAX_HEIGHT) * canvas.height
    }

    draw(ctx: CanvasRenderingContext2D, current_time: number, correct_trains: number, total_trains: number) {
        ctx.fillStyle = "red"
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "rgb(179, 177, 177)"
        ctx.fillRect(this.x, this.y, this.width, this.height)

        // it has to show the m:ss
        const minutes = Math.floor(current_time / 1000 / 60)
        const seconds = Math.floor((current_time / 1000) % 60)
        this.text.update_text(`${minutes}:${seconds}| ${correct_trains} of ${total_trains}`)
        this.text.draw(ctx)
    }
}