import { Button } from "./buttons";
import { MAX_HEIGHT, MAX_WIDTH } from "./const";


export class GameOver {
    original_x: number
    original_y: number
    original_width: number
    original_height: number
    x: number = 0
    y: number = 0
    width: number = 0
    height: number = 0

    gameOverButton: Button
    constructor(canvas: HTMLCanvasElement) {


        this.original_height = MAX_HEIGHT / 2
        this.original_width = MAX_WIDTH / 2
        this.original_x = (MAX_WIDTH - this.original_width) / 2
        this.original_y = (MAX_HEIGHT - this.original_height) / 2

        this.gameOverButton = new Button(
            (this.original_x + this.original_width / 2) - this.original_width / 4,
            (this.original_y + this.original_height) - 95,
            this.original_width / 2, 90,
            "replay", canvas)
        this.resize(canvas)
    }
    onClick(x: number, y: number) {
        return this.gameOverButton.isPressed(x, y)
    }
    draw(ctx: CanvasRenderingContext2D, correct_trains: number, total_trains: number) {
        ctx.fillStyle = "rgb(0,0,0)"
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "rgb(255,255,255)"
        ctx.font = "80px Arial"
        ctx.fillText(`Game Over`, this.x + this.width / 2, this.y)
        ctx.font = "10px Arial"
        ctx.fillText(`${correct_trains} of ${total_trains}`, this.x + this.width / 2, this.y + this.height / 8 + 40)
        this.gameOverButton.draw(ctx)
    }
    resize(canvas: HTMLCanvasElement) {
        this.x = (this.original_x / MAX_WIDTH) * canvas.width
        this.y = (this.original_y / MAX_HEIGHT) * canvas.height
        this.width = (this.original_width / MAX_WIDTH) * canvas.width
        this.height = (this.original_height / MAX_HEIGHT) * canvas.height

        this.gameOverButton.resize(canvas)
    }
}