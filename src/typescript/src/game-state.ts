import { Train } from "./train";
import { GameMap } from "./game-map";
import { Kind } from "./types-enum-constants";
import { scoreWindow } from "./score-window";

export class GameState {
    score: number;
    trains: Train[] = []
    gameMap: GameMap
    spawnTrainTime: number = 3500
    spawnTrainTimelapse: number = this.spawnTrainTime
    total_trains: number = 0
    correct_trains: number = 0
    score_window: scoreWindow
    private readonly initial_time: number = 1000 * 60 * 2// 2 minutes i guess that would be good 

    current_time: number = this.initial_time


    constructor(level: Kind[][], canvas: HTMLCanvasElement) {
        this.score = 0;
        this.gameMap = new GameMap(level)
        this.score_window = new scoreWindow(canvas)
    }
    resize(canvas: HTMLCanvasElement, dx: number) {
        this.score_window.resize(canvas)

        this.gameMap.UpdateLength(dx)

        this.trains.forEach(train => {
            train.resize(dx)
        })
    }
    spawnTrain() {
        //  if (this.trains.length >= 10) { return }
        const spawners = this.gameMap.spawners
        const random = Math.random() * spawners.length
        const [y, x] = spawners[Math.floor(random)]
        console.log(y, x, spawners)
        const train = new Train(x, y, this.gameMap, Math.floor(Math.random() * this.gameMap.GetHousesLength()))
        this.trains.push(train)
    }
    async decreaseTime(deltaTime: number) {
        this.spawnTrainTimelapse -= deltaTime
        this.current_time -= deltaTime
    }
    checkTime() {
        return this.current_time <= 0
    }
    onClick(x: number, y: number, width: number, height: number) {
        this.gameMap.Click(x, y, width, height)
    }
    async updateSpeed(deltaTime: number) {
        this.trains.forEach(train => {
            train.changeSpeed(deltaTime)
        })
    }
    async draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D,) {
        if (this.spawnTrainTimelapse <= 0) {
            this.spawnTrain()

            this.spawnTrainTimelapse = this.spawnTrainTime
        }
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
        // so we gotta draw the text of the score and shit
        this.score_window.draw(ctx, this.current_time, this.correct_trains, this.total_trains)
    }
}