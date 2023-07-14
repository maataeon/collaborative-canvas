import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Subscription } from 'rxjs';
import { Point } from 'src/models/point.model';
import { Line } from 'src/models/line.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D | null;
  isDrawing = false;
  lastX = 0;
  lastY = 0;
  private messagesSubscription: Subscription;

  constructor(private chatService: ChatService) {
    this.messagesSubscription = this.chatService.getMessages().subscribe((data) => {
      console.log({ data })
      this.drawLine(data);
    });
  }

  ngOnInit() {
    this.context = this.canvasRef.nativeElement.getContext('2d');
  }

  ngAfterViewInit() {
    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = window.innerHeight;
    this.setUpDrawEvents();
  }

  drawLine(point: Line) {
    this.context?.beginPath();
    this.context?.moveTo(point.start.x, point.start.y);
    this.context?.lineTo(point.end.x, point.end.y);
    this.context?.stroke();
  }

  updateMousePosition(e: MouseEvent) {
    this.isDrawing = true;
    [this.lastX, this.lastY] = [e.clientX, e.clientY];
  }

  drawLastMove(e: MouseEvent) {
    if (!this.isDrawing) return;

    const line = new Line(this.lastX, this.lastY, e.clientX, e.clientY);
    this.drawLine(line);

    this.chatService.sendMessage(line);

    [this.lastX, this.lastY] = [e.clientX, e.clientY];
  }

  startDrawing() {
    this.isDrawing = true;
  }
  stopDrawing() {
    this.isDrawing = false;
  }

  setUpDrawEvents() {
    this.canvasRef.nativeElement.addEventListener('mousedown', this.updateMousePosition);
    this.canvasRef.nativeElement.addEventListener('mousemove', this.drawLastMove);
    this.canvasRef.nativeElement.addEventListener('mouseup', this.stopDrawing);
    this.canvasRef.nativeElement.addEventListener('mouseout', this.stopDrawing);
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
  }
}
