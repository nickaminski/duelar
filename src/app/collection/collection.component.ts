import { Component, OnInit } from '@angular/core';
import { CardService, Card, CardSet } from '../services/card.service';
import { ViewCardModalComponent } from '../modals/view-card-modal/view-card-modal.component';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  collection: Card[];
  filteredCollection: Card[];
  countMap: Map<number, number>;
  filterText: string;

  selectedSet: CardSet;
  filteredSets: CardSet[];
  cardSets: CardSet[];

  showMonster: boolean;
  showSpell: boolean;
  showTrap: boolean;
  showExtra: boolean;

  private extraDeckCardTypes = ['Fusion Monster', 'Link Monster', 'Synchro Monster', 'Pendulum Monster'];

  constructor(private cardService: CardService, private modalService: ModalService) { 
    this.cardSets = [];
  }

  ngOnInit(): void {
    this.cardService.getCollection().subscribe(response =>{
      if (response) {
        this.collection = response.cards;
        this.filteredCollection = response.cards;
        this.countMap = response.cardCount;
      }
    });
  }

  onFilterChange() {
    this.filteredCollection = [];
    if (!this.filterText) {
      this.filterText = '';
    }

    if (this.showMonster || this.showSpell || this.showTrap || this.showExtra) {
      this.collection.forEach(x => {
        if (this.showMonster && x.type.indexOf('Monster') !== -1) {
          this.filteredCollection.push(x);
        } else if (this.showSpell && x.type.indexOf('Spell') !== -1) {
          this.filteredCollection.push(x);
        } else  if (this.showTrap && x.type.indexOf('Trap') !== -1) {
          this.filteredCollection.push(x);
        } else if (this.showExtra && this.extraDeckCardTypes.indexOf(x.type) !== -1) {
          this.filteredCollection.push(x);
        }
      });
      this.filteredCollection = this.filteredCollection.filter(x => x.name.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1);
    } else {
      this.filteredCollection = this.collection.filter(x => x.name.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1);
    }
  }

  clearFilterText() {
    this.filterText = '';
    this.onFilterChange();
  }

  onClickCard(id: number) {
    if (id !== -1)
    this.modalService.init(ViewCardModalComponent, { cardId: id }, {});
  }

  nukeCollection() {
    this.cardService.deleteCollection().subscribe(response => {
      if (response) {
        this.collection = [];
        this.filteredCollection = [];
      }
    });
  }

}
