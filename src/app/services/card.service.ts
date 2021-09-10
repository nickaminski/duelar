import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { api_url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http : HttpClient) { }

  getCardSets(maxYear: string): Observable<CardSet[]>{
    let params = new HttpParams();
    if (maxYear)
    {
      params = params.append('maxYear', maxYear);
    }
    return this.http.get<CardSet[]>(`${api_url}/Card/GetSets`, { params: params });
  }

  getAllCardsInSet(setName: string): Observable<Card[]> {
    console.log(`getting cards in set: ${setName}`);
    return this.http.get<Card[]>(`${api_url}/Card/GetAllCardsInSet?setName=${setName}`);
  }

  getCardById(id: number): Observable<Card> {
    return this.http.get<Card>(`${api_url}/Card/GetCardById?id=${id}`);
  }

  getBackCard(): Card {
    var images = [];
    images.push({ image_url_small: 'assets/images/back_high.jpg' });
    return new Card(-1, 'Back', '', '', '', '', '', '', '', '', [], images, []);
  }

  getDecks(): Observable<Deck[]> {
    return this.http.get<Deck[]>(`${api_url}/Card/GetDecks`);
  }

  getDeckById(guid: string): Observable<Deck> {
    return this.http.get<Deck>(`${api_url}/Card/GetDeckById?guid=${guid}`);
  }

  saveDeck(deck: Deck): Observable<Deck> {
    return this.http.post<Deck>(`${api_url}/Card/SaveDeck`, deck);
  }

  deleteDeck(deckId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${api_url}/Card/DeleteDeck?guid=${deckId}`);
  }

  getCollection(): Observable<any> {
    return this.http.get<Card[]>(`${api_url}/Card/GetCollection`);
  }

  deleteCollection(): Observable<boolean> {
    return this.http.delete<boolean>(`${api_url}/Card/DeleteCollection`);
  }

  addToCollection(newCards: Card[]): Observable<boolean> {
    return this.http.put<boolean>(`${api_url}/Card/AddToCollection`, newCards);
  }

}

export class CardSet {
  set_name: string;
  set_code: string;
  num_of_cards: string;
  tcg_date: string;

  constructor(setName, setCode, numCards, date){
    this.set_name = setName;
    this.set_code = setCode;
    this.num_of_cards = numCards;
    this.tcg_date = date;
  }

  setFilter(maxYear: number): boolean {
    return +this.num_of_cards > 20 && 
            !this.set_code.startsWith('TP') &&
            !this.set_code.startsWith('CP') &&
            !this.set_code.startsWith('DT') &&
            !this.set_code.startsWith('TU') &&
            this.set_name.indexOf('Starter Deck') === -1 &&
            this.set_name.indexOf('Structure Deck') === -1 &&
            this.set_name.indexOf('Spell Ruler') === -1 &&
            +this.tcg_date.split('-')[0] <= maxYear;
  }
}

export class Card {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk: string;
  def: string;
  level: string;
  race: string;
  attribute: string;
  archetype: string;
  card_sets: any[];
  card_images: any[];
  card_prices: any[];

  constructor(id, name, type, desc, atk, def, level, race, attribute, archetype, card_sets, card_images, card_prices){
    this.id = id;
    this.name = name;
    this.type = type;
    this.desc = desc;
    this.atk = atk;
    this.def = def;
    this.level = level;
    this.race = race;
    this.attribute = attribute;
    this.archetype = archetype;
    this.card_sets = card_sets;
    this.card_images = card_images;
    this.card_prices = card_prices;
  }

  public getRarityString(setCode: string) : string {
    var cardSet = this.card_sets.find(x => x.set_code.split('-')[0] === setCode);
    if (cardSet) 
      return cardSet.set_rarity;

    return ' ';
  }

  public getRarityValue(setCode: string) : number {
    var cardSet = this.card_sets.find(x => x.set_code.split('-')[0] === setCode && this.matchLowestRarity(x));

    if (cardSet) {
      switch(cardSet.set_rarity)
      {
        case 'Common' : return 0;
        case 'Rare' : return 1;
        case 'Super Rare' : return 2;
        case 'Ultra Rare' : return 3;
        case 'Secret Rare' : return 4;
        default: return 0;
      }
    }
    return 0;
  }

  matchLowestRarity(x : any): boolean {
    return x.set_rarity === 'Common' ||
           x.set_rarity === 'Rare' ||
           x.set_rarity === 'Super Rare' ||
           x.set_rarity === 'Ultra Rare' ||
           x.set_rarity === 'Secret Rare';
  }

}

export class Deck {
  deck_id: string;
  name: string;
  cards: Card[];
  cardCount: Map<number, number>;
}