import { Component, OnInit, Input } from '@angular/core';
import { CardSet } from '../services/card.service';
import { Router } from '@angular/router';
import { CookieService } from '../services/cookie.service';
import { images_url } from 'src/environments/environment';

@Component({
    selector: 'app-card-set-tile',
    templateUrl: './card-set-tile.component.html',
    styleUrls: ['./card-set-tile.component.scss'],
    standalone: false
})
export class CardSetTileComponent implements OnInit {

  @Input() cardSet: CardSet;

  images_url: string;

  constructor(private router: Router, private cookieService: CookieService) {
    this.images_url = images_url;
  }

  ngOnInit(): void {
  }

  navigate() {
    this.cookieService.setCookie('current_set', JSON.stringify(this.cardSet));
    this.router.navigate([`/view-set/${encodeURIComponent(this.cardSet.set_name)}`]);
  }

}
