import { Component, OnInit } from '@angular/core';
import { CardService, Deck } from '../services/card.service';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss']
})
export class DecksComponent implements OnInit {

  decks: Deck[];

  selectedDeck: Deck;

  constructor(private cardService: CardService) {
    this.decks = [];
    this.selectedDeck = new Deck();
  }

  ngOnInit(): void {
    this.cardService.getDecks().subscribe(response => {
      if (response) {
        this.decks = response;
      }
    });
  }

  deleteDeck(deckId: string) {
    if (!deckId) return;

    this.cardService.deleteDeck(deckId).subscribe(response => {
      if (response) {
        const index = this.decks.findIndex(x => x.deck_id === deckId);
        if (index !== -1) {
          this.decks.splice(index, 1);
          this.selectedDeck = new Deck();
        }
      }
    });
  }

}
