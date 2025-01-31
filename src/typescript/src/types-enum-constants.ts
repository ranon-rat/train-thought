
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

export function draw_circle(x: number, y: number, radious: number, ctx: CanvasRenderingContext2D, color: string, shadowBlur: number) {
    const prev_shadow = ctx.shadowColor
    const prev_glow = ctx.shadowBlur
    ctx.shadowColor = color;
    ctx.shadowBlur = shadowBlur;
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x, y, radious, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
    ctx.shadowColor = prev_shadow
    ctx.shadowBlur = prev_glow
}
export function its_out_of_bounds(x: number, y: number, list: any[][]) {
    if (y >= list.length || y < 0) return true
    return x >= list[y].length || x < 0
}
export function DrawLineColor(x1: number, y1: number, x2: number, y2: number, ctx: CanvasRenderingContext2D, color: string, glowSize: number) {

    // Configurar la sombra para el efecto de neón
    const prev_shadow = ctx.shadowColor
    const prev_glow = ctx.shadowBlur
    const prev_stroke = ctx.strokeStyle
    const prev_width = ctx.lineWidth
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    ctx.shadowColor = color;
    ctx.shadowBlur = glowSize;
    // Dibujar la línea
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.shadowColor = prev_shadow
    ctx.shadowBlur = prev_glow
    ctx.strokeStyle = prev_stroke
    ctx.lineWidth = prev_width
}