import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'src/app/services/card.service';

@Component({
    selector: 'app-view-card-modal',
    templateUrl: './view-card-modal.component.html',
    styleUrls: ['./view-card-modal.component.scss'],
    standalone: false
})
export class ViewCardModalComponent implements OnInit {

  @Input() cardName: string;
  @Input() card: Card;

  constructor() { 
    document.getElementById('body').className='blocked';
  }

  ngOnInit(): void {
  }

}
