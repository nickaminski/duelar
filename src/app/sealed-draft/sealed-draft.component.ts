import { Component, OnInit } from '@angular/core';
import { CardService, CardSet, Card } from '../services/card.service';
import { CookieService } from '../services/cookie.service';
import { images_url } from 'src/environments/environment';

@Component({
  selector: 'app-sealed-draft',
  templateUrl: './sealed-draft.component.html',
  styleUrls: ['./sealed-draft.component.scss']
})
export class SealedDraftComponent implements OnInit {

  images_url: string;
  maxYear: number;
  years: number[] = [];
  cardSets: CardSet[];
  filteredSets: CardSet[];
  selectedSet: CardSet;
  drafting: boolean;
  cards: Card[];
  emptyCardSet: boolean;
  draftKey: string;
  draftedCards: Card[];

  constructor(
    private cardService: CardService, 
    private cookieService: CookieService) { 
      this.images_url = images_url;
      for(var x = 2002; x <= new Date().getFullYear(); x++) {
        this.years.push(x);
      }
      this.maxYear = 2004;
  }

  ngOnInit(): void {
    this.getCardSets();
  }

  startDraft() {
    if (this.drafting)
      return;

    this.cardService.startDraft(this.selectedSet.set_name, 24).subscribe({
      next: result => this.draftKey = result,
      error: err => console.log(err),
      complete: () => this.drafting = true
    });
  }

  completeDraft(draftedCards: Card[]) {
    this.draftedCards = draftedCards;
  }

  discardDraft() {
    this.cookieService.deleteCookie('current_draft_collection');
    this.drafting = false;
    this.draftedCards = undefined;
  }

  saveDraft() {
    this.cardService.addToCollection(this.draftedCards).subscribe(response => {
      if (response) {
        this.drafting = false;
        this.draftedCards = undefined;
      }
    });
  }

  getCardSets() {
    this.cardService.getCardSets(`${this.maxYear}`).subscribe(response => {
      this.cardSets = response.map(x => new CardSet(x.set_name, x.set_code, x.num_of_cards, x.tcg_date));
      this.filterSets();
      this.emptyCardSet = false;
    });
  }

  filterSets() {
    this.filteredSets = [];
    this.cardSets.forEach(x => {
      if (x.setFilter(this.maxYear))
        this.filteredSets.push(x);
    });
    if (this.filteredSets && this.filteredSets.length > 0)
      this.selectedSet = this.filteredSets[0];
    else
      this.selectedSet = undefined;
  }

  onSetChange() {
    this.emptyCardSet = false;
  }
}
