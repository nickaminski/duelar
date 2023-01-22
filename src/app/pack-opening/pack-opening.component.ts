import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card, CardSet, CardService } from '../services/card.service';
import { ModalService } from '../services/modal.service';
import { ViewCardModalComponent } from '../modals/view-card-modal/view-card-modal.component';
import { images_url } from 'src/environments/environment';

@Component({
  selector: 'app-pack-opening',
  templateUrl: './pack-opening.component.html',
  styleUrls: ['./pack-opening.component.scss']
})
export class PackOpeningComponent implements OnInit {

  @Input() set: CardSet;
  @Input() draftKey: string;
  @Output() onDraftCompleted = new EventEmitter<Card[]>();

  images_url: string;
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
    this.images_url = images_url;
    this.resetCards();
  }

  doFlip() {
    this.flipped = true;

    this.cardService.rollDaftPack(this.draftKey).subscribe(response => {
      this.flipCards = [];
      response.forEach(x => this.flipCards.push(new Card(x.id, x.name, x.type, x.desc, x.atk, x.def, x.level, x.race, x.attribute, x.archetype, x.card_sets, x.card_images, x.card_prices)));
      this.flipCards.forEach(x => this.draftedCards.push(x));
      if (this.completed) {
        this.onDraftCompleted.emit(this.draftedCards);
      }
    });
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

  onClickCard(card) {
    if (card.id !== -1)
      this.modalService.init(ViewCardModalComponent, { card: card }, {});
  }

}
