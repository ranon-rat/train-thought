import { GameMap } from "./game-map"
import { Train } from "./train"
import { Kind } from "./types-enum-constants"
function string2Map(map: string) {
    return map.split("\n").map(line => line.split("").map(char => {
        switch (char) {
            case "H": return Kind.HOUSE
            case "C": return Kind.CHANGING_RAIL
            case "R": return Kind.RAIL
            case "S": return Kind.SPAWNER
            default: return Kind.EMPTY
        }
    }))
}
const map_string = [
    "----------------------",
    "--H------H------------",
    "--R------R------------",
    "--CRRRRRRCRRS---------",
    "--R-------------------",
    "--R-------------------",
    "--R-------------------",
    "--R-------------------",
    "--H-------------------",
    "----------------------",
].join("\n");
export class Game {
    gameMap: GameMap
    state = 1
    trains: Train[] = []
    private lastFrameTime: number = 0
    private readonly FPS = 60
    private readonly frameDelay = 1000 / 60 // tiempo mínimo entre frames en ms
    private spawnTrainTime = 10000
    private spawnTrainTimelapse: number = this.spawnTrainTime
    correct_trains: number = 0
    total_trains: number = 0

    constructor() {
        this.gameMap = new GameMap(string2Map(map_string))
    }
    spawnTrain() {
        //  if (this.trains.length >= 10) { return }
        const spawners = this.gameMap.spawners
        const random = Math.random() * spawners.length
        const spawner = spawners[Math.floor(random)]
        const train = new Train(spawner[1], spawner[0], this.gameMap, Math.floor(Math.random() * this.gameMap.GetHousesLength()))
        this.trains.push(train)
        console.log("TODO train spawn")
    }
    onKeyPress(e: KeyboardEvent) {
        if (e.key === "s") {
            this.spawnTrain()
        }
    }
    async draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const currentTime = performance.now()
        const deltaTime = currentTime - this.lastFrameTime
        this.spawnTrainTimelapse -= deltaTime

        if (this.spawnTrainTimelapse <= 0) {
            // TODO: spawn trains every few seconds
            console.log("TODO: spawn trains every few seconds")
            this.spawnTrainTimelapse = this.spawnTrainTime
            //   this.spawnTrainTimelapse = this.spawnTrainTime
            //   this.spawnTrain(0, 0)

        }


        if (deltaTime >= this.frameDelay) {
            this.trains.forEach(train => {
                train.changeSpeed(deltaTime)
            })
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // Renderizado del frame
            this.gameMap.Draw(canvas, ctx)

            this.trains = this.trains.filter(train => {
                this.total_trains++
                if (!train.is_correct) {
                    this.correct_trains++
                }
                return !train.ready
            })
            this.trains.forEach((train) => {
                train.Draw(this.gameMap, ctx)

            })
            this.lastFrameTime = currentTime

        }

        requestAnimationFrame(() => this.draw(canvas, ctx))

    }
    windowResize(canvas: HTMLCanvasElement) {
        const width = Math.min(800, window.innerWidth)
        const dx = width / this.gameMap.width
        this.gameMap.UpdateLength(dx)
        canvas.width = width
        canvas.height = dx * this.gameMap.height
        this.trains.forEach(train => {
            train.resize(dx)
        })

    }
    click(e: MouseEvent, canvas: HTMLCanvasElement) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        switch (this.state) {
            case 0:
                // Todo Add Menu 
                break
            case 1:// game
                this.gameMap.Click(x, y, canvas.width, canvas.height)
                break
            default:
                break
        }
    }
}