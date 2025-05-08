import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessagePosition, MessageType } from '../../enums';

@Component({
  selector: 'app-message',
  imports: [NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @Input() message: string = '';
  @Input() position: MessagePosition = MessagePosition.TOP_RIGHT;
  @Input() duration: number = 3000; // Default duration is 3 seconds
  @Input() isVisible: boolean = false; // Control visibility from parent component
  @Input() type: MessageType = MessageType.INFO; // Default message type is INFO
  protected MessagePosition = MessagePosition;
}
