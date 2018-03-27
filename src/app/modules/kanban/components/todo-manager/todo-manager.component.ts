import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Priority} from '../../kanban.service';


@Component({
  selector: 'kanban-todo-manager',
  templateUrl: './todo-manager.component.html',
  styleUrls: ['./todo-manager.component.scss']
})
export class TodoManagerComponent implements OnInit {

  @Output()
  onInit: EventEmitter<TodoManagerComponent> = new EventEmitter();
  @Output()
  onSubmitTodo: EventEmitter<FormGroup> = new EventEmitter();

  isPreviewMode: boolean;
  submitButtonName: string;
  form: FormGroup;
  priorities: { value: string, color: string }[];

  ngOnInit() {
    this.isPreviewMode = false;
    this.submitButtonName = 'Create todo';
    this.priorities = [
      { value: Priority.LOW, color: '#11CD86' },
      { value: Priority.NORMAL, color: '#F6D600' },
      { value: Priority.HIGHT, color: '#F70044' }
    ];
    this.form = new FormGroup({
      title: new FormControl(
        '',
        [ Validators.required, Validators.minLength(3) ]
      ),
      description: new FormControl(
        '',
        [ Validators.required, Validators.minLength(20) ]
      ),
      priority: new FormControl(
        '',
        [ Validators.required ]
      )
    });
    this.onInit.emit(this);
  }

  isControlInvalid(controlName: string, errorCode?: string): boolean {
    return (
      this.form.get(controlName).hasError(errorCode) &&
      (
        this.form.get(controlName).touched ||
        this.form.get(controlName).dirty
      )
    );
  }

  submitTodo(): void {
    if (this.form.valid) {
      this.onSubmitTodo.emit(this.form);
    }
  }

}
