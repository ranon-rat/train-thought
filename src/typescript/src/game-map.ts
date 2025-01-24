import { Kind, Direction, around } from "./types-enum-constants"
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
    spawner_x: number = 0
    spawner_y: number = 0
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
                ctx.fillStyle = "rgb(150,150,150)";
                ctx.fillRect(x * dx, y * dy, dx, dy);
                break
            case Kind.RAIL:
                ctx.fillStyle = "rgb(255,0,0)";
                ctx.fillRect(x * dx, y * dy, dx, dy);
                break
            case Kind.CHANGING_RAIL:
                ctx.fillStyle = "rgb(0,255,0)";
                ctx.fillRect(x * dx, y * dy, dx, dy);
                ctx.strokeStyle = "rgb(0,0,0)"
                ctx.lineWidth = 2
                const content = [
                    { v: Direction.UP, c: "U" },
                    { v: Direction.DOWN, c: "D" },
                    { v: Direction.LEFT, c: "L" },
                    { v: Direction.RIGHT, c: "R" }
                ]
                ctx.fillStyle = "rgb(0,0,0)"
                ctx.fillText(content.find(v => v.v === this.level_directions[y][x])!.c, x * dx + dx / 2, y * dy + dy / 2);
                break
            case Kind.SPAWNER:
                ctx.fillStyle = "rgb(0,0,255)"
                ctx.fillRect(x * dx, y * dy, dx, dy);
                break
            default:
                break
        }
    }

    DrawLineFromOrigin(x: number, y: number, dx: number, dy: number, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgb(0,0,0)"
        ctx.lineWidth = 2
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
        this.DrawLine(direction_before.x, direction_before.y, direction_next.x2, direction_next.y2, ctx)

    }
    SetupMap() {
        for (let y = 0; y < this.level_design.length; y++) {
            for (let x = 0; x < this.level_design[y].length; x++) {
                if (this.level_design[y][x] !== Kind.SPAWNER) {
                    continue
                }
                this.spawner_x = x;
                this.spawner_y = y;
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
    DrawLine(x1: number, y1: number, x2: number, y2: number, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgb(0,0,0)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }
    UpdateLength(length: number) {
        this.length = length
    }
    GetLength() {
        return this.length
    }
    GetPoint(x: number, y: number): Kind {
        if(y >= this.level_design.length || y < 0){
            return Kind.EMPTY
        }
        if(x >= this.level_design[0].length || x < 0){
            return Kind.EMPTY
        }
        return this.level_design[Math.floor(y)][Math.floor(x)]
    }
    GetDirection(x: number, y: number) {
        return this.level_directions[Math.floor(y)][Math.floor(x)]
    }
    GetBefore(x: number, y: number) {
        return this.level_before[Math.floor(y)][Math.floor(x)]
    }
    
}
