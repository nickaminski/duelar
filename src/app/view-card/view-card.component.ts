import { Component, OnInit, Input } from '@angular/core';
import { Card, CardService } from '../services/card.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.scss']
})
export class ViewCardComponent implements OnInit {

  @Input() cardId: number;
  @Input() card: Card;

  _card: Card;

  attributePath: string;
  racePath: string;
  typePath: string;

  constructor(private route: ActivatedRoute, private cardService: CardService, private modalService: ModalService) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('cardId')) {
      this.cardId = +this.route.snapshot.paramMap.get('cardId');
    }

    if (this.cardId && !this.card) {
      this.cardService.getCardById(this.cardId).subscribe(response => {
        this._card = response;
        this.assignImagePaths();
      });
    } 
    else if (!this.cardId && this.card) {
      this._card = this.card;
      this.assignImagePaths();
    }
  }

  closeModal() {
    this.modalService.destroy();
  }

  private assignImagePaths() {
    if (this._card.attribute)
      this.attributePath = `assets/images/${this._card.attribute}.jpg`;
    if (this._card.race)
      this.racePath = `assets/images/${this._card.race}.png`;
    if (this._card.type)
      this.typePath = `assets/images/${this._card.type}.jpg`;
  }

}
