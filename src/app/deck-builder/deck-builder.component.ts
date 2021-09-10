import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Deck, Card, CardService } from '../services/card.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { ViewCardModalComponent } from '../modals/view-card-modal/view-card-modal.component';

@Component({
  selector: 'app-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss']
})
export class DeckBuilderComponent implements OnInit {

  currentDeck: Deck;
  filteredCollection: Card[];
  collection: Card[];
  countMap: Map<number, number>;
  filterText: string;
  inspectMode = false;

  mainDeckCount = 0;

  monsterCount = 0;
  spellCount = 0;
  trapCount = 0;
  extraCount = 0;

  showMonster: boolean;
  showSpell: boolean;
  showTrap: boolean;
  showExtra: boolean;

  private extraDeckCardTypes = ['Fusion Monster', 'Link Monster', 'Synchro Monster', 'Pendulum Monster'];

  constructor(private router: Router, private modalService: ModalService, private cardService: CardService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('deckId')) {
      this.cardService.getDeckById(this.route.snapshot.paramMap.get('deckId')).subscribe(response => {
        if (response) {
          this.currentDeck = response;
          this.currentDeck.cards.forEach(element => {
            this.checkCardType(element);
          });
        }
      });
    } else {
      this.currentDeck = new Deck();
      this.currentDeck.name = "New Deck";
      this.currentDeck.cards = [];
      this.currentDeck.cardCount = new Map<number, number>();
    }
    

    this.cardService.getCollection().subscribe(response =>{
      if (response) {
        this.collection = response.cards;
        this.filteredCollection = response.cards;
        this.countMap = response.cardCount;
      }
    });
  }

  onDone() {
    this.cardService.saveDeck(this.currentDeck).subscribe(response => {
      if (response)
        this.router.navigateByUrl('/decks');
    });
  }

  tryAddCard(card: Card) {
    if (this.inspectMode) {
      this.modalService.init(ViewCardModalComponent, { card: card }, {});
      return;
    }

    var max = this.countMap[card.id];

    if (this.currentDeck.cardCount[card.id] && this.currentDeck.cardCount[card.id] >= max) {
      return;
    }

    if (this.currentDeck.cardCount[card.id] && this.currentDeck.cardCount[card.id] < max) {
      this.currentDeck.cardCount[card.id]++;
    } else {
      this.currentDeck.cardCount[card.id] = 1;
    }

    this.checkCardType(card);

    if (this.currentDeck.cards.findIndex(x => x.id === card.id) === -1) {
      const index = this.currentDeck.cards.findIndex(x => x.name > card.name)
      if (index !== -1) {
        this.currentDeck.cards.splice(index, 0, card);
      } else {
        this.currentDeck.cards.push(card);
      }
    }
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

  private checkCardType(card: Card) {
    if (this.extraDeckCardTypes.indexOf(card.type) === -1) {
      this.mainDeckCount++;

      switch (card.type)
      {
        case 'Spell Card': this.spellCount++; break;
        case 'Trap Card': this.trapCount++; break;
        default: this.monsterCount++;
      }
    } else {
      this.extraCount++;
    }
  }

  clearFilterText() {
    this.filterText = '';
    this.onFilterChange();
  }

  getKeys(map) {
    return Object.keys(map);
  }

  removeCardFromDeck(key: number) {
    if (this.currentDeck.cards.findIndex(x => x.id == key) === -1) {
      return;
    }

    var count = this.currentDeck.cardCount[key];
    var card = this.currentDeck.cards.find(x => x.id == key);
    if (count == 1) {
      this.currentDeck.cardCount[key] = undefined;
      var index = this.currentDeck.cards.findIndex(x => x.id == key);
      this.currentDeck.cards.splice(index, 1);
    } else if (count > 1) {
      this.currentDeck.cardCount[key]--;
    }

    if (this.extraDeckCardTypes.indexOf(card.type) === -1) {
      this.mainDeckCount--;

      switch (card.type)
      {
        case 'Spell Card': this.spellCount--; break;
        case 'Trap Card': this.trapCount--; break;
        default: this.monsterCount--;
      }
    } else {
      this.extraCount--;
    }
  }

  getMainDeckCards(currentDeck : Deck) {
    for(let i of Object.keys(currentDeck.cards)) {
      var cardList = currentDeck.cards[i];
      if (this.extraDeckCardTypes.indexOf(cardList[0].type) === -1) {
        this.mainDeckCount += cardList.length;
      }
    }
  }

  cancel() {
    this.router.navigateByUrl('/decks');
  }

}
