import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewSetComponent } from './view-set/view-set.component';
import { SetDashboardComponent } from './set-dashboard/set-dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SealedDraftComponent } from './sealed-draft/sealed-draft.component';
import { ViewCardComponent } from './view-card/view-card.component';
import { DecksComponent } from './decks/decks.component';
import { DeckBuilderComponent } from './deck-builder/deck-builder.component';
import { CollectionComponent } from './collection/collection.component';


const routes: Routes = [
  {path: 'view-set/:setName', component: ViewSetComponent},
  {path: 'dashboard', component: SetDashboardComponent},
  {path: 'sealed-draft', component: SealedDraftComponent},
  {path: 'view-card/:cardName', component: ViewCardComponent},
  {path: 'decks', component: DecksComponent},
  {path: 'builder', redirectTo: 'builder/', pathMatch: 'full'},
  {path: 'builder/:deckId', component: DeckBuilderComponent},
  {path: 'collection', component: CollectionComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
