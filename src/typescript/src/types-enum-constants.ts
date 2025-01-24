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