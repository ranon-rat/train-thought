import { GameMap } from "./game-map"
import { Train } from "./train"
import { first_map_string, string2Map ,second_map_string,third_map_string} from "./maps"




export class Game {
    gameMap: GameMap
    state = 1
    trains: Train[] = []
    private lastFrameTime: number = 0
    private readonly FPS = 60
    private readonly frameDelay = 1000 / 60 
    private spawnTrainTime = 5000
    private spawnTrainTimelapse: number = this.spawnTrainTime
    correct_trains: number = 0
    total_trains: number = 0

    constructor() {
        this.gameMap = new GameMap(string2Map(first_map_string))
    }
    spawnTrain() {
        //  if (this.trains.length >= 10) { return }
        const spawners = this.gameMap.spawners
        const random = Math.random() * spawners.length
        const [y,x] = spawners[Math.floor(random)]
        console.log(y,x,spawners)
        const train = new Train(x, y, this.gameMap, Math.floor(Math.random() * this.gameMap.GetHousesLength()))
        this.trains.push(train)
        console.log("TODO train spawn")
    }
    onKeyPress(e: KeyboardEvent,canvas:HTMLCanvasElement) {
        const key=e.key.toLowerCase()
        if (key === "s") {
            this.spawnTrain()
        }
        if (key === "1") {
            this.gameMap = new GameMap(string2Map(first_map_string))
            this.windowResize(canvas)
            this.trains = []
            this.total_trains = 0
            this.correct_trains = 0

        }
        if (key === "2") {
            this.gameMap = new GameMap(string2Map(second_map_string))
            this.windowResize(canvas)
            this.trains = []
            this.total_trains = 0
            this.correct_trains = 0
        }
        if (key === "3") {
            this.gameMap = new GameMap(string2Map(third_map_string))
            this.windowResize(canvas)
            this.trains = []
            this.total_trains = 0
            this.correct_trains = 0
        }
    }
    async draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const currentTime = performance.now()
        const deltaTime = currentTime - this.lastFrameTime
        this.spawnTrainTimelapse -= deltaTime

        if (this.spawnTrainTimelapse <= 0) {
            if (Math.random() < 0.5) {
                this.spawnTrain()
            }
            this.spawnTrainTimelapse = this.spawnTrainTime
        }

        if (deltaTime >= this.frameDelay) {
            this.trains.forEach(train => {
                train.changeSpeed(deltaTime)
            })
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // Renderizado del frame
            this.gameMap.Draw(canvas, ctx)

            this.trains = this.trains.filter(train => {
                if (train.ready) {
                    this.total_trains++
                    if (train.is_correct) {
                        this.correct_trains++
                    }
                }
                return !train.ready
            })
            await Promise.all(this.trains.map(async (train) => {
                await train.Draw(this.gameMap, ctx)
            }))
            ctx.fillStyle = "rgb(255,255,255)"
            ctx.font = "10px Arial"
            ctx.textAlign = "center"
            ctx.fillText(`${this.correct_trains}/${this.total_trains}`, canvas.width / 2, canvas.height / 2)
            this.lastFrameTime = currentTime

        }

        requestAnimationFrame(() => this.draw(canvas, ctx))

    }
    windowResize(canvas: HTMLCanvasElement) {
        const width = Math.min(900, window.innerWidth)
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