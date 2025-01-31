import { Direction } from "./types-enum-constants"
export const [MAPS_WIDTH, MAPS_HEIGHT] = [22, 12]
export const [MAX_WIDTH, MAX_HEIGHT] = [900, (900 / MAPS_WIDTH) * MAPS_HEIGHT]

export const AROUND: [number, number, Direction][] = [
    [1, 0, Direction.UP],
    [-1, 0, Direction.DOWN],
    [0, -1, Direction.LEFT],
    [0, 1, Direction.RIGHT]
]

export const COLORS = ["rgb(255,100,255)", "rgb(255,150,150)", "rgb(0,0,255)", "rgb(255,0,0)", "rgb(0,255,0)", "rgb(255,255,0)", "rgb(0,255,255)", "rgb(255,0,255)", "rgb(128,128,128)", "rgb(128,0,0)", "rgb(128,128,0)", "rgb(0,128,0)", "rgb(0,0,128)", "rgb(128,0,128)", "rgb(0,128,128)", "rgb(128,128,128)"]
