import { Button } from "./buttons";
import { first_map, second_map, third_map } from "./maps";
import { Kind } from "./types-enum-constants";

// here we will have the selection menu

// you will select the levels
export class SelectionMenu{
    buttons:Button[]=[]
    // the height and width of the canvas
    height:number
    width:number
    // 
    levels:Kind[][][]=[]

    constructor(height:number,width:number){
        this.height=height
        this.width=width
        this.levels=[first_map ,second_map,third_map]
        this.buttons.push(new Button(100,50,100,50,"Level 1"))
        this.buttons.push(new Button(100,50,100,100,"Level 2"))
        this.buttons.push(new Button(100,50,100,150,"Level 3"))
    }
    update(canvas:HTMLCanvasElement){
        this.height=canvas.height
        this.width=canvas.width
    }
    onClick(x:number,y:number):Kind[][]{
        console.log("clicked")
        for(let i=0;i<this.buttons.length;i++){
            if(this.buttons[i].isPressed(x,y)){
                return this.levels[i]
            }
        }
        return []
    }
    draw(ctx:CanvasRenderingContext2D){
        // como maximo quisiera 4 botones por fila
        const buttons_per_row=4
        const button_width=this.width/buttons_per_row
        const button_height=this.height/buttons_per_row
        console.log("drawing")
        for(let i=0;i<this.buttons.length;i++){
            this.buttons[i].update(i*button_width,0,button_width,button_height)
            this.buttons[i].draw(ctx)
        }
    }
}