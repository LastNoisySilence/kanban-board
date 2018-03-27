import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pluck';

import {Todo} from './modules/kanban/kanban.service';


interface IState {
  todos: Todo[];
}

const State: IState = {
  todos: []
};


export class Store {
  private subject = new BehaviorSubject<IState>(State);
  private store = this.subject.asObservable().distinctUntilChanged();

  get value() {
    return this.subject.value;
  }

  set(name: string, state: any) {
    this.subject.next({
      ...this.value, [name]: state
    });
  }

  get<T>(name: string): Observable<T> {
    return this.store.pluck(name);
  }
}
