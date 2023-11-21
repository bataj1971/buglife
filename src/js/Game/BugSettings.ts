export class BugSettings {
  public static readonly propertyNames = ["intelligence", "turnSpeed", "speed", "agressiveness", "firstReproductionTime", "reproductionTimeCycle", "viewRadius", "startBody", "childsPerBear"];
  private properties: Map<string, number>;

  
  constructor(initialSettings?: Map<string, number>) {
    this.properties = new Map();

    if (initialSettings) {
      initialSettings.forEach((value: number, key: string) => {
        this.setProperty(key, value);
      });
    }
  }

  setProperty(propertyName: string, value: number) {
    if (BugSettings.propertyNames.includes(propertyName)) {
      this.properties.set(propertyName, value);
    } else {
      throw Error("BugSettings - not valid propertyname:" + propertyName);
    }
  }
  getValue(propertyName: string): number {
    const value = this.properties.get(propertyName) ?? null;
    return value === null ? 0 : value;
  }

  get intelligence(): number {
    return this.properties.get("intelligence") ?? 0;
  }
  get turnSpeed(): number {
    return this.properties.get("turnSpeed") ?? 0;
  }
  get speed(): number {
    return this.properties.get("speed") ?? 0;
  }
  get agressiveness(): number {
    return this.properties.get("agressiveness") ?? 0;
  }
  get firstReproductionTime(): number {
    return this.properties.get("firstReproductionTime") ?? 0;
  }
  get reproductionTimeCycle(): number {
    return this.properties.get("reproductionTimeCycle") ?? 0;
  }
  get viewRadius(): number {
    return this.properties.get("viewRadius") ?? 0;
  }
  get startBody(): number {
    return this.properties.get("startBody") ?? 0;
  }
  get childsPerBear(): number {
    return this.properties.get("childsPerBear") ?? 0;
  }
  // setters :
  set intelligence(value: number) {
    this.properties.set("intelligence", value);
  }
  set turnSpeed(value: number) {
    this.properties.set("turnSpeed", value);
  }
  set speed(value: number) {
    this.properties.set("speed", value);
  }
  set agressiveness(value: number) {
    this.properties.set("agressiveness", value);
  }
  set firstReproductionTime(value: number) {
    this.properties.set("firstReproductionTime", value);
  }
  set reproductionTimeCycle(value: number) {
    this.properties.set("reproductionTimeCycle", value);
  }
  set viewRadius(value: number) {
    this.properties.set("viewRadius", value);
  }
  set startBody(value: number) {
    this.properties.set("startBody", value);
  }
  set childsPerBear(value: number) {
    this.properties.set("childsPerBear", value);
  }
}
