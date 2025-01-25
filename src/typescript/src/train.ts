import { GameMap } from "./game-map"
import { Direction, Kind } from "./types-enum-constants"
export class Train {
    x: number = 0
    y: number = 0

    // con esto lo preprao para eliminarlo
    ready: boolean = false // con este el tren muere
    length: number = 0
    angle: number = 0
    // per second that means 1000 milliseconds
    initialVelocity: number = 0.5
    velocity: number = this.initialVelocity / 1000

    rotatingDirection: Direction = Direction.NEUTRAL
    constructor(x: number, y: number, map: GameMap) {
        this.length = map.GetLength() / 2
        this.y = (y + 0.5)
        this.x = (x + 0.5)
    }

    resize(length: number) {
        this.length = length / 2
    }
    Move(map: GameMap, x: number, y: number): [number, number] {
        const before = map.GetBefore(x, y)
        let next = map.GetDirection(x, y)
        let point = map.GetPoint(x, y)
        let [dx, dy] = [0, 0]
        if (next === Direction.NEUTRAL) {
            return [dx, dy]
        }
        if (this.rotatingDirection === Direction.NEUTRAL || point !== Kind.CHANGING_RAIL) {
            this.rotatingDirection = next
        }
        next = this.rotatingDirection

        if (before !== next && before !== Direction.NEUTRAL) {
            console.log(this.printDirection(before), this.printDirection(next));
            const vector = 0.70710678118
            const to_go_UP = -vector
            const to_go_DOWN = vector
            const to_go_LEFT = -vector
            const to_go_RIGHT = vector
            switch (true) {
                // viene de abajo va hacia arriba
                case (before === Direction.DOWN && next === Direction.LEFT):
                //    [dx, dy] = [to_go_LEFT, to_go_UP]
                //    break
                //// viene de al lado va hacia abajo
                case (before === Direction.LEFT && next === Direction.DOWN):
                    [dx, dy] = [to_go_LEFT, to_go_UP]
                    break
                // viene de al lado va hacia arriba
                case (before === Direction.LEFT && next === Direction.UP):
                //    [dx, dy] = [to_go_LEFT, to_go_DOWN]
                //    break
                ////viene de arriba va hacia abajo
                case (before === Direction.UP && next === Direction.LEFT):
                    [dx, dy] = [to_go_LEFT, to_go_DOWN]
                    break
                // viene de abajo va hacia arriba 
                case (before === Direction.DOWN && next === Direction.RIGHT):
                //    [dx, dy] = [to_go_RIGHT, to_go_UP]
                //    break
                //// viene de al lado va hacia abajo
                case (before === Direction.RIGHT && next === Direction.DOWN):
                    [dx, dy] = [to_go_RIGHT, to_go_UP]
                    break
                // viene de arriba va hacia al abajo
                case (before === Direction.UP && next === Direction.RIGHT):
                //    [dx, dy] = [to_go_RIGHT, to_go_DOWN]
                //    break
                //// viene de al lado va hacia arriba
                case (before === Direction.RIGHT && next === Direction.UP): // okay this is ready
                    [dx, dy] = [to_go_RIGHT, to_go_DOWN]
                    break

                default:
                    [dx, dy] = this.getNextPosition(next)
            }
        } else {
            // Movimiento en línea recta
            [dx, dy] = this.getNextPosition(next)
            if (point !== Kind.CHANGING_RAIL) {
                this.rotatingDirection = Direction.NEUTRAL
            }
        }

        return [dx, dy]
    }
    printDirection(direction: Direction) {
        switch (direction) {
            case Direction.RIGHT: return "RIGHT"
            case Direction.LEFT: return "LEFT"
            case Direction.UP: return "UP"
            case Direction.DOWN: return "DOWN"
            default: return "NEUTRAL"
        }
    }

    // x y 
    private getNextPosition(direction: Direction): [number, number] {
        switch (direction) {
            case Direction.RIGHT: return [1, 0]
            case Direction.LEFT: return [-1, 0]
            case Direction.UP: return [0, 1]
            case Direction.DOWN: return [0, -1]
            default: return [0, 0]
        }
    }

    Draw(map: GameMap, ctx: CanvasRenderingContext2D) {
        // Redondeamos las coordenadas para el cálculo del punto

        const point = map.GetPoint(this.x, this.y)
        const [dx, dy] = this.Move(map, this.x, this.y)
        if (![Kind.EMPTY, Kind.HOUSE].includes(point)) {
            // Actualizamos posición con precisión fija
            this.x += dx * this.velocity
            this.y += dy * this.velocity
            ctx.fillStyle = "black"
            ctx.fillRect(this.x * map.length, this.y * map.length, 10, 10)
            return
        }
        this.ready = true

    }

    // entonces como puedo definir hacia donde he de ir? hmmmm
    // aqui le paso el delta time de los fps 
    changeSpeed(time: number) {
        this.velocity = (this.initialVelocity) * (time / 1000)
    }

}