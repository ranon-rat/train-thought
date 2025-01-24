
const esbuild = require("esbuild");
async function watch() {
  let ctx = await esbuild.context({
    entryPoints: ["./src/typescript/app.ts"],
    minify: false,
    outfile: "./src/javascript/app.js",
    bundle: true,
    loader: { ".ts": "ts" },
  });
  await ctx.watch();
  console.log('Watching...');
}

watch();
