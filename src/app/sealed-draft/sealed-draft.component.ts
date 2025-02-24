import { Component, OnInit } from '@angular/core';
import { CardService, CardSet, Card } from '../services/card.service';
import { CookieService } from '../services/cookie.service';
import { images_url } from 'src/environments/environment';

@Component({
    selector: 'app-sealed-draft',
    templateUrl: './sealed-draft.component.html',
    styleUrls: ['./sealed-draft.component.scss'],
    standalone: false
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
      next: result => {
        this.draftKey = result;
        this.cookieService.setCookie('draftKey', this.draftKey);
      },
      error: err => console.log(err),
      complete: () => this.drafting = true
    });
  }

  completeDraft(draftedCards: Card[]) {
    this.draftedCards = draftedCards;
  }

  discardDraft() {
    this.quitDrafting();
  }

  saveDraft() {
    this.cardService.addToCollection(this.draftedCards).subscribe(response => {
      if (response) {
        this.quitDrafting();
      }
    });
  }

  getCardSets() {
    this.cardService.getCardSets(`${this.maxYear}`).subscribe(response => {
      this.cardSets = response.map(x => new CardSet(x.set_name, x.set_code, x.num_of_cards, x.tcg_date));
      this.filterSets();
      this.emptyCardSet = false;
      this.checkExistingDraft();
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

  checkExistingDraft() {
    let cookie = this.cookieService.getCookie('draftKey');
    if (!cookie) return;

    this.cardService.getDraftState(cookie).subscribe({
      next: result => {
        this.selectedSet = this.cardSets.find(x => x.set_name == result.set_name);
        this.draftKey = cookie;
        this.drafting = true;
        sessionStorage.setItem('draftState', JSON.stringify(result));
        if (result.current_pack == result.num_packs) {
          this.draftedCards = result.cards;
        }
      },
      error: err => {
        this.cookieService.deleteCookie('draftKey');
        sessionStorage.removeItem('draftState');
      }
    });
  }

  quitDrafting() {
    this.cookieService.deleteCookie('draftKey');
    sessionStorage.removeItem('draftState');
    this.drafting = false;
    this.draftedCards = undefined;
  }
}
