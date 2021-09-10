import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService, Card, CardSet } from '../services/card.service';
import { CookieService } from '../services/cookie.service';
import { ModalService } from '../services/modal.service';
import { ViewCardModalComponent } from '../modals/view-card-modal/view-card-modal.component';

@Component({
  selector: 'app-view-set',
  templateUrl: './view-set.component.html',
  styleUrls: ['./view-set.component.scss']
})
export class ViewSetComponent implements OnInit {

  currentSet: CardSet;
  sort: string;
  cards: Card[];

  constructor(private route: ActivatedRoute, private cardService: CardService, private cookieService: CookieService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.currentSet = JSON.parse(this.cookieService.getCookie('current_set'));
    
    if (this.route.snapshot.paramMap.get('setName') && !this.currentSet) {
      this.useRoutedSet();
    } else if (this.currentSet.set_name) {
      this.useCookieSet();
    }

    this.sort = 'Alphabetical';
  }

  onSortChange(value) {
    switch(value){
      case 'Alphabetical': this.cards = this.cards.sort(this.alphabeticalSort.bind(this)); break;
      case 'Rarity': this.cards = this.cards.sort(this.raritySort.bind(this)); break;
    }
  }

  onClickCard(id: number) {
    this.modalService.init(ViewCardModalComponent, { cardId: id }, {});
  }

  alphabeticalSort(a: Card, b: Card): number {
    return a.name.localeCompare(b.name);
  }

  raritySort(a: Card, b: Card): number { 
    var difference = b.getRarityValue(this.currentSet.set_code) - a.getRarityValue(this.currentSet.set_code);
    if (difference != 0)
      return difference;
    return this.alphabeticalSort(a, b);
  }

  private useRoutedSet() {
    this.cardService.getAllCardsInSet(this.route.snapshot.paramMap.get('setName')).subscribe(response => {
      this.cards = response.map(x => new Card(x.id, x.name, x.type, x.desc, x.atk, x.def, x.level, x.race, x.attribute, x.archetype, x.card_sets, x.card_images, x.card_prices));
    });
  }

  private useCookieSet() {
    this.cardService.getAllCardsInSet(this.currentSet.set_name).subscribe(response => {
      this.cards = response.map(x => new Card(x.id, x.name, x.type, x.desc, x.atk, x.def, x.level, x.race, x.attribute, x.archetype, x.card_sets, x.card_images, x.card_prices));
    });
  }

}