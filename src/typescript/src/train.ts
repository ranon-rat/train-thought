import { GameMap } from "./game-map"
import { colors, Direction, draw_circle, Kind } from "./types-enum-constants"
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

    house_id: number = -1
    is_correct: boolean = false

    rotatingDirection: Direction = Direction.NEUTRAL

    dX: number = 0
    dY: number = 0
    constructor(x: number, y: number, map: GameMap, house_id: number) {
        this.length = map.GetLength() / 3
        this.y = (y + 0.5)
        this.x = (x + 0.5)
        this.house_id = house_id
    }
    resize(length: number) {
        this.length = length / 3
    }
    Move(map: GameMap, x: number, y: number): [number, number] {
        let [x_l,y_l] = [x,y]
        let point = map.GetPoint(x, y)
        if (point === Kind.HOUSE) {
            [x_l,y_l] = [x_l-this.dX/2,y_l-this.dY/2]
        }
        const before = map.GetBefore(x_l, y_l)
        let next = map.GetDirection(x_l, y_l)

        let [dx, dy] = [0, 0]
        if (next === Direction.NEUTRAL) {
            return [dx, dy]
        }
        if (this.rotatingDirection === Direction.NEUTRAL || point !== Kind.CHANGING_RAIL) {
            this.rotatingDirection = next
        }
        next = this.rotatingDirection

        if (before !== next && before !== Direction.NEUTRAL) {
            //console.log(this.printDirection(before), this.printDirection(next));
            const vector = Math.SQRT1_2
            const [to_go_UP, to_go_DOWN, to_go_LEFT, to_go_RIGHT] = [-vector, vector, -vector, vector]
            switch (true) {
                // viene de abajo va hacia arriba
                case (before === Direction.DOWN && next === Direction.LEFT):
                case (before === Direction.LEFT && next === Direction.DOWN):
                    [dx, dy] = [to_go_LEFT, to_go_UP]
                    break
                // viene de al lado va hacia arriba
                case (before === Direction.LEFT && next === Direction.UP):
                case (before === Direction.UP && next === Direction.LEFT):
                    [dx, dy] = [to_go_LEFT, to_go_DOWN]
                    break
                // viene de abajo va hacia arriba 
                case (before === Direction.DOWN && next === Direction.RIGHT):
                case (before === Direction.RIGHT && next === Direction.DOWN):
                    [dx, dy] = [to_go_RIGHT, to_go_UP]
                    break
                // viene de arriba va hacia al abajo
                case (before === Direction.UP && next === Direction.RIGHT):
                case (before === Direction.RIGHT && next === Direction.UP): // okay this is ready
                    [dx, dy] = [to_go_RIGHT, to_go_DOWN]
                    break

                default:
                    [dx, dy] = this.getNextPosition(next)
                    break
            }
        } else {
            // Movimiento en línea recta
            [dx, dy] = this.getNextPosition(next)
            if (point !== Kind.CHANGING_RAIL) {
                this.rotatingDirection = Direction.NEUTRAL
            }
        }
        if (point === Kind.HOUSE) {
            [dx, dy] = this.getNextPosition(before);
            console.log("here we are")
        }
        this.dX = dx
        this.dY = dy
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
        const before = map.GetPoint(this.x - this.dX / 2, this.y - this.dY / 2)
        console.log(point, before)
        if (before === Kind.HOUSE || point === Kind.EMPTY) {
            console.log("checking on house before")
            this.is_correct = map.CheckHouse(this.x, this.y) === this.house_id
            this.ready = true
            return
        }

        // Actualizamos posición con precisión fija
        const [dx, dy] = this.Move(map, this.x, this.y)
        this.x += dx * this.velocity
        this.y += dy * this.velocity
        this.renderOrb(this.x*map.length,this.y*map.length,this.length,this.length,ctx)
    
        return
    }
    renderOrb(x:number,y:number,width:number,height:number,ctx:CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.fillStyle = colors[this.house_id]
        ctx.arc(x,y,height/2,0,2*Math.PI)
        ctx.fill()
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.font = "10px Arial"
        ctx.fillText(`${this.house_id}`,x,y)
        ctx.closePath()
    }

    // entonces como puedo definir hacia donde he de ir? hmmmm
    // aqui le paso el delta time de los fps 
    changeSpeed(time: number) {
        this.velocity = (this.initialVelocity) * (time / 1000)
    }

}