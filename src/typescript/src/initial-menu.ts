import { Button } from "./buttons";
import { MAX_WIDTH, MAX_HEIGHT, MAPS_WIDTH } from "./const";
import { GameState } from "./game-state";
import { cool_map_for_menu } from "./maps";

export class InitialMenu {
    play_button: Button
    canvas_height_ratio: number = 8;
    canvas_width_ratio: number = 8;
    game_state: GameState

    constructor(canvas: HTMLCanvasElement) {
        this.game_state = new GameState(cool_map_for_menu, canvas, false)
        this.play_button = new Button(
            MAX_WIDTH / 2 - 112 / 2,
            MAX_HEIGHT / 2,
            112,
            61,
            "Play", canvas);
    }
    onClick(x: number, y: number) {
        return this.play_button.isPressed(x, y);
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.game_state.draw(ctx)
        this.play_button.draw(ctx);

    }
    async updateSpeed(deltaTime: number) {
        this.game_state.updateSpeed(deltaTime)
    }

    resize(canvas: HTMLCanvasElement) {

        this.game_state.resize(canvas)
        this.play_button.resize(canvas)
    }
}
