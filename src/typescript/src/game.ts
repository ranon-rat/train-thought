
import { SelectionMenu } from "./selection_menu"
import { InitialMenu } from "./initial-menu"
import { GameState } from "./game-state"
import { GameOver } from "./game-over"
import { MAPS_WIDTH, MAPS_HEIGHT, MAX_WIDTH } from "./const"

export class Game {
    state = 0
    private lastFrameTime: number = 0
    private readonly FPS = 60
    private readonly frameDelay = 1000 / this.FPS
    // the menus and the states of the game
    private menu: InitialMenu
    private selection_menu: SelectionMenu
    private game_state: GameState | null = null
    private game_over: GameOver
    // information
    correct_trains: number = 0
    total_trains: number = 0

    constructor(canvas: HTMLCanvasElement) {
        this.selection_menu = new SelectionMenu(canvas)
        this.menu = new InitialMenu(canvas)
        this.selection_menu = new SelectionMenu(canvas)
        this.game_over = new GameOver(canvas)
    }

    onKeyPress(e: KeyboardEvent, canvas: HTMLCanvasElement) {
        const key = e.key.toLowerCase()
        if (key === "r") {
            this.state = 0
        }
        if (["q", "n"].includes(key)) {
            this.state = 3
        }
    }


    async draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

        const currentTime = performance.now()
        const deltaTime = currentTime - this.lastFrameTime

        this.game_state?.decreaseTime(deltaTime)
        this.menu.decreaseTime(deltaTime)
        if (deltaTime >= this.frameDelay) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            switch (this.state) {
                case 0:
                    this.menu.updateSpeed(deltaTime)
                    this.menu.draw(ctx)
                    break
                case 1:
                    this.selection_menu.draw(ctx)
                    break
                case 2:
                    if (!this.game_state) break
                    this.game_state.updateSpeed(deltaTime)
                    this.game_state.draw(ctx, true)
                    if (this.game_state.checkTime()) this.state = 3
                    this.correct_trains = this.game_state.correct_trains
                    this.total_trains = this.game_state.total_trains
                    break
                case 3:
                    this.game_state?.draw(ctx, false)
                    this.game_over.draw(ctx, this.correct_trains, this.total_trains)
                    break
            }
            this.lastFrameTime = currentTime
        }
        requestAnimationFrame(() => this.draw(canvas, ctx))

    }
    windowResize(canvas: HTMLCanvasElement) {
        // first we need to update the canvas
        const width = Math.min(MAX_WIDTH, window.innerWidth)
        const dx = width / MAPS_WIDTH
        canvas.width = width
        canvas.height = dx * MAPS_HEIGHT
        // then we update the position of each of our elements
        this.menu.resize(canvas)
        this.selection_menu.resize(canvas)
        this.game_over.resize(canvas)
        if (this.game_state) {
            this.game_state.resize(canvas)
        }
    }
    click(e: MouseEvent, canvas: HTMLCanvasElement) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        switch (this.state) {
            case 0:
                if (!this.menu.onClick(x, y)) break
                this.state = 1
                break
            case 1:
                const level = this.selection_menu.onClick(x, y)
                if (!level) break
                this.game_state = new GameState(level, canvas)
                this.windowResize(canvas)
                this.state = 2
                break
            case 2:
                if (!this.game_state) break
                this.game_state.onClick(x, y, canvas.width, canvas.height)
                break
            case 3:
                if (!this.game_over.onClick(x, y)) break
                this.state = 1
                break
            default:
                break
        }
    }
}