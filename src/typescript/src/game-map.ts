import { Kind, Direction, around } from "./types-enum-constants"
function its_out_of_bounds(x:number,y:number,list:any[][]){
    if(y >= list.length || y < 0)return true    
    return x >= list[y].length || x < 0
}
function draw_circle(x:number,y:number,dx:number,dy:number,radious:number,ctx:CanvasRenderingContext2D,color:string){
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x * dx + dx / 2, y * dy + dy / 2, radious, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
}
export class GameMap {
    level_design: Kind[][] = [
        [Kind.EMPTY, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY],
        [Kind.HOUSE, Kind.RAIL, Kind.CHANGING_RAIL, Kind.RAIL, Kind.RAIL, Kind.HOUSE, Kind.EMPTY],
        [Kind.EMPTY, Kind.EMPTY, Kind.RAIL, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY],
        [Kind.EMPTY, Kind.EMPTY, Kind.RAIL, Kind.RAIL, Kind.RAIL, Kind.SPAWNER, Kind.EMPTY],
        [Kind.EMPTY, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY, Kind.EMPTY],
    ];
    // y x 
    spawners: number[][] = []
    level_directions: Direction[][]
    level_before: Direction[][]
    changing_rails_directions: Direction[][][]
    changing_rails_pos: number[][]
    houses_id:number[][]=[]
    houses_length:number=0
   
    width: number = 0
    height: number = 0
    length: number = 0
    constructor(level_design: Kind[][]) {
        // lets just copy the design
        this.length = level_design.length
        this.level_design = level_design.slice()
        // lets define this for the directions and rendering
        this.level_directions = level_design.map(row => row.map(() => Direction.NEUTRAL))
        this.level_before = level_design.map(row => row.map(() => Direction.NEUTRAL))
        // with this we will render the rails and play with it
        this.changing_rails_directions = level_design.map(row => row.map(() => []))
        this.changing_rails_pos = level_design.map(row => row.map(() => 0))
        // the houses id
        this.houses_id=level_design.map(row => row.map(() => -1))
        // x y height
        this.width = level_design[0].length
        this.height = level_design.length

        // so with this we make everything that is needed
        this.SetupMap()
    }
    async Draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const dx = this.length
        const dy = this.length
        const promises: Promise<void>[] = []
        for (let y = 0; y < this.level_design.length; y++) {
            for (let x = 0; x < this.level_design[y].length; x++) {
                promises.push((async () => {
                    this.DrawPart(x, y, dx, dy, this.level_design[y][x], ctx)
                    if ([Kind.EMPTY, Kind.HOUSE, Kind.SPAWNER].includes(this.level_design[y][x])) {
                        return
                    }
                    this.DrawLineFromOrigin(x, y, dx, dy, ctx)
                })())
            }
        }
        await Promise.all(promises)
    }
    DrawPart(x: number, y: number, dx: number, dy: number, kind: Kind, ctx: CanvasRenderingContext2D) {
        switch (kind) {
            case Kind.HOUSE:
                draw_circle(x,y,dx,dy,dx/2,ctx,"rgb(150,150,150)")
                draw_circle(x,y,dx,dy,dx/4,ctx,"white")
                ctx.fillStyle = "black"
                ctx.textAlign = "center"
                ctx.font = "10px Arial"
              //  ctx.fillText(`${this.houses_id[y][x]}`,x * dx + dx / 2, y * dy + dy / 2);
                break
           
            case Kind.CHANGING_RAIL:
                ctx.beginPath()
                ctx.fillStyle = "rgb(25, 17, 59)"
                ctx.arc(x * dx + dx / 2, y * dy + dy / 2, dx / 2, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()
                break
            case Kind.SPAWNER:
                ctx.fillStyle = "rgb(0,0,255)"
                ctx.fillRect(x * dx, y * dy, dx, dy);
                break
            default:
                break
        }
    }

   
    SetupMap() {
        for (let y = 0; y < this.level_design.length; y++) {
            for (let x = 0; x < this.level_design[y].length; x++) {
                if (this.level_design[y][x] !== Kind.SPAWNER) {
                    continue
                }
                this.spawners.push([y,x])
                this.SetupPlayingMap(y, x, Direction.NEUTRAL)
                return
            }
        }
        throw new Error("No spawner found")
    }
    Click(x: number, y: number, width: number, height: number) {
        const level_x = Math.floor((x / width) * this.width)
        const level_y = Math.floor((y / height) * this.height)
        this.UpdateChangingRails(level_x, level_y)
    }
    public CheckDirections(x: number, y: number, before: Direction): [number, number, Direction][] {
        // y x v
        // with this i delete the things that will make me go backwards
        const checkAround: [number, number, Direction][] = around.filter(v =>
            !(before === Direction.DOWN && v[2] === Direction.UP) &&
            !(before === Direction.UP && v[2] === Direction.DOWN) &&
            !(before === Direction.LEFT && v[2] === Direction.RIGHT) &&
            !(before === Direction.RIGHT && v[2] === Direction.LEFT)

        )


        // then we get the result
        const output: [number, number, Direction][] = []
        for (let d of checkAround) {
            const [j, i] = d
            // first we need to avoid getting outside of the map
            if (y + j >= this.level_design.length || y + j < 0) {
                continue
            }
            if (x + i >= this.level_design[0].length || x + i < 0) {
                continue
            }
            // then we ignore empty spaces, we dont care about those
            if (this.level_design[y + j][x + i] === Kind.EMPTY) {
                continue
            }
            output.push(d)
        }
        return output
    }
    public SetupPlayingMap(y: number, x: number, before: Direction) {
        // so with this we ensure that it doesnt goes backwards
        this.level_before[y][x] = before;

        const elementType = this.level_design[y][x]
        if (elementType == Kind.HOUSE) {
            this.houses_id[y][x]=this.houses_length
            this.houses_length++
            return
        }
        if (elementType === Kind.SPAWNER) {
            this.spawners.push([y, x])
            // agrego esto, tal vez deberia de agregar algo para que pueda obtener el direction???'idk 
        }
        // we need to check the directions
        // Y X DIRECTION
        const directions = this.CheckDirections(x, y, before);
        if (directions.length == 0) {
            return
        }
        this.level_directions[y][x] = directions[0][2]
        // we only expect to have one connection in the spawner and the rails
        if (elementType === Kind.SPAWNER || elementType === Kind.RAIL) {
            const [j, i, v] = directions[0]
            this.SetupPlayingMap(y + j, x + i, v)
            return
        }
        // it wil check all around and follow the path
        if (elementType === Kind.CHANGING_RAIL) {
            for (let d of directions) {
                const [j, i, v] = d
                this.changing_rails_directions[y][x].push(v)
                this.SetupPlayingMap(y + j, x + i, v)

            }
            return
        }
    }
    
    UpdateChangingRails(x: number, y: number) {
        if (this.GetPoint(x, y) !== Kind.CHANGING_RAIL) {
            return
        }
        this.changing_rails_pos[y][x]++
        // we check if we are out of our index
        if (this.changing_rails_pos[y][x] >= this.changing_rails_directions[y][x].length) {
            this.changing_rails_pos[y][x] = 0

        }
        // we define our new direction
        this.level_directions[y][x] = this.changing_rails_directions[y][x][this.changing_rails_pos[y][x]]

    }
    DrawLineFromOrigin(x: number, y: number, dx: number, dy: number, ctx: CanvasRenderingContext2D) {
        
        const center_x = x * dx + dx / 2
        const center_y = y * dy + dy / 2
        const [up_y, down_y, left_x, right_x] = [(y + 1) * dy, y * dy, x * dx, (x + 1) * dx]

        const before = this.level_before[y][x]
        const next = this.level_directions[y][x]

        const around = [
            { v: Direction.UP, x: center_x, y: down_y, x2: center_x, y2: up_y },
            { v: Direction.DOWN, x: center_x, y: up_y, x2: center_x, y2: down_y },
            { v: Direction.LEFT, x: right_x, y: center_y, x2: left_x, y2: center_y },
            { v: Direction.RIGHT, x: left_x, y: center_y, x2: right_x, y2: center_y }
        ]

        const direction_before = around.find(v => v.v === before)!
        const direction_next = around.find(v => v.v === next)!
        if(before!==next){
            this.DrawCircle(direction_before.x, direction_before.y, dx/10, dy/10, ctx)
            this.DrawCircle(direction_next.x, direction_next.y, dx/10, dy/10, ctx)
        }

        this.DrawLine(direction_before.x, direction_before.y, direction_next.x2, direction_next.y2, ctx)

    }
    DrawCircle(x:number,y:number,dx:number,dy:number,ctx:CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.fillStyle = "rgb(56, 134, 124)"
        ctx.arc(x * dx + dx / 2, y * dy + dy / 2,10, 0, 2 * Math.PI)

        ctx.fill()
        ctx.closePath()
    }
    DrawLine(x1: number, y1: number, x2: number, y2: number, ctx: CanvasRenderingContext2D) {
        this.DrawLineColor(x1,y1,x2,y2,ctx,"rgb(56, 134, 124)",15)
    }
    DrawLineColor(x1: number, y1: number, x2: number, y2: number, ctx: CanvasRenderingContext2D,color:string,glowSize:number) {
    
        // Configurar la sombra para el efecto de neón
        const prev_shadow = ctx.shadowColor
        const prev_glow = ctx.shadowBlur
        const prev_stroke = ctx.strokeStyle
        const prev_width = ctx.lineWidth
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        
        ctx.shadowColor = color;
        ctx.shadowBlur = glowSize;
        // Dibujar la línea
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        ctx.shadowColor = prev_shadow
        ctx.shadowBlur = prev_glow
        ctx.strokeStyle = prev_stroke
        ctx.lineWidth = prev_width
    }
  
    UpdateLength(length: number) {
        this.length = length
    }
    GetLength() {
        return this.length
    }
    GetPoint(x: number, y: number): Kind {
        const y_floor = Math.floor(y)
        const x_floor = Math.floor(x)
        if(its_out_of_bounds(x_floor,y_floor,this.level_design))return Kind.EMPTY
        return this.level_design[y_floor][x_floor]
    }
    GetDirection(x: number, y: number) {
        const y_floor = Math.floor(y)
        const x_floor = Math.floor(x)
        if(its_out_of_bounds(x_floor,y_floor,this.level_directions))return Direction.NEUTRAL
        return this.level_directions[y_floor][x_floor]
    }
    GetBefore(x: number, y: number) {
        const y_floor = Math.floor(y)
        const x_floor = Math.floor(x)
        if(its_out_of_bounds(x_floor,y_floor,this.level_before))return Direction.NEUTRAL
        return this.level_before[y_floor][x_floor]
    }
    CheckHouse(x: number, y: number){
        const y_floor = Math.floor(y)
        const x_floor = Math.floor(x)
        if(its_out_of_bounds(x_floor,y_floor,this.houses_id))return -1
            return this.houses_id[y_floor][x_floor]
    }
    GetHousesLength(){
        return this.houses_length
    } 
}

