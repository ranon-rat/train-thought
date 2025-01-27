import { Button } from "./buttons";

export class GameOver {
    x:number
    y:number
    width:number
    height:number
    ratio_height:number=2//i want this shit to be centered
    ratio_width:number=2//i want this shit to be centered
    gameOverButton:Button
    constructor() {
        this.x=0
        this.y=0
        this.width=0
        this.height=0
        this.gameOverButton=new Button(this.x,this.y,this.width,this.height,"replay","white")
    }
    onClick(x:number,y:number){
        return this.gameOverButton.isPressed(x,y)
    }
    draw( ctx: CanvasRenderingContext2D,correct_trains:number,total_trains:number) {
        ctx.fillStyle = "rgb(0,0,0)"
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "rgb(255,255,255)"
        ctx.font = "10px Arial"
        ctx.fillText(`Game Over`,this.x ,this.y )
        ctx.fillText(`${correct_trains} of ${total_trains}`, this.x + this.width/2, this.y + this.height/2 + 40)
        console.log("TODO add game over class")
        this.gameOverButton.draw(ctx)
    }
    resize(canvas:HTMLCanvasElement){

        this.width = canvas.width / this.ratio_width
        this.height = canvas.height / this.ratio_height
        this.x = canvas.width/2 - this.width
        this.y = canvas.height/2 - this.height
        this.gameOverButton.update(this.x,this.y+this.height/2,this.width,this.height)
       
    }
}