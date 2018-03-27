import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';

export const ROUTES: Routes = [
  { path: '', loadChildren: './modules/kanban/kanban.module#KanbanModule' },
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
