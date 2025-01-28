// this is  a class for checking the buttons
// i should probably add a way of having a way of centralizing the buttons
export class Button{
    width:number
    height:number
    x:number
    y:number
    content:string
    color:string
    constructor(x:number,y:number,width:number,height:number,content:string,color:string="white"){
        this.width=width
        this.height=height
        this.x=x
        this.y=y
        this.content=content
        this.color=color
    }
    update(x:number,y:number,width:number,height:number){
        this.x=x
        this.y=y
        this.width=width
        this.height=height
    }
    isPressed(x:number,y:number){
        return x>=this.x && x<=this.x+this.width && y>=this.y && y<=this.y+this.height
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.fillStyle=this.color
        ctx.fillRect(this.x,this.y,this.width,this.height)
        ctx.fillStyle="black"
        ctx.font="20px Arial"
        ctx.textAlign="center"
        ctx.fillText(this.content,this.x+this.width/2,this.y+this.height/2+10)
    }


}