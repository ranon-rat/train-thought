import { Game } from "./src/game";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = Math.min(window.innerWidth,600);
canvas.height = Math.min(window.innerWidth/1.2,600/1.2);
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const game = new Game()
game.windowResize(canvas)
window.addEventListener("resize", () => {
    game.windowResize(canvas)
})
canvas.addEventListener("click", (e) => {
    game.click(e,canvas)
})
window.addEventListener("keydown", (e) => {
    game.onKeyPress(e)
})
game.draw(canvas,ctx)