import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';

import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import {DragulaModule} from 'ng2-dragula';
import {FlexLayoutModule} from '@angular/flex-layout';

import {TodoItemComponent} from './components/todo-item/todo-item.component';
import {TodoListComponent} from './components/todo-list/todo-list.component';
import {TodoManagerComponent} from './components/todo-manager/todo-manager.component';
import {KanbanComponent} from './kanban.component';
import {KanbanService} from './kanban.service';
import {KanbanResolve} from './kanban.resolve';
import {Store} from '../../store';
import { KanbanPipe } from './kanban.pipe';


export const ROUTES: Routes = [
  {path: '', component: KanbanComponent},
  {path: ':id', component: KanbanComponent, resolve: { todo: KanbanResolve }}
];


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DragulaModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    TodoListComponent,
    TodoItemComponent,
    TodoManagerComponent,
    KanbanComponent,
    KanbanPipe
  ],
  exports: [
    KanbanComponent
  ],
  providers: [
    { provide: 'api', useValue: '/api' },
    KanbanService,
    KanbanResolve,
    Store
  ],
  entryComponents: [
    TodoManagerComponent
  ]
})
export class KanbanModule {
}
