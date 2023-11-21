import { ArenaView } from "../Layout/ArenaView";
import { GameControls } from "../Layout/GameControls";
import { GameScreen } from "../Layout/GameScreen";
import { Arena } from "./Arena";
import { Bug } from "./Bug";
import { BaseBugProperty } from "./BugProperties/BaseBugproperty";
import { BugPropertySet } from "./BugProperty";
import { BugSettings } from "./BugSettings";
import { Pos } from "./Pos";

export class GameMaster {
  private arena: Arena;
  private gameScreen: ArenaView;

  private status: boolean = false;
  private runSpeed = 10; // cycle in milisec = 1000 / runspeed
  private timer?: ReturnType<typeof setInterval>;

  private click: number = 0; // click of life - a counter actually
  private controls: GameControls;

  private bugPropertySet: BugPropertySet;

  // private bugBluePrints :

  constructor() {
    this.bugPropertySet = new BugPropertySet();
    this.arena = new Arena(500, 500);
    this.gameScreen = new ArenaView(this.arena);
    this.controls = new GameControls(this);

    this.displayGame();
  }

  start() {
    
    if (false === this.status) {
      this.status = true;
      this.timer = setInterval(this.live.bind(this), 1000 / this.runSpeed);
      this.message("arena is running..");
    } else {
      this.message("arena is allready runnung..");
    }
  }

  stop() {
    if (this.status) {
      this.status = false;
      clearTimeout(this.timer);
      this.message("arena stopped");
    } else {
      this.message("arena is not running.. nothing to stop..");
    }
    this.displayGame();
  }
  setSpeed() {
    const speed = this.controls.getGameSpeed();
    this.stop();
    this.runSpeed = speed;
    this.start();
  }

  live() {
    this.click++;
    this.arena.live();
    this.displayGame();
    this.getStatisctic();    
  }

  displayGame() {
    this.gameScreen.clearView();
    this.gameScreen.showArena();
    this.showStats();
  }

  showStats() {
    const bugcount = this.arena.getBugCount();
    const lifetime = this.arena.getCounter();
    this.controls.displaytBugCount(bugcount);
    this.controls.displayLifeTime(lifetime);
  }


  addBugsToArena() {
    const initialBodyValue = this.controls.getInitialBodyValue();
    
    const numberOfNewBugs = this.controls.getBugNumberToAdd(); 
    
    const type = this.controls.getBugTypeValue();
    // var variability, variabilityMulyplier, value;

    const settings = new BugSettings();
    
    
    for (let propertyName of BugSettings.propertyNames) { 
      const value = this.controls.getInputPropertyValue(propertyName);
      settings.setProperty(propertyName, value);
    }
    
    for (var bugCount = 0; bugCount < numberOfNewBugs; bugCount++) {
       const newBug = new Bug(type , this.arena.getRandomPos(), settings, initialBodyValue, this.arena);
      this.arena.addBug(newBug);
    }

    this.displayGame();
  }

  addFood(pos: Pos) {
    const foodValue = this.controls.getFoodValue();
    this.arena.addFood(pos, foodValue);
    this.displayGame();
  }

  addFoodToRandomLocation() {
    for (let i = 0; i < 10; i++) {
      this.addFood(this.arena.getRandomPos());
    }
  }

  getRandomPos() {
    return this.arena.getRandomPos();
  }

  message(message: string) {
    this.controls.displayMessage(message);
  }

  loadBugTypeProperties() {
    // alert("loadBugTypeProperties:" + this.controls.getBugTypeValue());
    // TODO load preset for the bugtype
    // run evenProperties

  }
  getBugPropertyList() :BaseBugProperty[] {
    return this.bugPropertySet.getProperties();
  }


  getStatisctic() {
    const statByType = new Map<string, typeStat>();
    const bug = this.arena.getBugInFocus();
    
    
    
    if (bug !== undefined) { 
      let bugInfo = new Map<string, any>();
      bugInfo.set("type", bug.getType());
      bugInfo.set("id", bug.id);
      bugInfo.set("body", bug.getBody().toFixed(2));
      bugInfo.set("sex", bug.getSex());
      const bugPos = bug.getPos();
      bugInfo.set("pos", bugPos.x.toFixed(2) + "," + bugPos.y.toFixed(2));
      bugInfo.set("direction", bug.getDirection().toFixed(2)+"°");
      bugInfo.set("speed", bug.getEffectiveSpeed());
      const settings = bug.getSettings();

      const propertyList = this.getBugPropertyList();
      propertyList.forEach((property) => {
        const name = property.getName();
        const value = settings.getValue(name);
        bugInfo.set(name, value);
      });
      
      let report = '';
      bugInfo.forEach((value, key) => {
        report += (key + " : " + bugInfo.get(key) + "<br>");
      });

      // console.log("getStatisctic  bug:", report);
      this.controls.setBugInfoContentElement(report);

    }
    
    this.arena.getBugList().forEach((bug: Bug) => { 
      if (false === statByType.has(bug.getType())) { 
        // const emptySettings: BugSettings = {intelligence:0,turnSpeed:0,}
        // statByType.set(bug.getType(),emptySettings);
      }

    });
  }
}

  interface typeStat { 
    bugCount: number;
    bugProperties: BugSettings;   

  };
