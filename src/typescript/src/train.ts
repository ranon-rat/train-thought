import { GameMap } from "./game-map"
import { colors, Direction, draw_circle, Kind } from "./types-enum-constants"
export class Train {
    x: number = 0
    y: number = 0


    length: number = 0
    angle: number = 0
    // per second that means 1000 milliseconds
    initialVelocity: number = 1
    velocity: number = this.initialVelocity / 1000

    // con esto lo preprao para eliminarlo
    ready: boolean = false // con este el tren muere
    is_correct: boolean = false
    house_id: number = -1
    // this will keep the direciton that we set for the changing rail constant once it gets to that point.
    rotatingDirection: Direction = Direction.NEUTRAL
    // improving animations and events
    dX: number = 0
    dY: number = 0
    length_ratio:number=2.1
    constructor(x: number, y: number, map: GameMap, house_id: number) {
        this.length = map.GetLength() / this.length_ratio
        this.y = (y + 0.5)
        this.x = (x + 0.5)
        this.house_id = house_id
    }
    resize(length: number) {
        this.length = length / this.length_ratio
    }
    Move(map: GameMap, x: number, y: number): [number, number] {
        let [x_l, y_l] = [x, y]
        let point = map.GetPoint(x, y)
        if (point === Kind.HOUSE) {
            [x_l, y_l] = [x_l - this.dX / 2, y_l - this.dY / 2]
        }
        const before = map.GetBefore(x_l, y_l)
        let next = map.GetDirection(x_l, y_l)

        let [dx, dy] = [0, 0]
        if (next === Direction.NEUTRAL) {
            return [dx, dy]
        }
        if (this.rotatingDirection === Direction.NEUTRAL || point !== Kind.CHANGING_RAIL) {
            console.log(this.printDirection(before), this.printDirection(next));
            this.rotatingDirection = next
        }
        next = this.rotatingDirection

        if (before !== next && before !== Direction.NEUTRAL) {
            [dx, dy] = this.curveVector(before, next)
        } else {
            // Movimiento en línea recta
            [dx, dy] = this.getDirectionVector(next)
            if (point !== Kind.CHANGING_RAIL) {
                this.rotatingDirection = Direction.NEUTRAL
            }
        }
        if (point === Kind.HOUSE) {
            [dx, dy] = this.getDirectionVector(next);
        }
        
        this.dX = dx
        this.dY = dy
        return [dx, dy]
    }
    curveVector(before: Direction, next: Direction) {
        const vector = Math.SQRT1_2

        const [to_go_UP, to_go_DOWN, to_go_LEFT, to_go_RIGHT] = [-vector, vector, -vector, vector]
        const curves: Record<string, [number, number]> = {
            [`${Direction.DOWN}_${Direction.LEFT}`]: [to_go_LEFT, to_go_UP],
            [`${Direction.LEFT}_${Direction.DOWN}`]: [to_go_LEFT, to_go_UP],
            [`${Direction.LEFT}_${Direction.UP}`]: [to_go_LEFT, to_go_DOWN],
            [`${Direction.UP}_${Direction.LEFT}`]: [to_go_LEFT, to_go_DOWN],
            [`${Direction.DOWN}_${Direction.RIGHT}`]: [to_go_RIGHT, to_go_UP],
            [`${Direction.RIGHT}_${Direction.DOWN}`]: [to_go_RIGHT, to_go_UP],
            [`${Direction.UP}_${Direction.RIGHT}`]: [to_go_RIGHT, to_go_DOWN],
            [`${Direction.RIGHT}_${Direction.UP}`]: [to_go_RIGHT, to_go_DOWN],
        }
        const key = `${before}_${next}`
        return curves[key] || this.getDirectionVector(next)
    }

    printDirection(direction: Direction) {
        const directions: Record<Direction, string> = {
            [Direction.RIGHT]: "RIGHT",
            [Direction.LEFT]: "LEFT",
            [Direction.UP]: "UP",
            [Direction.DOWN]: "DOWN",
            [Direction.NEUTRAL]: "NEUTRAL"
        }
        return directions[direction]
    }

    // x y 
    private getDirectionVector(direction: Direction): [number, number] {
        const vectors: Record<Direction, [number, number]> = {
            [Direction.RIGHT]: [1, 0],
            [Direction.LEFT]: [-1, 0],
            [Direction.UP]: [0, 1],
            [Direction.DOWN]: [0, -1],
            [Direction.NEUTRAL]: [0, 0]
        };
        return vectors[direction]
    }

    async Draw(map: GameMap, ctx: CanvasRenderingContext2D) {
        const point = map.GetPoint(this.x, this.y)
        const before = map.GetPoint(this.x - this.dX / 2, this.y - this.dY / 2)
        if (before === Kind.HOUSE || point === Kind.EMPTY) {
            this.is_correct = map.CheckHouse(this.x, this.y) === this.house_id
            this.ready = true
            return
        }
        const [dx, dy] = this.Move(map, this.x, this.y)
        // with this we correct the path if we go down a curve
        // its necessary because the train its in a grid its not moving like if it was a 
        // moving in an array(well kinda) but its not fixed and its constantly moving and so
        // its important we correct the path
        if (dx !== 0 || dy !== 0) {
            this.x=dx===0?Math.floor(this.x)+0.5:this.x
            this.y=dy===0?Math.floor(this.y)+0.5:this.y
        }
        this.x += dx * this.velocity
        this.y += dy * this.velocity
        this.renderOrb(this.x * map.length, this.y * map.length, this.length, this.length, ctx)
    }
    renderOrb(x: number, y: number, width: number, height: number, ctx: CanvasRenderingContext2D) {
        draw_circle(x, y, height / 2, ctx, colors[this.house_id], 0)
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.font = "10px Arial"
        ctx.fillText(`${this.house_id}`, x, y)
    }


    changeSpeed(time: number) {
        this.velocity = (this.initialVelocity) * (time / 1000)
    }

}