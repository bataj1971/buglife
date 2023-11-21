export class Pos {

  public x: number;
  public y: number;

  /**
   * creating new position 
   * @param x 
   * @param y 
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Calculating distance between two positions
   * @param {*} pos
   * @returns
   */
  distance(pos: Pos) {
    const distance = Math.sqrt(Math.pow(pos.x - this.x, 2) + Math.pow(pos.y - this.y, 2));
    return distance;
  }

  /**
   * returning a +1/-1 direction to modify direction to get in the target direction
   * @param targetPos 
   * @param currentDirection 
   * @returns 
   */
  turnInPosition(targetPos: Pos, currentDirection: number) {

    let targetDirection = (Math.atan2(targetPos.x - this.x, - targetPos.y + this.y) * 180) / Math.PI;

     const diff = ((targetDirection - currentDirection + 540) % 360) - 180;
     const directionModify = Math.sign(diff) * 1;

    return directionModify;
  }

  clone():Pos { 
    return new Pos(this.x,this.y);
  }
}
