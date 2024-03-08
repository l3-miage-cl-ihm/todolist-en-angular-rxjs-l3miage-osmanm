import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TodoList } from './data/todolist';
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
}
