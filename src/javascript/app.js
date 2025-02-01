"use strict";
(() => {
  // src/typescript/src/types-enum-constants.ts
  function draw_circle(x, y, radious, ctx2, color, shadowBlur) {
    const prev_shadow = ctx2.shadowColor;
    const prev_glow = ctx2.shadowBlur;
    ctx2.shadowColor = color;
    ctx2.shadowBlur = shadowBlur;
    ctx2.beginPath();
    ctx2.fillStyle = color;
    ctx2.arc(x, y, radious, 0, 2 * Math.PI);
    ctx2.fill();
    ctx2.closePath();
    ctx2.shadowColor = prev_shadow;
    ctx2.shadowBlur = prev_glow;
  }
  function its_out_of_bounds(x, y, list) {
    if (y >= list.length || y < 0) return true;
    return x >= list[y].length || x < 0;
  }
  function DrawLineColor(x1, y1, x2, y2, ctx2, color, glowSize) {
    const prev_shadow = ctx2.shadowColor;
    const prev_glow = ctx2.shadowBlur;
    const prev_stroke = ctx2.strokeStyle;
    const prev_width = ctx2.lineWidth;
    ctx2.strokeStyle = color;
    ctx2.lineWidth = 3;
    ctx2.shadowColor = color;
    ctx2.shadowBlur = glowSize;
    ctx2.beginPath();
    ctx2.moveTo(x1, y1);
    ctx2.lineTo(x2, y2);
    ctx2.stroke();
    ctx2.closePath();
    ctx2.shadowColor = prev_shadow;
    ctx2.shadowBlur = prev_glow;
    ctx2.strokeStyle = prev_stroke;
    ctx2.lineWidth = prev_width;
  }

  // src/typescript/src/const.ts
  var [MAPS_WIDTH, MAPS_HEIGHT] = [22, 12];
  var [MAX_WIDTH, MAX_HEIGHT] = [900, 900 / MAPS_WIDTH * MAPS_HEIGHT];
  var AROUND = [
    [1, 0, 3 /* UP */],
    [-1, 0, 4 /* DOWN */],
    [0, -1, 1 /* LEFT */],
    [0, 1, 2 /* RIGHT */]
  ];
  var COLORS = ["rgb(255,100,255)", "rgb(255,150,150)", "rgb(0,0,255)", "rgb(255,0,0)", "rgb(0,255,0)", "rgb(255,255,0)", "rgb(0,255,255)", "rgb(255,0,255)", "rgb(128,128,128)", "rgb(128,0,0)", "rgb(128,128,0)", "rgb(0,128,0)", "rgb(0,0,128)", "rgb(128,0,128)", "rgb(0,128,128)", "rgb(128,128,128)"];

  // src/typescript/src/text.ts
  var TextInterface = class {
    constructor(x, y, font_size, content, color, font_family, canvas2) {
      this.x = 0;
      this.y = 0;
      this.font_size = 0;
      this.font_family = "Arial";
      this.original_x = x;
      this.original_y = y;
      this.original_font_size = font_size;
      this.resize(canvas2);
      this.font_family = font_family ? font_family : this.font_family;
      this.content = content;
      this.color = color;
    }
    resize(canvas2) {
      this.font_size = this.original_font_size / MAX_WIDTH * canvas2.width;
      this.x = this.original_x / MAX_WIDTH * canvas2.width;
      this.y = this.original_y / MAX_HEIGHT * canvas2.height;
    }
    update_text(content) {
      this.content = content;
    }
    draw(ctx2) {
      ctx2.fillStyle = this.color;
      ctx2.font = `${this.font_size}px ${this.font_family}`;
      ctx2.textAlign = "center";
      ctx2.fillText(this.content, this.x, this.y + this.font_size / 2);
    }
  };

  // src/typescript/src/buttons.ts
  var Button = class {
    constructor(x, y, width, height, content, canvas2, font_size = 10, color = "white") {
      this.width = 0;
      this.height = 0;
      this.x = 0;
      this.y = 0;
      this.original_x = x;
      this.original_y = y;
      this.original_width = width;
      this.original_height = height;
      this.text = new TextInterface(x + width / 2, y + height / 2, 20, content, "black", "Arial", canvas2);
      this.resize(canvas2);
      this.color = color;
    }
    resize(canvas2) {
      this.x = this.original_x / MAX_WIDTH * canvas2.width;
      this.y = this.original_y / MAX_HEIGHT * canvas2.height;
      this.width = this.original_width / MAX_WIDTH * canvas2.width;
      this.height = this.original_height / MAX_HEIGHT * canvas2.height;
      this.text.resize(canvas2);
    }
    isPressed(x, y) {
      return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
    draw(ctx2) {
      ctx2.fillStyle = this.color;
      ctx2.fillRect(this.x, this.y, this.width, this.height);
      this.text.draw(ctx2);
    }
  };

  // src/typescript/src/maps.ts
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
  var cool_map_for_menu = string2Map([
    "----------------------",
    "-RRRRRR-RRRRRRRRRRRRS-",
    "-R----R-R-------------",
    "-RRRR-R-RRRRRRRR-RRR--",
    "----R-R--------R-R-R--",
    "-RRRR-R--------R-R-R--",
    "-R----R--------R-R-R--",
    "-RRRR-R--------R-R-R--",
    "----R-R--------RRR-R--",
    "-HRRR-RRRRRRRR-----R--",
    "-------------RRRRRRR--",
    "----------------------"
  ].join("\n"));
  var first_map = string2Map([
    "----------------------",
    "---------H------------",
    "---------R------------",
    "-----RRRRCRRRCRRRRS---",
    "-----R-------R--------",
    "-----R--HRR--RRRCRRH--",
    "-----R----R-----R-----",
    "--RRRCRR--RR----RRR---",
    "--R----R---R-HRR--R---",
    "--H----RRRRR---RRRR---",
    "----------------------",
    "----------------------"
  ].join("\n").toUpperCase());
  var second_map = string2Map([
    "----------------------",
    "-SRRRRRR--HRRRCRRH----",
    "-------R------R-------",
    "---HRCRCRRRCRRCRRRH---",
    "-----R-----R----------",
    "-----R--H--CRRRCRRH---",
    "-----R--R--R---R------",
    "--HRRCRRR--R---H------",
    "-----------H----------",
    "----------------------",
    "----------------------",
    "----------------------"
  ].join("\n").toUpperCase());
  var third_map = string2Map([
    "----------------------",
    "-----HRRRCRRRCRRRH----",
    "---------R---R--------",
    "---------R---R--------",
    "-HRRCRRRRC-HRCRRCRRS--",
    "----R----R------R-----",
    "----R-H--RR---H-R-----",
    "-HRRC-R---RR--R-RRRH--",
    "----R-RRRR-RRRC-------",
    "-HRRR----R----R-------",
    "------HRRCRRRRCRRH----",
    "----------------------"
  ].join("\n").toUpperCase());

  // src/typescript/src/selection_menu.ts
  var SelectionMenu = class {
    constructor(canvas2) {
      this.buttons = [];
      // the height and width of the canvas
      // the levels
      this.levels = [first_map, second_map, third_map];
      this.buttons_per_row = 4;
      const button_width = MAX_WIDTH / this.buttons_per_row;
      const button_height = MAX_HEIGHT / this.buttons_per_row;
      for (let i = 0; i < this.levels.length; i++) {
        this.buttons.push(
          new Button(
            i * button_width,
            Math.floor(i / this.buttons_per_row) * button_height,
            button_width,
            button_height,
            `Level ${i + 1}`,
            canvas2
          )
        );
      }
    }
    resize(canvas2) {
      for (let i = 0; i < this.levels.length; i++) {
        this.buttons[i].resize(canvas2);
      }
    }
    onClick(x, y) {
      console.log("clicked");
      for (let i = 0; i < this.buttons.length; i++) {
        if (this.buttons[i].isPressed(x, y)) {
          return this.levels[i];
        }
      }
      return [];
    }
    draw(ctx2) {
      for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].draw(ctx2);
      }
    }
  };

  // src/typescript/src/train.ts
  var Train = class {
    constructor(x, y, map, house_id) {
      this.x = 0;
      this.y = 0;
      this.length = 0;
      this.angle = 0;
      // per second that means 1000 milliseconds
      this.initialVelocity = 1;
      this.velocity = this.initialVelocity / 1e3;
      // con esto lo preprao para eliminarlo
      this.ready = false;
      // con este el tren muere
      this.is_correct = false;
      this.house_id = -1;
      // this will keep the direciton that we set for the changing rail constant once it gets to that point.
      this.rotatingDirection = 0 /* NEUTRAL */;
      // improving animations and events
      this.dX = 0;
      this.dY = 0;
      this.length_ratio = 2.1;
      this.length = map.length / this.length_ratio;
      this.y = y + 0.5;
      this.x = x + 0.5;
      this.house_id = house_id;
    }
    resize(canvas2) {
      this.length = canvas2.height / (MAPS_WIDTH * this.length_ratio);
    }
    Move(map, x, y) {
      let [x_l, y_l] = [x, y];
      let point = map.GetPoint(x, y);
      if (point === 1 /* HOUSE */) {
        [x_l, y_l] = [x_l - this.dX / 2, y_l - this.dY / 2];
      }
      const before = map.GetBefore(x_l, y_l);
      let next = map.GetNext(x_l, y_l);
      let [dx, dy] = [0, 0];
      if (next === 0 /* NEUTRAL */) {
        return [dx, dy];
      }
      if (this.rotatingDirection === 0 /* NEUTRAL */ || point !== 3 /* CHANGING_RAIL */) {
        this.rotatingDirection = next;
      }
      next = this.rotatingDirection;
      if (before !== next && before !== 0 /* NEUTRAL */) {
        [dx, dy] = this.curveVector(before, next);
      } else {
        [dx, dy] = this.getDirectionVector(next);
        if (point !== 3 /* CHANGING_RAIL */) {
          this.rotatingDirection = 0 /* NEUTRAL */;
        }
      }
      if (point === 1 /* HOUSE */) {
        [dx, dy] = this.getDirectionVector(next);
      }
      this.dX = dx;
      this.dY = dy;
      return [dx, dy];
    }
    curveVector(before, next) {
      const vector = Math.SQRT1_2;
      const [to_go_UP, to_go_DOWN, to_go_LEFT, to_go_RIGHT] = [-vector, vector, -vector, vector];
      const curves = {
        [`${4 /* DOWN */}_${1 /* LEFT */}`]: [to_go_LEFT, to_go_UP],
        [`${1 /* LEFT */}_${4 /* DOWN */}`]: [to_go_LEFT, to_go_UP],
        [`${1 /* LEFT */}_${3 /* UP */}`]: [to_go_LEFT, to_go_DOWN],
        [`${3 /* UP */}_${1 /* LEFT */}`]: [to_go_LEFT, to_go_DOWN],
        [`${4 /* DOWN */}_${2 /* RIGHT */}`]: [to_go_RIGHT, to_go_UP],
        [`${2 /* RIGHT */}_${4 /* DOWN */}`]: [to_go_RIGHT, to_go_UP],
        [`${3 /* UP */}_${2 /* RIGHT */}`]: [to_go_RIGHT, to_go_DOWN],
        [`${2 /* RIGHT */}_${3 /* UP */}`]: [to_go_RIGHT, to_go_DOWN]
      };
      const key = `${before}_${next}`;
      return curves[key] || this.getDirectionVector(next);
    }
    printDirection(direction) {
      const directions = {
        [2 /* RIGHT */]: "RIGHT",
        [1 /* LEFT */]: "LEFT",
        [3 /* UP */]: "UP",
        [4 /* DOWN */]: "DOWN",
        [0 /* NEUTRAL */]: "NEUTRAL"
      };
      return directions[direction];
    }
    // x y 
    getDirectionVector(direction) {
      const vectors = {
        [2 /* RIGHT */]: [1, 0],
        [1 /* LEFT */]: [-1, 0],
        [3 /* UP */]: [0, 1],
        [4 /* DOWN */]: [0, -1],
        [0 /* NEUTRAL */]: [0, 0]
      };
      return vectors[direction];
    }
    async Draw(map, move, ctx2) {
      const point = map.GetPoint(this.x, this.y);
      const before = map.GetPoint(this.x - this.dX / 2, this.y - this.dY / 2);
      if (before === 1 /* HOUSE */ || point === 0 /* EMPTY */) {
        this.is_correct = map.CheckHouse(this.x, this.y) === this.house_id;
        this.ready = true;
        return;
      }
      if (move) {
        const [dx, dy] = this.Move(map, this.x, this.y);
        if (dx !== 0 || dy !== 0) {
          this.x = dx === 0 ? Math.floor(this.x) + 0.5 : this.x;
          this.y = dy === 0 ? Math.floor(this.y) + 0.5 : this.y;
        }
        this.x += dx * this.velocity;
        this.y += dy * this.velocity;
      }
      this.renderOrb(this.x * map.length, this.y * map.length, this.length, ctx2);
    }
    renderOrb(x, y, height, ctx2) {
      draw_circle(x, y, height / 2, ctx2, COLORS[this.house_id], 20);
    }
    changeSpeed(time) {
      this.velocity = this.initialVelocity * (time / 1e3);
    }
  };

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
    async Draw(ctx2) {
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
          draw_circle(x * dx + dx / 2, y * dy + dy / 2, this.length / 2, ctx2, "rgb(255,255,255)", 0);
          draw_circle(x * dx + dx / 2, y * dy + dy / 2, this.length / 4, ctx2, COLORS[this.houses_id[y][x]], 10);
          ctx2.fillStyle = "black";
          ctx2.textAlign = "center";
          ctx2.font = "10px Arial";
          break;
        case 3 /* CHANGING_RAIL */:
          draw_circle(x * dx + dx / 2, y * dy + dy / 2, this.length / 2, ctx2, "rgb(171, 255, 241,0.5)", 0);
          draw_circle(x * dx + dx / 2, y * dy + dy / 2, this.length / 4, ctx2, "rgb(0,0,0,0.5)", 10);
          break;
        case 4 /* SPAWNER */:
          ctx2.fillStyle = "rgb(0,0,255)";
          ctx2.fillRect(x * dx, y * dy, dx, dy);
          break;
        default:
          break;
      }
    }
    SetupMap() {
      for (let y = 0; y < this.level_design.length; y++) {
        for (let x = 0; x < this.level_design[y].length; x++) {
          if (this.level_design[y][x] !== 4 /* SPAWNER */) {
            continue;
          }
          this.spawners.push([y, x]);
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
      const checkAround = AROUND.filter(
        (v) => !(before === 4 /* DOWN */ && v[2] === 3 /* UP */) && !(before === 3 /* UP */ && v[2] === 4 /* DOWN */) && !(before === 1 /* LEFT */ && v[2] === 2 /* RIGHT */) && !(before === 2 /* RIGHT */ && v[2] === 1 /* LEFT */)
      );
      const output = [];
      for (let d of checkAround) {
        const [j, i] = d;
        if (its_out_of_bounds(x + i, y + j, this.level_design)) {
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
    DrawLineFromOrigin(x, y, dx, dy, ctx2) {
      const center_x = x * dx + dx / 2;
      const center_y = y * dy + dy / 2;
      const [up_y, down_y, left_x, right_x] = [(y + 1) * dy, y * dy, x * dx, (x + 1) * dx];
      const before = this.level_before[y][x];
      const next = this.level_directions[y][x];
      const around = [
        { v: 3 /* UP */, x: center_x, y: down_y, x2: center_x, y2: up_y },
        { v: 4 /* DOWN */, x: center_x, y: up_y, x2: center_x, y2: down_y },
        { v: 1 /* LEFT */, x: right_x, y: center_y, x2: left_x, y2: center_y },
        { v: 2 /* RIGHT */, x: left_x, y: center_y, x2: right_x, y2: center_y }
      ];
      const direction_before = around.find((v) => v.v === before);
      const direction_next = around.find((v) => v.v === next);
      const changing_rails_positions = this.changing_rails_directions[y][x].filter((_, i) => i !== this.changing_rails_pos[y][x]);
      for (let c of changing_rails_positions) {
        let direction_changing_rails = around.find((v) => v.v === c);
        DrawLineColor(direction_before.x, direction_before.y, direction_changing_rails.x2, direction_changing_rails.y2, ctx2, "rgba(255, 255, 255, 0.23)", 15);
      }
      DrawLineColor(direction_before.x, direction_before.y, direction_next.x2, direction_next.y2, ctx2, "rgb(255,255,255)", 15);
    }
    resize(canvas2) {
      this.length = canvas2.width / MAPS_WIDTH;
    }
    GetPoint(x, y) {
      const y_floor = Math.floor(y);
      const x_floor = Math.floor(x);
      if (its_out_of_bounds(x_floor, y_floor, this.level_design)) return 0 /* EMPTY */;
      return this.level_design[y_floor][x_floor];
    }
    GetNext(x, y) {
      const y_floor = Math.floor(y);
      const x_floor = Math.floor(x);
      if (its_out_of_bounds(x_floor, y_floor, this.level_directions)) return 0 /* NEUTRAL */;
      return this.level_directions[y_floor][x_floor];
    }
    GetBefore(x, y) {
      const y_floor = Math.floor(y);
      const x_floor = Math.floor(x);
      if (its_out_of_bounds(x_floor, y_floor, this.level_before)) return 0 /* NEUTRAL */;
      return this.level_before[y_floor][x_floor];
    }
    CheckHouse(x, y) {
      const y_floor = Math.floor(y);
      const x_floor = Math.floor(x);
      if (its_out_of_bounds(x_floor, y_floor, this.houses_id)) return -1;
      return this.houses_id[y_floor][x_floor];
    }
    GetHousesLength() {
      return this.houses_length;
    }
  };

  // src/typescript/src/score-window.ts
  var scoreWindow = class {
    constructor(canvas2) {
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
      this.original_height = MAX_HEIGHT / 10;
      this.original_width = MAX_WIDTH / 10;
      this.original_x = MAX_WIDTH - this.original_width;
      this.original_y = 0;
      this.text = new TextInterface(this.original_x + this.original_width / 2, this.original_y + this.original_height / 2, 10, "", "black", "Arial", canvas2);
      this.resize(canvas2);
    }
    resize(canvas2) {
      this.x = this.original_x / MAX_WIDTH * canvas2.width;
      this.y = this.original_y / MAX_HEIGHT * canvas2.height;
      this.width = this.original_width / MAX_WIDTH * canvas2.width;
      this.height = this.original_height / MAX_HEIGHT * canvas2.height;
      this.text.resize(canvas2);
    }
    draw(ctx2, current_time, correct_trains, total_trains) {
      ctx2.fillStyle = "red";
      ctx2.fillRect(this.x, this.y, this.width, this.height);
      ctx2.fillStyle = "rgb(179, 177, 177)";
      ctx2.fillRect(this.x, this.y, this.width, this.height);
      const minutes = Math.floor(current_time / 1e3 / 60);
      const seconds = Math.floor(current_time / 1e3 % 60);
      this.text.update_text(`${minutes}:${seconds}| ${correct_trains} of ${total_trains}`);
      this.text.draw(ctx2);
    }
  };

  // src/typescript/src/game-state.ts
  var GameState = class {
    constructor(level, canvas2, score_window_yes = true) {
      this.trains = [];
      this.spawnTrainTime = 4500;
      this.spawnTrainTimelapse = this.spawnTrainTime;
      // score
      this.total_trains = 0;
      this.correct_trains = 0;
      this.initial_time = 1e3 * 60 * 2;
      // 2 minutes i guess that would be good 
      this.current_time = this.initial_time;
      this.gameMap = new GameMap(level);
      this.score_window_yes = score_window_yes;
      this.score_window = new scoreWindow(canvas2);
    }
    resize(canvas2) {
      this.score_window.resize(canvas2);
      this.gameMap.resize(canvas2);
      this.trains.forEach((train) => {
        train.resize(canvas2);
      });
    }
    spawnTrain() {
      const spawners = this.gameMap.spawners;
      const random = Math.random() * spawners.length;
      const [y, x] = spawners[Math.floor(random)];
      console.log(y, x, spawners);
      const train = new Train(x, y, this.gameMap, Math.floor(Math.random() * this.gameMap.GetHousesLength()));
      this.trains.push(train);
    }
    async decreaseTime(deltaTime) {
      this.spawnTrainTimelapse -= deltaTime;
      this.current_time -= deltaTime;
    }
    checkTime() {
      return this.current_time <= 0;
    }
    onClick(x, y, width, height) {
      this.gameMap.Click(x, y, width, height);
    }
    async updateSpeed(deltaTime) {
      this.trains.forEach((train) => {
        train.changeSpeed(deltaTime);
      });
    }
    async draw(ctx2, move) {
      if (this.spawnTrainTimelapse <= 0) {
        this.spawnTrain();
        this.spawnTrainTimelapse = this.spawnTrainTime;
      }
      this.gameMap.Draw(ctx2);
      this.trains = this.trains.filter((train) => {
        if (train.ready) {
          this.total_trains++;
          if (train.is_correct) {
            this.correct_trains++;
          }
        }
        return !train.ready;
      });
      await Promise.all(this.trains.map(async (train) => {
        await train.Draw(this.gameMap, move, ctx2);
      }));
      if (this.score_window_yes && move) {
        this.score_window.draw(ctx2, this.current_time, this.correct_trains, this.total_trains);
      }
    }
  };

  // src/typescript/src/initial-menu.ts
  var InitialMenu = class {
    constructor(canvas2) {
      this.canvas_height_ratio = 8;
      this.canvas_width_ratio = 8;
      this.game_state = new GameState(cool_map_for_menu, canvas2, false);
      this.play_button = new Button(
        MAX_WIDTH / 2 - 112 / 2,
        MAX_HEIGHT / 2,
        112,
        61,
        "Play",
        canvas2
      );
    }
    onClick(x, y) {
      return this.play_button.isPressed(x, y);
    }
    decreaseTime(deltaTime) {
      this.game_state.decreaseTime(deltaTime);
    }
    draw(ctx2) {
      this.game_state.draw(ctx2, true);
      this.play_button.draw(ctx2);
    }
    updateSpeed(deltaTime) {
      this.game_state.updateSpeed(deltaTime);
    }
    resize(canvas2) {
      this.game_state.resize(canvas2);
      this.play_button.resize(canvas2);
    }
  };

  // src/typescript/src/game-over.ts
  var GameOver = class {
    constructor(canvas2) {
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
      this.original_height = MAX_HEIGHT / 2;
      this.original_width = MAX_WIDTH / 2;
      this.original_x = (MAX_WIDTH - this.original_width) / 2;
      this.original_y = (MAX_HEIGHT - this.original_height) / 2;
      this.gameOverButton = new Button(
        this.original_x + this.original_width / 2 - this.original_width / 4,
        this.original_y + this.original_height - 95,
        this.original_width / 2,
        70,
        "replay",
        canvas2
      );
      this.gameOverText = new TextInterface(
        this.original_x + this.original_width / 2,
        this.original_y + 30,
        80,
        "Game Over",
        "white",
        "Arial",
        canvas2
      );
      this.scoreBoard = new TextInterface(
        MAX_WIDTH / 2,
        MAX_HEIGHT / 2,
        20,
        "0 of 0",
        "white",
        "Arial",
        canvas2
      );
      this.resize(canvas2);
    }
    onClick(x, y) {
      return this.gameOverButton.isPressed(x, y);
    }
    draw(ctx2, correct_trains, total_trains) {
      ctx2.fillStyle = "rgb(0,0,0)";
      ctx2.fillRect(this.x, this.y, this.width, this.height);
      this.gameOverText.draw(ctx2);
      this.scoreBoard.update_text(`${correct_trains} of ${total_trains}`);
      this.scoreBoard.draw(ctx2);
      this.gameOverButton.draw(ctx2);
    }
    resize(canvas2) {
      this.x = this.original_x / MAX_WIDTH * canvas2.width;
      this.y = this.original_y / MAX_HEIGHT * canvas2.height;
      this.width = this.original_width / MAX_WIDTH * canvas2.width;
      this.height = this.original_height / MAX_HEIGHT * canvas2.height;
      this.gameOverText.resize(canvas2);
      this.scoreBoard.resize(canvas2);
      this.gameOverButton.resize(canvas2);
    }
  };

  // src/typescript/src/game.ts
  var Game = class {
    constructor(canvas2) {
      this.state = 0;
      this.lastFrameTime = 0;
      this.FPS = 60;
      this.frameDelay = 1e3 / this.FPS;
      this.game_state = null;
      // information
      this.correct_trains = 0;
      this.total_trains = 0;
      this.selection_menu = new SelectionMenu(canvas2);
      this.menu = new InitialMenu(canvas2);
      this.selection_menu = new SelectionMenu(canvas2);
      this.game_over = new GameOver(canvas2);
    }
    onKeyPress(e, canvas2) {
      const key = e.key.toLowerCase();
      if (key === "r") {
        this.state = 0;
      }
      if (["q", "n"].includes(key)) {
        this.state = 3;
      }
    }
    async draw(canvas2, ctx2) {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFrameTime;
      this.game_state?.decreaseTime(deltaTime);
      this.menu.decreaseTime(deltaTime);
      if (deltaTime >= this.frameDelay) {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        switch (this.state) {
          case 0:
            this.menu.updateSpeed(deltaTime);
            this.menu.draw(ctx2);
            break;
          case 1:
            this.selection_menu.draw(ctx2);
            break;
          case 2:
            if (!this.game_state) break;
            this.game_state.updateSpeed(deltaTime);
            this.game_state.draw(ctx2, true);
            if (this.game_state.checkTime()) this.state = 3;
            this.correct_trains = this.game_state.correct_trains;
            this.total_trains = this.game_state.total_trains;
            break;
          case 3:
            this.game_state?.draw(ctx2, false);
            this.game_over.draw(ctx2, this.correct_trains, this.total_trains);
            break;
        }
        this.lastFrameTime = currentTime;
      }
      requestAnimationFrame(() => this.draw(canvas2, ctx2));
    }
    windowResize(canvas2) {
      const width = Math.min(MAX_WIDTH, window.innerWidth);
      const dx = width / MAPS_WIDTH;
      canvas2.width = width;
      canvas2.height = dx * MAPS_HEIGHT;
      this.menu.resize(canvas2);
      this.selection_menu.resize(canvas2);
      this.game_over.resize(canvas2);
      if (this.game_state) {
        this.game_state.resize(canvas2);
      }
    }
    click(e, canvas2) {
      const rect = canvas2.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      switch (this.state) {
        case 0:
          if (!this.menu.onClick(x, y)) break;
          this.state = 1;
          break;
        case 1:
          const level = this.selection_menu.onClick(x, y);
          if (!level) break;
          this.game_state = new GameState(level, canvas2);
          this.windowResize(canvas2);
          this.state = 2;
          break;
        case 2:
          if (!this.game_state) break;
          this.game_state.onClick(x, y, canvas2.width, canvas2.height);
          break;
        case 3:
          if (!this.game_over.onClick(x, y)) break;
          this.state = 1;
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
  var game = new Game(canvas);
  game.windowResize(canvas);
  window.addEventListener("resize", () => {
    game.windowResize(canvas);
  });
  canvas.addEventListener("click", (e) => {
    game.click(e, canvas);
  });
  window.addEventListener("keydown", (e) => {
    game.onKeyPress(e, canvas);
  });
  game.draw(canvas, ctx);
})();
