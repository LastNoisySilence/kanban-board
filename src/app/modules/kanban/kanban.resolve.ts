import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {KanbanService, Todo} from './kanban.service';


@Injectable()
export class KanbanResolve implements Resolve<Todo> {

  constructor(private data: KanbanService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.data.getTodoById(route.params.id);
  }
}
