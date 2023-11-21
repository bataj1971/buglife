import { Arena } from "../Game/Arena";
import { Bug, BugSexOptions } from "../Game/Bug";
import { Food } from "../Game/Food";
import { GameScreen } from "./GameScreen";

export class ArenaView extends GameScreen {
  private arena: Arena;
  constructor(arena: Arena) {
    super();
    this.arena = arena;
  }

  showArena() {
    this.displayFoods();
    this.displayBugs();
  }

  drawFood(food: Food) {
    const pos = food.getPos();
    const value = food.getValue();
    this.drawCircle(pos.x, pos.y, value * 0.03, "gray", value);
  }

  displayBugs() {
    this.arena.getBugList().forEach((bug: Bug) => this.drawBug(bug));
  }

  drawBug(bug: Bug) {
    if (bug.getBody() <= 0) { 
      return;
    }
    const pos = bug.getPos();
    const body = bug.getBody();
    const sex = bug.getSex() === BugSexOptions.male ? 0.5 : 1;
    const type = bug.getType();
    
    let color = "rgba(" + 255 * sex + "," + 255 * sex + "," + 255 * sex + ",1)";
    switch (type) {
      case "simplebug":
        color = "rgba(0," + 255 * sex + ",0,1)";
        break;
      case "runnerbug":
        color = "rgba(0,0," + 255 * sex + ",1)";
        break;
      case "killerbug":
        color = "rgba(" + 255 * sex + ",0,0,1)";
        break;      
    }


    try {
      this.drawCircle(pos.x, pos.y, body * 0.3, color, 1);  
    } catch (error) {
      console.log("Error occured with bug:",bug);
      
      console.error(error);
    }
    
  }

  displayFoods() {
    this.arena.getFoodList().forEach((food: Food) => this.drawFood(food));
  }
}
