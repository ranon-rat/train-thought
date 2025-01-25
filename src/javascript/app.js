"use strict";
(() => {
  // src/typescript/src/types-enum-constants.ts
  var around = [
    [1, 0, 3 /* UP */],
    [-1, 0, 4 /* DOWN */],
    [0, -1, 1 /* LEFT */],
    [0, 1, 2 /* RIGHT */]
  ];

  // src/typescript/src/game-map.ts
  var GameMap = class {
    constructor(level_design) {
      this.level_design = [
        [0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */],
        [1 /* HOUSE */, 2 /* RAIL */, 3 /* CHANGING_RAIL */, 2 /* RAIL */, 2 /* RAIL */, 1 /* HOUSE */, 0 /* EMPTY */],
        [0 /* EMPTY */, 0 /* EMPTY */, 2 /* RAIL */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */],
        [0 /* EMPTY */, 0 /* EMPTY */, 2 /* RAIL */, 2 /* RAIL */, 2 /* RAIL */, 4 /* SPAWNER */, 0 /* EMPTY */],
        [0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */, 0 /* EMPTY */]
      ];
      // y x 
      this.spawners = [];
      this.houses_id = [];
      this.houses_length = 0;
      this.spawner_x = 0;
      this.spawner_y = 0;
      this.width = 0;
      this.height = 0;
      this.length = 0;
      this.length = level_design.length;
      this.level_design = level_design.slice();
      this.level_directions = level_design.map((row) => row.map(() => 0 /* NEUTRAL */));
      this.level_before = level_design.map((row) => row.map(() => 0 /* NEUTRAL */));
      this.changing_rails_directions = level_design.map((row) => row.map(() => []));
      this.changing_rails_pos = level_design.map((row) => row.map(() => 0));
      this.houses_id = level_design.map((row) => row.map(() => -1));
      this.width = level_design[0].length;
      this.height = level_design.length;
      this.SetupMap();
    }
    async Draw(canvas2, ctx2) {
      const dx = this.length;
      const dy = this.length;
      const promises = [];
      for (let y = 0; y < this.level_design.length; y++) {
        for (let x = 0; x < this.level_design[y].length; x++) {
          promises.push((async () => {
            this.DrawPart(x, y, dx, dy, this.level_design[y][x], ctx2);
            if ([0 /* EMPTY */, 1 /* HOUSE */, 4 /* SPAWNER */].includes(this.level_design[y][x])) {
              return;
            }
            this.DrawLineFromOrigin(x, y, dx, dy, ctx2);
          })());
        }
      }
      await Promise.all(promises);
    }
    DrawPart(x, y, dx, dy, kind, ctx2) {
      switch (kind) {
        case 1 /* HOUSE */:
          ctx2.fillStyle = "rgb(150,150,150)";
          ctx2.fillRect(x * dx, y * dy, dx, dy);
          break;
        case 2 /* RAIL */:
          ctx2.fillStyle = "rgb(255,0,0)";
          ctx2.fillRect(x * dx, y * dy, dx, dy);
          break;
        case 3 /* CHANGING_RAIL */:
          ctx2.fillStyle = "rgb(0,255,0)";
          ctx2.fillRect(x * dx, y * dy, dx, dy);
          ctx2.strokeStyle = "rgb(0,0,0)";
          ctx2.lineWidth = 2;
          const content = [
            { v: 3 /* UP */, c: "U" },
            { v: 4 /* DOWN */, c: "D" },
            { v: 1 /* LEFT */, c: "L" },
            { v: 2 /* RIGHT */, c: "R" }
          ];
          ctx2.fillStyle = "rgb(0,0,0)";
          ctx2.fillText(content.find((v) => v.v === this.level_directions[y][x]).c, x * dx + dx / 2, y * dy + dy / 2);
          break;
        case 4 /* SPAWNER */:
          ctx2.fillStyle = "rgb(0,0,255)";
          ctx2.fillRect(x * dx, y * dy, dx, dy);
          break;
        default:
          break;
      }
    }
    DrawLineFromOrigin(x, y, dx, dy, ctx2) {
      ctx2.strokeStyle = "rgb(0,0,0)";
      ctx2.lineWidth = 2;
      const center_x = x * dx + dx / 2;
      const center_y = y * dy + dy / 2;
      const [up_y, down_y, left_x, right_x] = [(y + 1) * dy, y * dy, x * dx, (x + 1) * dx];
      const before = this.level_before[y][x];
      const next = this.level_directions[y][x];
      const around2 = [
        { v: 3 /* UP */, x: center_x, y: down_y, x2: center_x, y2: up_y },
        { v: 4 /* DOWN */, x: center_x, y: up_y, x2: center_x, y2: down_y },
        { v: 1 /* LEFT */, x: right_x, y: center_y, x2: left_x, y2: center_y },
        { v: 2 /* RIGHT */, x: left_x, y: center_y, x2: right_x, y2: center_y }
      ];
      const direction_before = around2.find((v) => v.v === before);
      const direction_next = around2.find((v) => v.v === next);
      this.DrawLine(direction_before.x, direction_before.y, direction_next.x2, direction_next.y2, ctx2);
    }
    SetupMap() {
      for (let y = 0; y < this.level_design.length; y++) {
        for (let x = 0; x < this.level_design[y].length; x++) {
          if (this.level_design[y][x] !== 4 /* SPAWNER */) {
            continue;
          }
          this.spawner_x = x;
          this.spawner_y = y;
          this.SetupPlayingMap(y, x, 0 /* NEUTRAL */);
          return;
        }
      }
      throw new Error("No spawner found");
    }
    Click(x, y, width, height) {
      const level_x = Math.floor(x / width * this.width);
      const level_y = Math.floor(y / height * this.height);
      this.UpdateChangingRails(level_x, level_y);
    }
    CheckDirections(x, y, before) {
      const checkAround = around.filter(
        (v) => !(before === 4 /* DOWN */ && v[2] === 3 /* UP */) && !(before === 3 /* UP */ && v[2] === 4 /* DOWN */) && !(before === 1 /* LEFT */ && v[2] === 2 /* RIGHT */) && !(before === 2 /* RIGHT */ && v[2] === 1 /* LEFT */)
      );
      const output = [];
      for (let d of checkAround) {
        const [j, i] = d;
        if (y + j >= this.level_design.length || y + j < 0) {
          continue;
        }
        if (x + i >= this.level_design[0].length || x + i < 0) {
          continue;
        }
        if (this.level_design[y + j][x + i] === 0 /* EMPTY */) {
          continue;
        }
        output.push(d);
      }
      return output;
    }
    SetupPlayingMap(y, x, before) {
      this.level_before[y][x] = before;
      const elementType = this.level_design[y][x];
      if (elementType == 1 /* HOUSE */) {
        this.houses_id[y][x] = this.houses_length;
        this.houses_length++;
        return;
      }
      if (elementType === 4 /* SPAWNER */) {
        this.spawners.push([y, x]);
      }
      const directions = this.CheckDirections(x, y, before);
      if (directions.length == 0) {
        return;
      }
      this.level_directions[y][x] = directions[0][2];
      if (elementType === 4 /* SPAWNER */ || elementType === 2 /* RAIL */) {
        const [j, i, v] = directions[0];
        this.SetupPlayingMap(y + j, x + i, v);
        return;
      }
      if (elementType === 3 /* CHANGING_RAIL */) {
        for (let d of directions) {
          const [j, i, v] = d;
          this.changing_rails_directions[y][x].push(v);
          this.SetupPlayingMap(y + j, x + i, v);
        }
        return;
      }
    }
    CheckHouse(x, y) {
      return this.houses_id[Math.floor(y)][Math.floor(x)];
    }
    GetHousesLength() {
      return this.houses_length;
    }
    UpdateChangingRails(x, y) {
      if (this.GetPoint(x, y) !== 3 /* CHANGING_RAIL */) {
        return;
      }
      this.changing_rails_pos[y][x]++;
      if (this.changing_rails_pos[y][x] >= this.changing_rails_directions[y][x].length) {
        this.changing_rails_pos[y][x] = 0;
      }
      this.level_directions[y][x] = this.changing_rails_directions[y][x][this.changing_rails_pos[y][x]];
    }
    DrawLine(x1, y1, x2, y2, ctx2) {
      ctx2.strokeStyle = "rgb(0,0,0)";
      ctx2.lineWidth = 2;
      ctx2.beginPath();
      ctx2.moveTo(x1, y1);
      ctx2.lineTo(x2, y2);
      ctx2.stroke();
    }
    UpdateLength(length) {
      this.length = length;
    }
    GetLength() {
      return this.length;
    }
    GetPoint(x, y) {
      if (y >= this.level_design.length || y < 0) {
        return 0 /* EMPTY */;
      }
      if (x >= this.level_design[0].length || x < 0) {
        return 0 /* EMPTY */;
      }
      return this.level_design[Math.floor(y)][Math.floor(x)];
    }
    GetDirection(x, y) {
      return this.level_directions[Math.floor(y)][Math.floor(x)];
    }
    GetBefore(x, y) {
      return this.level_before[Math.floor(y)][Math.floor(x)];
    }
  };

  // src/typescript/src/train.ts
  var Train = class {
    constructor(x, y, map, house_id) {
      this.x = 0;
      this.y = 0;
      // con esto lo preprao para eliminarlo
      this.ready = false;
      // con este el tren muere
      this.length = 0;
      this.angle = 0;
      // per second that means 1000 milliseconds
      this.initialVelocity = 0.5;
      this.velocity = this.initialVelocity / 1e3;
      this.house_id = -1;
      this.is_correct = false;
      this.rotatingDirection = 0 /* NEUTRAL */;
      this.length = map.GetLength() / 2;
      this.y = y + 0.5;
      this.x = x + 0.5;
      this.house_id = house_id;
    }
    resize(length) {
      this.length = length / 2;
    }
    Move(map, x, y) {
      const before = map.GetBefore(x, y);
      let next = map.GetDirection(x, y);
      let point = map.GetPoint(x, y);
      let [dx, dy] = [0, 0];
      if (next === 0 /* NEUTRAL */) {
        return [dx, dy];
      }
      if (this.rotatingDirection === 0 /* NEUTRAL */ || point !== 3 /* CHANGING_RAIL */) {
        this.rotatingDirection = next;
      }
      next = this.rotatingDirection;
      if (before !== next && before !== 0 /* NEUTRAL */) {
        console.log(this.printDirection(before), this.printDirection(next));
        const vector = Math.SQRT1_2;
        const [to_go_UP, to_go_DOWN, to_go_LEFT, to_go_RIGHT] = [-vector, vector, -vector, vector];
        switch (true) {
          // viene de abajo va hacia arriba
          case (before === 4 /* DOWN */ && next === 1 /* LEFT */):
          case (before === 1 /* LEFT */ && next === 4 /* DOWN */):
            [dx, dy] = [to_go_LEFT, to_go_UP];
            break;
          // viene de al lado va hacia arriba
          case (before === 1 /* LEFT */ && next === 3 /* UP */):
          case (before === 3 /* UP */ && next === 1 /* LEFT */):
            [dx, dy] = [to_go_LEFT, to_go_DOWN];
            break;
          // viene de abajo va hacia arriba 
          case (before === 4 /* DOWN */ && next === 2 /* RIGHT */):
          case (before === 2 /* RIGHT */ && next === 4 /* DOWN */):
            [dx, dy] = [to_go_RIGHT, to_go_UP];
            break;
          // viene de arriba va hacia al abajo
          case (before === 3 /* UP */ && next === 2 /* RIGHT */):
          case (before === 2 /* RIGHT */ && next === 3 /* UP */):
            [dx, dy] = [to_go_RIGHT, to_go_DOWN];
            break;
          default:
            [dx, dy] = this.getNextPosition(next);
            break;
        }
      } else {
        [dx, dy] = this.getNextPosition(next);
        if (point !== 3 /* CHANGING_RAIL */) {
          this.rotatingDirection = 0 /* NEUTRAL */;
        }
      }
      return [dx, dy];
    }
    printDirection(direction) {
      switch (direction) {
        case 2 /* RIGHT */:
          return "RIGHT";
        case 1 /* LEFT */:
          return "LEFT";
        case 3 /* UP */:
          return "UP";
        case 4 /* DOWN */:
          return "DOWN";
        default:
          return "NEUTRAL";
      }
    }
    // x y 
    getNextPosition(direction) {
      switch (direction) {
        case 2 /* RIGHT */:
          return [1, 0];
        case 1 /* LEFT */:
          return [-1, 0];
        case 3 /* UP */:
          return [0, 1];
        case 4 /* DOWN */:
          return [0, -1];
        default:
          return [0, 0];
      }
    }
    Draw(map, ctx2) {
      const point = map.GetPoint(this.x, this.y);
      const [dx, dy] = this.Move(map, this.x, this.y);
      if (![0 /* EMPTY */, 1 /* HOUSE */].includes(point)) {
        this.x += dx * this.velocity;
        this.y += dy * this.velocity;
        ctx2.fillStyle = "black";
        ctx2.fillRect(this.x * map.length, this.y * map.length, 10, 10);
        return;
      }
      this.is_correct = map.CheckHouse(this.x, this.y) === this.house_id;
      this.ready = true;
    }
    // entonces como puedo definir hacia donde he de ir? hmmmm
    // aqui le paso el delta time de los fps 
    changeSpeed(time) {
      this.velocity = this.initialVelocity * (time / 1e3);
    }
  };

  // src/typescript/src/game.ts
  function string2Map(map) {
    return map.split("\n").map((line) => line.split("").map((char) => {
      switch (char) {
        case "H":
          return 1 /* HOUSE */;
        case "C":
          return 3 /* CHANGING_RAIL */;
        case "R":
          return 2 /* RAIL */;
        case "S":
          return 4 /* SPAWNER */;
        default:
          return 0 /* EMPTY */;
      }
    }));
  }
  var map_string = [
    "-----------",
    "--H--H-----",
    "--R--R-----",
    "--CRRCRRS--",
    "--R--------",
    "--R--------",
    "--H--------",
    "-----------"
  ].join("\n");
  var Game = class {
    constructor() {
      this.state = 1;
      this.trains = [];
      this.lastFrameTime = 0;
      this.FPS = 60;
      this.frameDelay = 1e3 / 60;
      // tiempo mínimo entre frames en ms
      this.spawnTrainTime = 1e3;
      this.spawnTrainTimelapse = this.spawnTrainTime;
      this.correct_trains = 0;
      this.total_trains = 0;
      this.gameMap = new GameMap(string2Map(map_string));
    }
    spawnTrain() {
      const spawners = this.gameMap.spawners;
      const random = Math.random() * spawners.length;
      const spawner = spawners[Math.floor(random)];
      const train = new Train(spawner[1], spawner[0], this.gameMap, Math.floor(Math.random() * this.gameMap.GetHousesLength()));
      this.trains.push(train);
      console.log("TODO train spawn");
    }
    onKeyPress(e) {
      if (e.key === "s") {
        this.spawnTrain();
      }
    }
    async draw(canvas2, ctx2) {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFrameTime;
      this.spawnTrainTimelapse -= deltaTime;
      if (this.spawnTrainTimelapse <= 0) {
        console.log("TODO: spawn trains every few seconds");
      }
      if (deltaTime >= this.frameDelay) {
        this.trains.forEach((train) => {
          train.changeSpeed(deltaTime);
        });
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        this.gameMap.Draw(canvas2, ctx2);
        this.trains = this.trains.filter((train) => {
          this.total_trains++;
          if (!train.is_correct) {
            this.correct_trains++;
          }
          return !train.ready;
        });
        this.trains.forEach((train) => {
          train.Draw(this.gameMap, ctx2);
        });
        this.lastFrameTime = currentTime;
      }
      requestAnimationFrame(() => this.draw(canvas2, ctx2));
    }
    windowResize(canvas2) {
      const width = Math.min(800, window.innerWidth);
      const dx = width / this.gameMap.width;
      this.gameMap.UpdateLength(dx);
      canvas2.width = width;
      canvas2.height = dx * this.gameMap.height;
      this.trains.forEach((train) => {
        train.resize(dx);
      });
    }
    click(e, canvas2) {
      const rect = canvas2.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      switch (this.state) {
        case 0:
          break;
        case 1:
          this.gameMap.Click(x, y, canvas2.width, canvas2.height);
          break;
        default:
          break;
      }
    }
  };

  // src/typescript/app.ts
  var canvas = document.getElementById("canvas");
  canvas.width = Math.min(window.innerWidth, 600);
  canvas.height = Math.min(window.innerWidth / 1.2, 600 / 1.2);
  var ctx = canvas.getContext("2d");
  var game = new Game();
  game.windowResize(canvas);
  window.addEventListener("resize", () => {
    game.windowResize(canvas);
  });
  canvas.addEventListener("click", (e) => {
    game.click(e, canvas);
  });
  window.addEventListener("keydown", (e) => {
    game.onKeyPress(e);
  });
  game.draw(canvas, ctx);
})();
