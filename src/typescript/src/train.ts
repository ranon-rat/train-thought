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
    initialProgress: number = 3 // this is per 1000 
    dProgress: number = this.initialProgress / 1000
    progress: number = 0

    dX: number = 0
    dY: number = 0

    rotating: boolean = false
    rotatingDirection: Direction = Direction.NEUTRAL
    constructor(x: number, y: number, map: GameMap) {
        this.length = map.GetLength() / 2
        this.x = x + 0.5
        this.y = y + 0.5
        this.angle = this.getNextAngle(map.GetDirection(x, y))
    }

    resize(length: number) {
        this.length = length / 2
    }
    Move(map: GameMap, x: number, y: number): [number, number] {
        //const before = map.GetBefore(x + this.dX / 2, y + this.dY / 2)
        let next = map.GetDirection(x - this.dX / 2, y - this.dY / 2)
        let point = map.GetPoint(x - this.dX / 2, y - this.dY / 2)
  
        if (point === Kind.CHANGING_RAIL) {
            if (this.rotatingDirection === Direction.NEUTRAL) {
                this.rotatingDirection = next
                this.rotating = true
            }
            console.log(this.rotatingDirection,next)
        
            next = this.rotatingDirection
            console.log(this.rotatingDirection,next)
        } else {
            this.rotatingDirection = Direction.NEUTRAL
            this.rotating = false
        }

        // Movimiento normal en línea recta
        const pos = this.getNextPosition(next)
        this.dX = pos[0]
        this.dY = pos[1]
        return [x + pos[0] * this.velocity, y + pos[1] * this.velocity]
    }
    private getNextAngle(direction: Direction): number {

        switch (direction) {
            case Direction.RIGHT:
                console.log("RIGHT")
                return 0
            case Direction.LEFT:
                console.log("LEFT")
                return Math.PI
            case Direction.UP:
                console.log("UP")
                return Math.PI / 2
            case Direction.DOWN:
                console.log("DOWN")

                return Math.PI * 3 / 2
            default: return 0
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
        // the back part
        const point = map.GetPoint(this.x, this.y)
        if (![Kind.EMPTY, Kind.HOUSE].includes(point)) {
            const [x, y] = this.Move(map, this.x, this.y, )
            this.x = x
            this.y = y
            ctx.fillStyle = "black"
            ctx.fillRect((this.x) * map.length, (this.y) * map.length, 10, 10)
            return
        }
        this.ready = true
    }
    // entonces como puedo definir hacia donde he de ir? hmmmm
    // aqui le paso el delta time de los fps 
    changeSpeed(time: number) {
        this.dProgress = this.initialProgress * (time / 1000)
        this.velocity = this.initialVelocity * (time / 1000)
    }

}