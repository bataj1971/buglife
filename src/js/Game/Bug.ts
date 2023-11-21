import { Arena } from "./Arena";
import { BugSettings } from "./BugSettings";
import { Food } from "./Food";
import { Pos } from "./Pos";
export enum BugSexOptions {
  male,
  female,
}
export class Bug {
  static lastId = 0;

  private pos: Pos;
  public readonly id: number;
  private body: number;
  private direction: number;
  private iWantToWalk = 1; // value from 0-1 -2 run

  private sex: BugSexOptions;
  private alive: boolean = true;
  private age: number = 0;
  // private childsPerBear: number = 10;
  private settings: BugSettings;
  private reproductionTimeCounter: number;
  private type: string;
  private arena: Arena;


  constructor(type: string, pos: Pos, settings: BugSettings, body: number, arena: Arena) {
    Bug.lastId++;
    this.id = Bug.lastId;

    this.type = type;
    this.pos = pos;
    this.body = body;
    this.sex = this.getRandomSex();
    this.direction = this.getRandomDirection();
    this.settings = settings;
    this.reproductionTimeCounter = 0;
    this.arena = arena;
  }

  /**
   * one lifecycle of the bug: move, eat, attac, bread, get old etc
   */
  live(): boolean {
    if (this.id == 1) {
      // console.log("bug id: ",this.id, this);
    }

    let closestObjectDistance = 999999;
    let attackOrEscape = 0;
    let targetPos: Pos = this.pos;
    this.iWantToWalk = 1;

    // if previously killed in this click by another bug..
    if (false === this.alive) {
      return false;
    }

    this.reproductionTimeCounter++;
    this.age++;

    // todo speed increase body loss.. + * iWantToWalk
    this.body = this.body * 0.999 - 0.001;
    if (this.body < 0.1) {
      this.alive = false;
      return false;
    }

    for (let food of this.arena.getFoodList()) {
      const distance = this.distance(food.getPos());
      if (distance < 20) {
        this.eat(food);
      } else if (distance < this.settings.viewRadius && distance < closestObjectDistance) {
        closestObjectDistance = distance;
        targetPos = food.getPos();
        attackOrEscape = 1; // attack
      }
    }

    for (let otherBug of this.arena.getBugList()) {
      if (otherBug === this) continue;

      const distance = this.distance(otherBug.pos);
      if (distance < 5) {
        this.meet(otherBug);
      } else if (distance < this.settings.viewRadius && distance < closestObjectDistance) {
        closestObjectDistance = distance;
        targetPos = otherBug.getPos();

        // TODO
        // attack, escape, try to mate..
        attackOrEscape = 1; // default attack
        if (otherBug.type == this.type && otherBug.sex !== this.sex) {
          attackOrEscape = 1; // attack
        } else if (otherBug.type !== this.type) {
          attackOrEscape = otherBug.body > this.body * 1.1 ? 1 : -1;
        }
      }
    }

    this.turnOn(targetPos, attackOrEscape);

    this.move();

    return true;
  }

  move() {

    this.pos.x += Math.sin((this.direction * Math.PI) / 180) * this.getEffectiveSpeed();
    this.pos.y -= Math.cos((this.direction * Math.PI) / 180) * this.getEffectiveSpeed();

    if (false === this.arena.isIn(this.pos)) {
      const newDirection = this.direction + 180 + 50 * Math.random();
      this.setDirection(newDirection);
      this.arena.forceIn(this.pos);
    }
  }

  setDirection(newDirection: number) {    
    if (newDirection > 360) newDirection -= 360;
    if (newDirection < 0) newDirection += 360;
    this.direction = newDirection;
  }

  getBody(): number {
    return this.body;
  }

  getDirection(): number {
    return this.direction;
  }

  getAge(): number {
    return this.age;
  }

  getSex(): BugSexOptions {
    return this.sex;
  }

  distance(pos: Pos) {
    return this.pos.distance(pos);
  }

  getRandomSex(): BugSexOptions {
    if (Math.random() > 0.5) {
      return BugSexOptions.female;
    }
    return BugSexOptions.male;
  }

  getRandomDirection(): number {
    return Math.random() * 360;
  }

  makeChildren(otherBug: Bug) {
    // not ready to bread..
    if (this.reproductionTimeCounter < this.settings.reproductionTimeCycle) return;
    if (otherBug.reproductionTimeCounter < otherBug.settings.reproductionTimeCycle) return;

    // if not old enough..
    if (this.age < this.settings.firstReproductionTime) return;
    if (otherBug.age < otherBug.settings.firstReproductionTime) return;

    // if not the same type..
    if (this.type !== otherBug.getType()) return;

    if (this.sex === otherBug.getSex()) return;
    if (this.sex !== BugSexOptions.female) return;

    this.reproductionTimeCounter = 0;

    for (let c = 0; c < this.settings.childsPerBear/20; c++) {
      const body = this.body * this.settings.startBody/100;
      
      const newSettings: BugSettings = this.getInheritedSettings(this, otherBug);
      const newBug = new Bug(this.type, this.pos.clone(), newSettings, body, this.arena);
      
      if (this.arena.addBug(newBug)) {
        // console.log("adding newborn bug:", newBug);
        this.body -= body * 0.1; // mother loses weight
      }
      
    }
  }

  getInheritedSettings(bug1: Bug, bug2: Bug): BugSettings {
    const s1 = bug1.settings;
    const s2 = bug2.settings;
    const newSettings = new BugSettings();
    newSettings.intelligence = (s1.intelligence + s2.intelligence) / 2;
    newSettings.turnSpeed = (s1.turnSpeed + s2.turnSpeed) / 2;
    newSettings.speed = (s1.speed + s2.speed) / 2;
    newSettings.agressiveness = (s1.agressiveness + s2.agressiveness) / 2;
    newSettings.firstReproductionTime = (s1.firstReproductionTime + s2.firstReproductionTime) / 2;
    newSettings.reproductionTimeCycle = (s1.reproductionTimeCycle + s2.reproductionTimeCycle) / 2;
    newSettings.viewRadius = (s1.viewRadius + s2.viewRadius) / 2;
    newSettings.startBody = (s1.startBody + s2.startBody) / 2;
    newSettings.childsPerBear = (s1.childsPerBear + s2.childsPerBear) / 2;

    return newSettings;
  }

  getType() {
    return this.type;
  }

  tryToKill(otherBug: Bug) {}

  die() {
    this.alive = false;
  }
  isAlive(): boolean {
    return this.alive;
  }

  /**
   * getter for pos 
   * @returns 
   */
  getPos(): Pos {
    return this.pos;
  }

  /**
   * 
   * @returns 
   */
  getEffectiveSpeed(): number {
    return this.settings.speed * 0.03 * this.iWantToWalk;
  }

  /**
   * Handle a meeting with an other bug.  attack/breed
   * @param otherBug 
   * @returns 
   */
  meet(otherBug: Bug) {
    var thisRace = this.type;
    var otherRace = otherBug.getType();

    if (!otherBug.isAlive()) return;

    if (!this.isAlive()) return;

    var agressiveness = (this.settings.agressiveness / 100) * Math.random();
    // aggressiveness *= Math.sqrt( body / otherBug.getBody() );
    if (this.type === otherBug.getType()) {
      if (this.sex !== otherBug.getSex() && agressiveness < 0.95) {
        // very aggressive bugs rather kill, then make love.. hm..
        if (this.sex === BugSexOptions.female && this.reproductionTimeCounter > this.settings.reproductionTimeCycle) {
          this.makeChildren(otherBug);
        }
      } else if (agressiveness > 0.8) {
        // if it is aggressive, maybe he is attacking the bug of same race.
        this.tryToKill(otherBug);
      }
    } else {
      // not the same race..   bug will try to fight
      if (agressiveness > 0.5) {
        this.tryToKill(otherBug);
      }
    }
  }

  /**
   * getter for settings
   * @returns
   */
  getSettings(): BugSettings {
    return this.settings;
  }

  /**
   * Consume a foodpile, grow body
   * @param food 
   */
  eat(food: Food) {
    const foodToBeEaten = food.eatFrom(Math.sqrt(this.body + 20) / 100);
    this.body += foodToBeEaten;
  }

  /**
   * turn in direction of target pos
   * @param targetPos
   */
  turnOn(targetPos: Pos, attackOrEscape: number = 1) {
    let newDirection;
    if (targetPos === this.pos) {
      // if no target, turn randomly..
      newDirection = this.direction + (this.settings.turnSpeed * 2 * Math.random() - this.settings.turnSpeed) / 10;
      
    } else {
      // if target is set, turn on it or try to escape
      const dirmod = this.pos.turnInPosition(targetPos, this.direction) * attackOrEscape;
      newDirection = this.direction + (this.settings.turnSpeed / 10) * dirmod;
      
    }
    this.setDirection(newDirection);    
  }

  
}
