export class scoreWindow{
    x:number
    y:number
    width:number
    height:number
    constructor(x:number,y:number,width:number,height:number){
        this.x=x
        this.y=y
        this.width=width
        this.height=height
    }
    resize(canvas:HTMLCanvasElement){
        this.width = canvas.width / 10
        this.height = canvas.height / 10
        this.x = canvas.width - this.width
    }
    
    draw(ctx:CanvasRenderingContext2D,current_time:number,correct_trains:number,total_trains:number){
        ctx.fillStyle="red"
        ctx.fillRect(this.x,this.y,this.width,this.height)
        ctx.fillStyle = "rgb(179, 177, 177)"
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "rgb(0,0,0)"
        ctx.font = "10px Arial"
        // it has to show the m:ss
        const minutes = Math.floor(current_time / 1000 / 60)
        const seconds = Math.floor((current_time / 1000) % 60)
        ctx.fillText(`${minutes}:${seconds}| ${correct_trains} of ${total_trains}`, this.x + this.width / 2, this.y + this.height / 2)
           
    }
}