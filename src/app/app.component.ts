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
 appendItemsR(s:string){
  if(s.length>0){
    let h:NonEmptyList<string>=[s] 
    this.todServ.appendItems(h);
  }
  
 }
 deleteItemsR(elmts:TodoItem){

    let h:NonEmptyList<TodoItem>=[elmts] 
    this.todServ.deleteItems(h) 
 }
 updateItemDone(item: TodoItem, event: Event): void {
  const input = event.target as HTMLInputElement;
  this.todServ.updateItems({ ...item, done: input.checked }, [item]);
}

updateItemLabel(item: TodoItem, event: Event): void {
  const input = event.target as HTMLInputElement;
  this.todServ.updateItems({ ...item, label: input.value }, [item]);
}
}
