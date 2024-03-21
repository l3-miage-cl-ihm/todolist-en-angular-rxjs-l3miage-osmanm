import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TodoItem, TodoList } from './data/todolist';
import { NonEmptyList } from './data/utils';
import { TodoListService } from './todo-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
 public sigITEMS=computed<TodoList>(()=>{return this.todServ.sigTDL()})
 constructor(private todServ:TodoListService){
  
 }
 appendItemsR(s: NonEmptyList<string>) {
  console.log([s]);
  this.todServ.appendItems(s);
}

updateItemR(l: readonly [Partial<TodoItem>, NonEmptyList<TodoItem>]) {
  this.todServ.updateItems(l[0], l[1]);
}
deleteItemsR(t: NonEmptyList<TodoItem>) {
  this.todServ.deleteItems(t);
}

}
