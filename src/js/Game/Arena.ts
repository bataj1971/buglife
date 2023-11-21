import { Bug } from "./Bug";
import { Food } from "./Food";
import { Pos } from "./Pos";

export enum GameStatus {
  running,
  stopped,
}

export class Arena {
  private counter: number = 0;
  private xSize: number;
  private ySize: number;
  private gameStatus: GameStatus = GameStatus.stopped;

  private maxBugLimit: number = 500;
  private foodWastePerClick: number = 0.1;
  private bugList: Bug[];
  private foodList: Food[];
  // private bugIdInFocus = 1;
  private bugInFocus?: Bug = undefined;

  constructor(xSize: number, ySize: number) {
    this.xSize = xSize;
    this.ySize = ySize;
    this.bugList = [];
    this.foodList = [];
  }

  start() {
    this.gameStatus = GameStatus.running;
  }

  stop() {
    this.gameStatus = GameStatus.stopped;
  }

  live() {
    this.counter++;

    // iterating over all bugs

    for (const bug of this.bugList) {
      bug.live();
      // -----------------  meet other bugs -----------------
      // moved to Bug.live()
      // const bugList = this.getBugList();
      // bugList.forEach((otherBug: Bug) => {
      //   const distance = bug.distance(otherBug.getPos());
      //   if (distance < 5 && bug !== otherBug) {
      //     bug.meet(otherBug);
      //   } else if (distance < bug.getSettings().viewRadius) {
      //     // TODO
      //     // turnOn( otherBug );
      //   }
      // });

      if (this.bugInFocus === undefined) {
        console.log("ne bug in focus:", bug.id, bug.getType());

        this.bugInFocus = bug;
      }
    }

    // moved to Bug.live()
    // for (const food of this.foodList) {
    //   food.waste(this.foodWastePerClick);
    // }

    // removing dead bugs
    let lastBugAlive:Bug;
    this.bugList = this.bugList.filter((bug: Bug) => {
      let bugIsAlive = bug.isAlive();
      
      if (false == bugIsAlive) {
        const foodValue = bug.getBody();
        const pos = bug.getPos();
        this.addFood(pos, foodValue);
        this.bugInFocus = lastBugAlive;
      }
      lastBugAlive = bug;
      return bugIsAlive;
    });

    // removing empty foodpiles
    this.foodList = this.foodList.filter((food: Food) => !food.isEmpty());
  }

  getBorders(): Pos {
    return new Pos(this.xSize, this.ySize);
  }

  getBugList() {
    return this.bugList;
  }

  getFoodList(): Food[] {
    return this.foodList;
  }
  getCounter(): number {
    return this.counter;
  }

  isIn(pos: Pos): boolean {
    let isin = true;
    if (pos.x < 0) isin = false;
    if (pos.y < 0) isin = false;
    if (pos.x > this.xSize) isin = false;
    if (pos.y > this.ySize) isin = false;

    return isin;
  }

  forceIn(pos: Pos): Pos {
    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;
    if (pos.x > this.xSize) pos.x = this.xSize;
    if (pos.y > this.ySize) pos.y = this.ySize;
    return pos;
  }

  setMaxBugLimit(limit: number) {
    this.maxBugLimit = limit;
  }

  isRunning(): boolean {
    if (this.gameStatus === GameStatus.running) {
      return true;
    }
    return false;
  }

  deleteBug(bugId: number) {}

  getRandomPos() {
    const x = Math.random() * this.xSize;
    const y = Math.random() * this.ySize;
    const pos = new Pos(x, y);
    return pos;
  }

  getBugCount() {
    return this.bugList.length;
  }

  addBug(bug: Bug) {
    if (this.bugList.length < this.maxBugLimit) { 
      this.bugList.push(bug);
      return true;
    } 
    return false;    
  }

  addFood(pos: Pos, value: number) {
    this.foodList.push(new Food(pos, value));
  }
  getBugInFocus(): Bug | undefined {
    return this.bugInFocus;
  }
}
