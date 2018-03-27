import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Todo} from '../../kanban.service';


@Component({
  selector: 'kanban-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {

  @Input()
  listTitle: string;
  @Input()
  todos: Todo[];
  @Output()
  onRemoveTodo: EventEmitter<Todo> = new EventEmitter();
  @Output()
  onEditTodo: EventEmitter<Todo> = new EventEmitter();

}
