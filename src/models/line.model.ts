import { Point } from "./point.model";

export class Line {
  start: Point;
  end: Point;
  constructor (startX: number, startY: number, endX: number, endY: number) {
    this.start = new Point(startX, startY);
    this.end = new Point(endX, endY);
  }
}