import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { CardService, CardSet } from '../services/card.service';

@Component({
    selector: 'app-set-dashboard',
    templateUrl: './set-dashboard.component.html',
    styleUrls: ['./set-dashboard.component.scss'],
    standalone: false
})
export class SetDashboardComponent implements OnInit {

  cardSets: CardSet[];
  
  maxYear: number;
  years: number[] = [];

  constructor(public logger : LoggerService, public cardService: CardService) { 
    for(var x = 2002; x <= new Date().getFullYear(); x++) {
      this.years.push(x);
    }
    this.maxYear = 2004;
  }

  ngOnInit(): void {
    this.getCardSets();
  }

  getCardSets() {
    this.cardService.getCardSets(`${this.maxYear}`).subscribe(response => {
      this.cardSets = response.map(x => new CardSet(x.set_name, x.set_code, x.num_of_cards, x.tcg_date));
    });
  }
}
