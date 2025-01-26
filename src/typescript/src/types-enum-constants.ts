export enum Direction {
    NEUTRAL,
    LEFT,
    RIGHT,
    UP,
    DOWN
}
export enum Kind {
    EMPTY,
    HOUSE,
    RAIL,
    CHANGING_RAIL,
    SPAWNER
}
export const around: [number, number, Direction][] = [
    [1, 0, Direction.UP],
    [-1, 0, Direction.DOWN],
    [0, -1, Direction.LEFT],
    [0, 1, Direction.RIGHT]
]

export const colors=["rgb(255,100,255)","rgb(255,255,255)","rgb(0,0,255)","rgb(255,0,0)","rgb(0,255,0)","rgb(255,255,0)","rgb(0,255,255)","rgb(255,0,255)","rgb(128,128,128)","rgb(128,0,0)","rgb(128,128,0)","rgb(0,128,0)","rgb(0,0,128)","rgb(128,0,128)","rgb(0,128,128)","rgb(128,128,128)"]

export function draw_circle(x:number,y:number,dx:number,dy:number,radious:number,ctx:CanvasRenderingContext2D,color:string,shadowBlur:number){
    const prev_shadow = ctx.shadowColor
    const prev_glow = ctx.shadowBlur    
    ctx.shadowColor = color;
    ctx.shadowBlur = shadowBlur;
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x * dx + dx / 2, y * dy + dy / 2, radious, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
    ctx.shadowColor = prev_shadow
    ctx.shadowBlur = prev_glow
}