import { GameMap } from "./game-map"
import { Train } from "./train"
import { first_map ,second_map,third_map} from "./maps"
import { Button } from "./buttons"
import { SelectionMenu } from "./selection_menu"


// i should add something for the game over
export class Game {
    gameMap: GameMap
    state = 0
    trains: Train[] = []
    private lastFrameTime: number = 0
    private readonly FPS = 60
    private readonly frameDelay = 1000 / this.FPS
    private spawnTrainTime = 3500
    private spawnTrainTimelapse: number = this.spawnTrainTime
    private readonly initial_time:number=1000*60*2// 2 minutes i guess that would be good 
    private current_time:number=this.initial_time

    correct_trains: number = 0
    total_trains: number = 0
    play_button:Button
    selection_menu:SelectionMenu  
    score_window_x:number=0
    score_window_y:number=0
    score_window_width:number=0
    score_window_height:number=0
    constructor() {
        this.gameMap = new GameMap(first_map)
        this.play_button=new Button(100,50,100,100,"Play")
        this.selection_menu=new SelectionMenu(100,50)
        this.score_window_x=100
        this.score_window_y=100
        this.score_window_width=50
        this.score_window_height=50
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
        // so we gotta draw the text of the score and shit
        ctx.fillStyle="rgb(179, 177, 177)"
        ctx.fillRect(this.score_window_x,this.score_window_y,this.score_window_width,this.score_window_height)
        ctx.fillStyle="rgb(0,0,0)"
        ctx.font = "10px Arial"
        // it has to show the m:ss
        const minutes=Math.floor(this.current_time/1000/60)
        const seconds=Math.floor((this.current_time/1000)%60)
        ctx.fillText(`${minutes}:${seconds}| ${this.correct_trains} of ${this.total_trains}`, this.score_window_x+this.score_window_width/2, this.score_window_y+this.score_window_height/2)
        if(this.current_time<=0){
            this.state=3
        }
        console.log("TODO add a gaming class for keeping this separate outside of the render loop to make it easier to manage")
    }
    async drawGameOver(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const width=canvas.width/10
        const height=canvas.height/10
        ctx.fillStyle="rgb(0,0,0)"
        ctx.fillRect(canvas.width/2-width/2 ,canvas.height/2-height/2,width,height)
        ctx.fillStyle="rgb(255,255,255)"
        ctx.font = "10px Arial"
        ctx.fillText(`Game Over`, canvas.width/2-width/2, canvas.height/2-height/2+20)
        ctx.fillText(`${this.correct_trains} of ${this.total_trains}`, canvas.width/2-width/2, canvas.height/2-height/2+40)
        console.log("TODO add game over class")
    }
    async draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

        const currentTime = performance.now()
        const deltaTime = currentTime - this.lastFrameTime
        if(this.state===2){            
                this.spawnTrainTimelapse -= deltaTime
                this.current_time-=deltaTime
        }
        
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
                case 3:
                    this.drawGameOver(canvas, ctx)
                    
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
        this.score_window_width=canvas.width/10
        this.score_window_height=canvas.height/10

        this.score_window_x=canvas.width-this.score_window_width
        this.score_window_y=0


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
                    this.windowResize(canvas)
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