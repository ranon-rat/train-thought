import { Button } from "./buttons";
import { MAX_HEIGHT, MAX_WIDTH } from "./const";
import { TextInterface } from "./text";


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
    gameOverText: TextInterface
    scoreBoard: TextInterface
    constructor(canvas: HTMLCanvasElement) {


        this.original_height = MAX_HEIGHT / 2
        this.original_width = MAX_WIDTH / 2
        this.original_x = (MAX_WIDTH - this.original_width) / 2
        this.original_y = (MAX_HEIGHT - this.original_height) / 2
        this.gameOverButton = new Button(
            (this.original_x + this.original_width / 2) - this.original_width / 4,
            (this.original_y + this.original_height) - 95,
            this.original_width / 2, 70,
            "replay", canvas)
        this.gameOverText = new TextInterface(this.original_x + this.original_width / 2,
            this.original_y + 30,
            80, "Game Over", "white", "Arial", canvas)
        this.scoreBoard = new TextInterface(
            MAX_WIDTH / 2,
            MAX_HEIGHT / 2,
            20, "0 of 0", "white", "Arial", canvas)
        this.resize(canvas)
    }
    onClick(x: number, y: number) {
        return this.gameOverButton.isPressed(x, y)
    }
    draw(ctx: CanvasRenderingContext2D, correct_trains: number, total_trains: number) {
        ctx.fillStyle = "rgb(0,0,0)"
        ctx.fillRect(this.x, this.y, this.width, this.height)
        this.gameOverText.draw(ctx)
        this.scoreBoard.update_text(`${correct_trains} of ${total_trains}`)
        this.scoreBoard.draw(ctx)
        this.gameOverButton.draw(ctx)
    }
    resize(canvas: HTMLCanvasElement) {
        this.x = (this.original_x / MAX_WIDTH) * canvas.width
        this.y = (this.original_y / MAX_HEIGHT) * canvas.height
        this.width = (this.original_width / MAX_WIDTH) * canvas.width
        this.height = (this.original_height / MAX_HEIGHT) * canvas.height
        this.gameOverText.resize(canvas)
        this.scoreBoard.resize(canvas)
        this.gameOverButton.resize(canvas)
    }
}