import { GameMap } from "./game-map"
import { Train } from "./train"
import { first_map ,second_map,third_map} from "./maps"
import { Button } from "./buttons"
import { SelectionMenu } from "./selection_menu"




export class Game {
    gameMap: GameMap
    state = 0
    trains: Train[] = []
    private lastFrameTime: number = 0
    private readonly FPS = 60
    private readonly frameDelay = 1000 / this.FPS
    private spawnTrainTime = 3500
    private spawnTrainTimelapse: number = this.spawnTrainTime
    correct_trains: number = 0
    total_trains: number = 0
    play_button:Button
    selection_menu:SelectionMenu    
    constructor() {
        this.gameMap = new GameMap(first_map)
        this.play_button=new Button(100,50,100,100,"Play")
        this.selection_menu=new SelectionMenu(100,50)
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
            this.gameMap = new GameMap(first_map)
            this.windowResize(canvas)
            this.trains = []
            this.total_trains = 0
            this.correct_trains = 0

        }
        if (key === "2") {
            this.gameMap = new GameMap(second_map)
            this.windowResize(canvas)
            this.trains = []
            this.total_trains = 0
            this.correct_trains = 0
        }
        if (key === "3") {
            this.gameMap = new GameMap(third_map)
            this.windowResize(canvas)
            this.trains = []
            this.total_trains = 0
            this.correct_trains = 0
        }
    }
    async drawMenu(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.play_button.update(canvas.width/2-this.play_button.width/2,canvas.height/2-this.play_button.height/2,this.play_button.width,this.play_button.height)
        this.play_button.draw(ctx);
    }
    async drawGame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D,deltaTime:number) {
        if (this.spawnTrainTimelapse <= 0) {
            if (Math.random() < 0.5) {
                this.spawnTrain()
            }
            this.spawnTrainTimelapse = this.spawnTrainTime
        }
        this.gameMap.Draw(canvas, ctx)
        this.trains.forEach(train => {
            train.changeSpeed(deltaTime)
        })

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
    }
    async draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

        const currentTime = performance.now()
        const deltaTime = currentTime - this.lastFrameTime
        this.spawnTrainTimelapse -= deltaTime
        
        
        if (deltaTime >= this.frameDelay) {
           
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            switch (this.state) {
                case 0:
                    this.drawMenu(canvas, ctx)
                    break
                case 1:
                    this.selection_menu.draw(ctx)
                    break
                case 2:
                    this.drawGame(canvas, ctx,deltaTime)
                    break
            }
          
            this.lastFrameTime = currentTime

        }

        requestAnimationFrame(() => this.draw(canvas, ctx))

    }
    windowResize(canvas: HTMLCanvasElement) {
        const width = Math.min(900, window.innerWidth)
        const dx = width / this.gameMap.width
        this.gameMap.UpdateLength(dx)
        this.selection_menu.update(canvas)
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
                console.log("add meny")
                if (this.play_button.isPressed(x, y)) {
                    this.state = 1
                }
                break
            case 1:
                // add level selection
                const level=this.selection_menu.onClick(x,y)
                if(level){
                    this.gameMap=new GameMap(level)
                    this.gameMap.UpdateLength(canvas.width/this.gameMap.width)
                    this.state=2

                }
                break
            case 2:// game
                this.gameMap.Click(x, y, canvas.width, canvas.height)
                break
            default:
                break
        }
    }
}