import {Pipe, PipeTransform} from '@angular/core';

import {Priority, Todo} from './kanban.service';


@Pipe({
  name: 'kanbanSort'
})
export class KanbanPipe implements PipeTransform {

  transform(todos: Todo[], args?: any): Todo[] {
    if (todos) {
      todos.sort((a, b) => {
        const date1: Date = new Date(a.creationTime.toString());
        const date2: Date = new Date(b.creationTime.toString());

        return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
      });
      todos.sort((a, b) => {
        const priority1: number = a.priority === Priority.LOW ? 1
          : a.priority === Priority.NORMAL ? 2
          : a.priority === Priority.HIGHT ? 3
          : 0;
        const priority2: number = b.priority === Priority.LOW ? 1
          : b.priority === Priority.NORMAL ? 2
          : b.priority === Priority.HIGHT ? 3
          : 0;
        return priority1 > priority2 ? -1 : priority1 < priority2 ? 1 : 0;
      });
    }
    return todos;
  }

}
