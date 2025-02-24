import { Component } from '@angular/core';
import { LoggerService } from './services/logger.service';
import { CardService } from './services/card.service';
import { ModalService } from './services/modal.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'duelar';
  guid: string;

  constructor(public logger : LoggerService, public cardService: CardService, private modalService: ModalService) {
  }

  removeModal() {
    this.modalService.destroy();
  }

}
