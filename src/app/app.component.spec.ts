import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TodoService } from './todo.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule],
      providers: [TodoService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('Todo List');
  });

  it('should render title in template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Todo List');
  });

  it('should initialize with empty newTodoText', () => {
    expect(component.newTodoText).toEqual('');
  });

  it('should add todo when addTodo is called with valid text', () => {
    component.newTodoText = 'Test Todo';
    spyOn(todoService, 'addTodo');
    
    component.addTodo();
    
    expect(todoService.addTodo).toHaveBeenCalledWith('Test Todo');
    expect(component.newTodoText).toEqual('');
  });

  it('should not add todo when addTodo is called with empty text', () => {
    component.newTodoText = '   ';
    spyOn(todoService, 'addTodo');
    
    component.addTodo();
    
    expect(todoService.addTodo).not.toHaveBeenCalled();
  });

  it('should call todoService.toggleTodo when toggleTodo is called', () => {
    spyOn(todoService, 'toggleTodo');
    
    component.toggleTodo(1);
    
    expect(todoService.toggleTodo).toHaveBeenCalledWith(1);
  });

  it('should call todoService.deleteTodo when deleteTodo is called', () => {
    spyOn(todoService, 'deleteTodo');
    
    component.deleteTodo(1);
    
    expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
  });
});
