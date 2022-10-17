import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoGateway } from './todo.gateway';

@Injectable()
export class TodoService {
  counter = 0;
  todos: Todo[] = [];

  constructor(private todoGateway: TodoGateway) {}

  create(createTodoDto: CreateTodoDto) {
    const id = this.counter++;
    this.todos.push(new Todo(id, createTodoDto.description));
    this.todoGateway.newTodo(id);
  }

  findAll() {
    return this.todos;
  }

  findOne(id: number) {
    return this.todos.find((todo) => todo.id == id);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = this.todos.find((todo) => todo.id == id);
    if (todo) {
      todo.description = updateTodoDto.description;
    }
    this.todoGateway.todoChanged(id);
  }

  remove(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.todoGateway.todoRemoved(id);
  }
}
