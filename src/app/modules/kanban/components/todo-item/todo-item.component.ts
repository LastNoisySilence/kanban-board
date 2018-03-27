import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Board, Todo} from '../../kanban.service';


@Component({
  selector: 'kanban-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {

  @Input()
  todo: Todo;
  @Output()
  onRemoveTodo: EventEmitter<Todo> = new EventEmitter();
  @Output()
  onEditTodo: EventEmitter<Todo> = new EventEmitter();

  isDoneOrAborted(todo: Todo): boolean {
    return todo.state === Board.DONE || todo.state === Board.ABORTED;
  }

  isDoItOrInProgress(todo: Todo): boolean {
    return todo.state === Board.DO_IT || todo.state === Board.IN_PROGRESS;
  }

}
