import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import {Store} from '../../store';


export class Todo {

  public creationTime: string | Date;
  public state: string;

  constructor(
    public id: number,
    public title: string,
    public description: string,
    public priority: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.creationTime = new Date().toString();
    this.state = Board.DO_IT;
  }
}

export enum Board {
  DO_IT = 'DO IT',
  IN_PROGRESS = 'IN PROGRESS',
  DONE = 'DONE',
  ABORTED = 'ABORTED'
}

export enum Priority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGHT = 'hight'
}


@Injectable()
export class KanbanService {

  constructor(
    private http: HttpClient,
    private store: Store,
    @Inject('api') private api: string
  ) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.api}/todos`)
      .do(next => this.store.set('todos', next));
  }

  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.api}/todos?id=${id}`).map(
      todos => todos[0]
    );
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.api}/todos`, todo)
      .do(next => this.store.set('todos', [...this.store.value.todos, next]));
  }

  updateTodoById(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.api}/todos/${id}`, todo)
      .do(
        next => this.store.set(
          'todos',
          [...this.store.value.todos.filter(_todo => _todo.id !== next.id), next]
        )
      );
  }

  removeTodoById(id: number) {
    return this.http.delete(`${this.api}/todos/${id}`)
      .do(() => this.store.set(
        'todos',
        this.store.value.todos.filter(todo => todo.id !== id))
      );
  }

}
