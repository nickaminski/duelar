import { Component, OnInit, Input } from '@angular/core';
import { Card, CardService } from '../services/card.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { images_url } from 'src/environments/environment';

@Component({
    selector: 'app-view-card',
    templateUrl: './view-card.component.html',
    styleUrls: ['./view-card.component.scss'],
    standalone: false
})
export class ViewCardComponent implements OnInit {

  @Input() cardName: string;
  @Input() card: Card;

  _card: Card;

  images_url: string;
  attributePath: string;
  racePath: string;
  typePath: string;
  currentImage: number;

  constructor(private route: ActivatedRoute, private cardService: CardService, private modalService: ModalService) {
    this.images_url = images_url;
    this.currentImage = 0;
   }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('cardName')) {
      this.cardName = this.route.snapshot.paramMap.get('cardName');
    }

    if (this.cardName && !this.card) {
      this.cardService.getCardByName(this.cardName).subscribe(response => {
        this._card = response;
        this.assignImagePaths();
      });
    } 
    else if (!this.cardName && this.card) {
      this._card = this.card;
      this.assignImagePaths();
    }

    let uniqueImages = {};
    this._card.card_images.forEach(image => {
      uniqueImages[image.id] = image;
    });
    this._card.card_images = Object.values(uniqueImages);
  }

  closeModal() {
    this.modalService.destroy();
  }
  nextImage() {
    this.currentImage = (this.currentImage + 1) % this._card.card_images.length;
  }

  private assignImagePaths() {
    if (this._card.attribute)
      this.attributePath = `assets/images/${this._card.attribute}.jpg`;
    if (this._card.race)
      this.racePath = `assets/images/${this._card.race.replaceAll(' ', '')}.png`;
    if (this._card.type)
      this.typePath = `assets/images/${this._card.type.replaceAll(' ', '')}.jpg`;
  }

}
