import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from './todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();
  private nextId = 1;

  addTodo(text: string): void {
    const currentTodos = this.todosSubject.value;
    const newTodo: Todo = {
      id: this.nextId++,
      text: text.trim(),
      completed: false
    };
    this.todosSubject.next([...currentTodos, newTodo]);
  }

  toggleTodo(id: number): void {
    const currentTodos = this.todosSubject.value;
    const updatedTodos = currentTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.todosSubject.next(updatedTodos);
  }

  deleteTodo(id: number): void {
    const currentTodos = this.todosSubject.value;
    const filteredTodos = currentTodos.filter(todo => todo.id !== id);
    this.todosSubject.next(filteredTodos);
  }
}