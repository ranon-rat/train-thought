
import { SelectionMenu } from "./selection_menu"
import { InitialMenu } from "./initial-menu"
import { GameState } from "./game-state"
import { GameOver } from "./game-over"
import { MAPS_WIDTH, MAPS_HEIGHT, MAX_WIDTH } from "./const"

// i should add something for the game over
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
        if (key === "s") {
            if (this.game_state) {
                this.game_state.spawnTrain()
            }
        }
        if (key === "r") {
            this.state = 0
            this.game_state = null
        }
        if (["q", "n"].includes(key)) {
            this.state = 3

            this.game_state = null
        }
    }


    async draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

        const currentTime = performance.now()
        const deltaTime = currentTime - this.lastFrameTime
        if (this.state === 2 && this.game_state) {
            this.game_state.decreaseTime(deltaTime)
        }

        if (deltaTime >= this.frameDelay) {

            switch (this.state) {
                case 0:
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                    this.menu.resize(canvas)
                    this.menu.draw(ctx)
                    break
                case 1:
                    this.selection_menu.resize(canvas)
                    this.selection_menu.draw(ctx)
                    break
                case 2:
                    if (!this.game_state) {
                        break
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                    const dx = canvas.width / MAPS_WIDTH
                    this.game_state.resize(canvas, dx)
                    this.game_state.updateSpeed(deltaTime)
                    this.game_state.draw(ctx)
                    if (this.game_state.checkTime()) {
                        this.state = 3
                    }
                    this.correct_trains = this.game_state.correct_trains
                    this.total_trains = this.game_state.total_trains

                    break
                case 3:
                    if (this.game_state) {
                        this.game_state = null
                        break
                    }
                    this.game_over.resize(canvas)
                    this.game_over.draw(ctx, this.correct_trains, this.total_trains)
                    break
            }
            this.lastFrameTime = currentTime

        }

        requestAnimationFrame(() => this.draw(canvas, ctx))

    }
    windowResize(canvas: HTMLCanvasElement) {
        const width = Math.min(MAX_WIDTH, window.innerWidth)
        const dx = width / MAPS_WIDTH
        canvas.width = width
        canvas.height = dx * MAPS_HEIGHT
        this.menu.resize(canvas)
        this.selection_menu.resize(canvas)
        this.game_over.resize(canvas)
        if (this.game_state) {
            this.game_state.resize(canvas, dx)
        }
    }
    click(e: MouseEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        switch (this.state) {
            case 0:
                // Todo Add Menu 
                if (this.menu.onClick(x, y)) {

                    this.state = 1
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                }


                break
            case 1:
                // add level selection

                const level = this.selection_menu.onClick(x, y)
                if (level) {

                    this.game_state = new GameState(level, canvas)
                    this.windowResize(canvas)
                    this.state = 2
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                }
                break
            case 2:// game
                if (!this.game_state) break
                this.game_state.onClick(x, y, canvas.width, canvas.height)

                break
            case 3:
                if (this.game_over.onClick(x, y)) {
                    this.state = 1
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                }
                break
            default:
                break
        }
    }
}