import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {Board, KanbanService, Todo} from './kanban.service';
import {Store} from '../../store';
import {TodoManagerComponent} from './components/todo-manager/todo-manager.component';

import {MatDialog} from '@angular/material';
import {DragulaService} from 'ng2-dragula';


@Component({
  selector: 'kanban-board',
  template: `
    <div
      fxLayout="row"
      fxLayoutGap="10px">
      <ng-container *ngFor="let board of boards">
        <kanban-todo-list
          fxFlex="2 2 calc(10em + 10px)"
          [listTitle]="board?.title"
          [todos]="board?.todos$ | async"
          (onEditTodo)="editTodo($event)"
          (onRemoveTodo)="removeTodo($event)">
        </kanban-todo-list>
      </ng-container>
    </div>
    <button
      mat-fab
      color="primary"
      class="create-todo"
      (click)="openTodoManager()">
      <mat-icon>playlist_add</mat-icon>
    </button>
  `,
  styles: [`
    .create-todo {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  `]
})
export class KanbanComponent implements OnInit, OnDestroy {

  boards: { title: string, todos$: Observable<Todo[]> }[];
  todos$: Observable<Todo[]>;
  selectedTodo$: Observable<Todo> = this.route.data.pluck('todo');
  todosSubscription: Subscription;
  todoManagerSubscription: Subscription;
  lastTodoID: number;

  constructor(
    private store: Store,
    private data: KanbanService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private dragula: DragulaService
  ) {
    dragula.drop.subscribe(value => {
      const droppedTodoID = value[1].id;
      const state = value[2].id;
      data.updateTodoById(
        droppedTodoID, {
          ...store.value.todos.find(todo => todo.id.toString() === value[1].id),
          state
        }
      ).subscribe();
    });
    dragula.setOptions('todos', {
      direction: 'horizontal',
      accepts(el, target, source) {
        return (
          source.id === Board.DO_IT && target.id === Board.IN_PROGRESS ||
          source.id === Board.IN_PROGRESS && target.id === Board.DONE ||
          (source.id === Board.DO_IT || source.id === Board.IN_PROGRESS) && target.id === Board.ABORTED
        );
      }
    });
    this.selectedTodo$.subscribe(todo => {
      if (todo) {
        this.openTodoManager(todo);
      }
    });
  }

  openTodoManager(todo?: Todo) {
    const dialogRef = this.dialog.open(TodoManagerComponent, {
      hasBackdrop: true,
      maxWidth: 500
    });
    if (!todo) {
      this.todoManagerSubscription = dialogRef.componentInstance.onSubmitTodo.subscribe(
        form => this.data.createTodo(
          new Todo(
            this.lastTodoID + 1,
            form.value.title,
            form.value.description,
            form.value.priority
          )
        ).subscribe(() => dialogRef.close())
      );
    } else {
      dialogRef.componentInstance.onInit.subscribe((todoEditor: TodoManagerComponent) => {

        todoEditor.form.controls['title'].setValue(todo.title);
        todoEditor.form.controls['description'].setValue(todo.description);
        todoEditor.form.controls['priority'].setValue(todo.priority);

        if (todo.state === Board.DO_IT || todo.state === Board.IN_PROGRESS) {
          todoEditor.submitButtonName = 'Update todo';
          todoEditor.form.controls['title'].disable();
          if (todo.state === Board.IN_PROGRESS) {
            todoEditor.form.controls['description'].disable();
          }
          if (todo.state === Board.DO_IT) {
            todoEditor.form.controls['priority'].disable();
          }
        } else {
          todoEditor.form.controls['priority'].disable();
          todoEditor.isPreviewMode = true;
        }
      });
      this.todoManagerSubscription = dialogRef.componentInstance.onSubmitTodo.subscribe(
        form => this.data.updateTodoById(
          todo.id, {...todo, ...form.value}
        ).subscribe(() => dialogRef.close())
      );
    }
    dialogRef.afterClosed().subscribe(
      () => this.todoManagerSubscription.unsubscribe()
    );
  }

  editTodo(todo: Todo): void {
    this.openTodoManager(todo);
  }

  removeTodo(todo: Todo): void {
    this.data.removeTodoById(todo.id).subscribe();
  }

  ngOnInit(): void {
    this.todos$ = this.store.get<Todo[]>('todos').map(todos => {
      this.lastTodoID = Math.max(...todos.map(todo => todo.id)) || 0;
      return todos;
    });
    this.boards = [
      {
        title: Board.DO_IT,
        todos$: this.todos$.map(
          todos => todos.filter(todo => todo.state === Board.DO_IT)
        )
      },
      {
        title: Board.IN_PROGRESS,
        todos$: this.todos$.map(
          todos => todos.filter(todo => todo.state === Board.IN_PROGRESS)
        )
      },
      {
        title: Board.DONE,
        todos$: this.todos$.map(
          todos => todos.filter(todo => todo.state === Board.DONE)
        )
      },
      {
        title: Board.ABORTED,
        todos$: this.todos$.map(
          todos => todos.filter(todo => todo.state === Board.ABORTED)
        )
      }
    ];
    this.todosSubscription = this.data.getTodos().subscribe();
  }

  ngOnDestroy(): void {
    this.todosSubscription.unsubscribe();
  }

}
