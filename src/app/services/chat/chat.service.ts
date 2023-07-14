import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Line } from 'src/models/line.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private messageSubject: Subject<Line> = new Subject<Line>();
  private history: Subject<Line[]> = new Subject<Line[]>();

  constructor() {
    this.socket = io('http://10.0.99.2:3000');

    this.socket.on('coordinateUpdate', (data) => {
      this.messageSubject.next(data);
    });
    
    this.socket.on('logs', (data) => {
      this.history.next(data);
    });
  }

  sendMessage(message: Line): void {
    this.socket.emit('coordinateUpdate', message);
  }

  getMessages(): Observable<Line> {
    return this.messageSubject.asObservable();
  }

  getHistory(): Observable<Line[]> {
    return this.history.asObservable();
  }
}
