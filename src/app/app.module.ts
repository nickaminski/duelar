import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CardSetTileComponent } from './card-set-tile/card-set-tile.component';
import { ViewSetComponent } from './view-set/view-set.component';
import { SetDashboardComponent } from './set-dashboard/set-dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PackOpeningComponent } from './pack-opening/pack-opening.component';
import { SealedDraftComponent } from './sealed-draft/sealed-draft.component';
import { ViewCardComponent } from './view-card/view-card.component';
import { ViewCardModalComponent } from './modals/view-card-modal/view-card-modal.component';
import { DeckBuilderComponent } from './deck-builder/deck-builder.component';
import { DecksComponent } from './decks/decks.component';
import { CollectionComponent } from './collection/collection.component';

@NgModule({
    declarations: [
        AppComponent,
        CardSetTileComponent,
        ViewSetComponent,
        SetDashboardComponent,
        PageNotFoundComponent,
        PackOpeningComponent,
        SealedDraftComponent,
        ViewCardComponent,
        ViewCardModalComponent,
        DeckBuilderComponent,
        DecksComponent,
        CollectionComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
