
const esbuild = require("esbuild");
const isWatch = process.argv[2] === "watch";
async function watch() {
  let ctx = await esbuild.context({
    entryPoints: ["./src/typescript/app.ts"],
    minify: false,
    outfile: "./src/javascript/app.js",
    bundle: true,
    loader: { ".ts": "ts" },
  });
  if (isWatch) {
    await ctx.watch();
    console.log('Watching...');
  } else {
    await ctx.rebuild();

    console.log('Building...');
    await ctx.dispose(); // Liberamos recursos cuando no estamos en modo watch

  }
}

watch();
