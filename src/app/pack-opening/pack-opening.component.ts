import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card, CardSet, CardService } from '../services/card.service';
import { ModalService } from '../services/modal.service';
import { ViewCardModalComponent } from '../modals/view-card-modal/view-card-modal.component';

@Component({
  selector: 'app-pack-opening',
  templateUrl: './pack-opening.component.html',
  styleUrls: ['./pack-opening.component.scss']
})
export class PackOpeningComponent implements OnInit {

  @Input() set: CardSet;
  @Input() possibleCards: Card[];
  @Output() onDraftCompleted = new EventEmitter<Card[]>();

  maxPacks = 24;
  currentPack = 0;
  flipped = false;
  completed = false;

  flipCards: Card[];

  draftedCards: Card[];

  rarityMap = new Map<number, Card[]>();

  constructor(private cardService: CardService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.draftedCards = [];

    this.rarityMap[0] = [];
    this.rarityMap[1] = [];
    this.rarityMap[2] = [];
    this.rarityMap[3] = [];
    this.rarityMap[4] = [];

    this.possibleCards.forEach(a => this.rarityMap[a.getRarityValue(this.set.set_code)].push(a));

    this.resetCards();
  }

  doFlip() {
    this.flipped = true;

    const secretRatio = 1/31;
    const ultraRatio = 1/12;
    const superRatio = 1/5;

    // fill random commons
    for(var r = 0; r < 4; r++) {

      if (this.rarityMap[r].length == 0) continue;

      for(var x = 0; x < 7; x++) {
        var roll = Math.floor(Math.random() * this.rarityMap[r].length);
        this.flipCards[x] = this.rarityMap[r][roll];
      }

      if (this.flipCards[0].id !== -1) break;
    }

    // roll for rares
    var roll = Math.random();
    if (roll <= secretRatio && this.rarityMap[4].length > 0) {
      var roll2 = Math.floor(Math.random() * this.rarityMap[4].length);
      this.flipCards[8] = this.rarityMap[4][roll2];

    } else if (roll <= ultraRatio && this.rarityMap[3].length > 0) {
      var roll2 = Math.floor(Math.random() * this.rarityMap[3].length);
      this.flipCards[8] = this.rarityMap[3][roll2];

    } else if (roll <= superRatio && this.rarityMap[2].length > 0) {
      var roll2 = Math.floor(Math.random() * this.rarityMap[2].length);
      this.flipCards[8] = this.rarityMap[2][roll2];

    } else {
      for(var r = 0; r < 4; r++) {
        if (this.rarityMap[r].length == 0) continue;

        var roll2 = Math.floor(Math.random() * this.rarityMap[r].length);
        this.flipCards[8] = this.rarityMap[r][roll2];

        if (this.flipCards[8].id !== -1) break;
      }
    }
    
    if (this.rarityMap[1].length > 0) {
      var roll3 = Math.floor(Math.random() * this.rarityMap[1].length);
      this.flipCards[7] = this.rarityMap[1][roll3];
    } else if (this.rarityMap[2].length > 0) {
      var roll3 = Math.floor(Math.random() * this.rarityMap[2].length);
      this.flipCards[7] = this.rarityMap[2][roll3];
    }  else if (this.rarityMap[3].length > 0) {
      var roll3 = Math.floor(Math.random() * this.rarityMap[3].length);
      this.flipCards[7] = this.rarityMap[3][roll3];
    } else if (this.rarityMap[4].length > 0) {
      var roll3 = Math.floor(Math.random() * this.rarityMap[4].length);
      this.flipCards[7] = this.rarityMap[4][roll3];
    } else if (this.rarityMap[0].length > 0) {
      var roll3 = Math.floor(Math.random() * this.rarityMap[0].length);
      this.flipCards[7] = this.rarityMap[0][roll3];
    }

    this.flipCards.forEach(x => this.draftedCards.push(x));

    if (this.completed) {
      this.onDraftCompleted.emit(this.draftedCards);
    }
  }

  resetCards() {
    this.currentPack++;

    if (this.currentPack == this.maxPacks){
      this.completed = true;
    }

    this.flipped = false;
    this.flipCards = [
      this.cardService.getBackCard(),
      this.cardService.getBackCard(),
      this.cardService.getBackCard(),
      this.cardService.getBackCard(),
      this.cardService.getBackCard(),
      this.cardService.getBackCard(),
      this.cardService.getBackCard(),
      this.cardService.getBackCard(),
      this.cardService.getBackCard()
    ];
  }

  onClickCard(id: number) {
    if (id !== -1)
    this.modalService.init(ViewCardModalComponent, { cardId: id }, {});
  }

}
