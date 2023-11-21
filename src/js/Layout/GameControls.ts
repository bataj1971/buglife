import { BugPropertySet } from "../Game/BugProperty";
import { GameMaster } from "../Game/GameMaster";
import { Pos } from "../Game/Pos";

export class GameControls {
  private gameMaster: GameMaster;
  // controlls:
  private gameSpeedElement: HTMLInputElement;
  private foodValueElement: HTMLInputElement;
  private bugNumberToAddElement: HTMLInputElement;
  private initialBodyValueElement: HTMLInputElement;
  private bugTypeElement: HTMLSelectElement;

  private startButtonElement: HTMLButtonElement;
  private stopButtonElement: HTMLButtonElement;
  private addFoodButtonElement: HTMLButtonElement;
  private addBugsButtonElement: HTMLButtonElement;

  // display elements
  private lifetimeElement: HTMLElement;
  private bugCountElement: HTMLElement;
  private messageElement: HTMLElement;
  private canvasElement: HTMLElement;
  private propertyInputElements: Map<string, HTMLInputElement>;

  //stat elements
  private bugInfoContentElement: HTMLElement;

  constructor(gameMaster: GameMaster) {
    this.gameMaster = gameMaster;

    this.propertyInputElements = new Map();

    // displayelements
    this.messageElement = document.querySelector("#message") as HTMLElement;

    this.lifetimeElement = document.querySelector("#lifetime") as HTMLElement;
    this.bugCountElement = document.querySelector("#bugcount") as HTMLElement;
    this.canvasElement = document.querySelector("canvas#arenaView") as HTMLElement;
    this.canvasElement.addEventListener("click", this.addFoodToLocation.bind(this));

    // main controlls:
    this.startButtonElement = document.querySelector("#startgame") as HTMLButtonElement;
    this.startButtonElement.addEventListener("click", this.gameMaster.start.bind(this.gameMaster));

    this.stopButtonElement = document.querySelector("#stopgame") as HTMLButtonElement;
    this.stopButtonElement.addEventListener("click", this.gameMaster.stop.bind(this.gameMaster));

    this.gameSpeedElement = document.querySelector("#gamespeed") as HTMLInputElement;
    this.gameSpeedElement.addEventListener("change", this.gameMaster.setSpeed.bind(this.gameMaster));
    // food control
    this.foodValueElement = document.querySelector("#foodvalaue") as HTMLInputElement;

    this.addFoodButtonElement = document.querySelector("#addfood") as HTMLButtonElement;
    this.addFoodButtonElement.addEventListener("click", this.gameMaster.addFoodToRandomLocation.bind(this.gameMaster));

    // add new bug controls
    this.addBugsButtonElement = document.querySelector("#addbug") as HTMLButtonElement;
    this.addBugsButtonElement.addEventListener("click", this.gameMaster.addBugsToArena.bind(this.gameMaster));

    this.bugTypeElement = document.querySelector("#bugtype") as HTMLSelectElement;
    this.bugTypeElement.addEventListener("change", this.gameMaster.loadBugTypeProperties.bind(this.gameMaster));

    this.bugNumberToAddElement = document.querySelector("#bugnumbertoadd") as HTMLInputElement;
    this.initialBodyValueElement = document.querySelector("#initialbodyvalue") as HTMLInputElement;
    this.createPropertyInputs();

    // stat elemets
    this.bugInfoContentElement = document.querySelector("#buginfocus-content") as HTMLElement;
  }

  getBugNumberToAdd(): number {
    return parseInt(this.bugNumberToAddElement.value);
  }

  getInitialBodyValue(): number {
    return parseInt(this.initialBodyValueElement.value);
  }

  getFoodValue(): number {
    return parseInt(this.foodValueElement.value);
  }

  getGameSpeed(): number {
    return parseInt(this.gameSpeedElement.value);
  }
  displayMessage(message: string) {
    this.messageElement.innerHTML = message;
  }

  displaytBugCount(value: number) {
    this.bugCountElement.innerHTML = value.toString();
  }

  displayLifeTime(value: number) {
    this.lifetimeElement.innerHTML = value.toString();
  }

  addFoodToLocation(e: MouseEvent) {
    const x = e.pageX - this.canvasElement.offsetLeft;
    const y = e.pageY - this.canvasElement.offsetTop;
    const pos = new Pos(x, y);
    this.gameMaster.addFood(pos);
  }

  getBugTypeValue() {
    return this.bugTypeElement.value;
  }

  createPropertyInputs() {
    const propertyInputElements = document.querySelector("#propertyinputs") as HTMLElement;
    const propertyList = this.gameMaster.getBugPropertyList();
    propertyList.forEach((property) => {
      const name = property.getName();
      console.log("cretePropertyInputs:", name);

      const inputLineElement = document.createElement("div") as HTMLElement;
      inputLineElement.classList.add("inputline");

      const labelElement = document.createElement("label") as HTMLLabelElement;
      labelElement.innerHTML = name + ":";

      const inputElement = document.createElement("input");
      inputElement.id = name;      
      inputElement.type = "range";
      inputElement.min = property.getMinValue().toString();
      inputElement.max = property.getMaxValue().toString();
      inputElement.step = "0.1";
      inputElement.addEventListener("input", this.evenProperties.bind(this));

      inputLineElement.append(labelElement);
      inputLineElement.append(inputElement);
      propertyInputElements.append(inputLineElement);

      this.propertyInputElements.set(name, inputElement);
    });
  }

  getInputPropertyValue(propertyName: string): number {
    let inputValue = "";

    if (this.propertyInputElements.has(propertyName)) {
      inputValue = (this.propertyInputElements.get(propertyName) as HTMLInputElement).value;
    } else {
      console.error("GameControls::getInputPropertyValue : propertyname not found among pripertyinput elements..", propertyName);
    }

    return parseInt(inputValue);
  }

  evenProperties() {
    const maxSum = 300;
    let currentSum = 0;
    this.propertyInputElements.forEach((ie: HTMLInputElement) => {
      currentSum += parseFloat(ie.value);
    });

    this.propertyInputElements.forEach((ie: HTMLInputElement) => {
      let value = parseFloat(ie.value);
      value = (value * maxSum) / currentSum;

      ie.value = value.toString();
    });
  }

  setBugInfoContentElement(content: string) { 
    this.bugInfoContentElement.innerHTML = content;
  }
}
