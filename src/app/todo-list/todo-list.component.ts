import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { TodoItem, TodoList, initialTDL } from '../data/todolist';
import { NonEmptyList } from '../data/utils';
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/*filterDone (on affiche la tâche si et seulement
   si elle est réalisée) et filterUndone (on affiche la tâche si et seulement si elle n'est pas réalisée). 
   Vous aurez probablement besoin de déclarer un signal privé readonly _currentFilter pour gérer le filtre courant. */
export class TodoListComponent {
  private _sigTdl = signal<TodoList>(initialTDL)
  @Input({ required: true }) 
    get tdl() {return this._sigTdl()}
    set tdl(v: TodoList) {this._sigTdl.set(v)}
  @Output() appendItems= new EventEmitter<NonEmptyList<string>>()
  @Output() deleteItems= new EventEmitter<NonEmptyList<TodoItem>>()
  @Output() updateItems = new EventEmitter<readonly [Partial<TodoItem>, NonEmptyList<TodoItem>]>()
  private readonly filterAll:FCT_FILTER=(()=>{return true});
  private readonly filterDone:FCT_FILTER=((i:TodoItem)=>{return i.done});
  private readonly filterUndone:FCT_FILTER=((i:TodoItem)=>{return !(i.done)});
  private readonly _currentFilter=signal<FCT_FILTER>(this.filterAll)
  
  readonly sigState = computed<TdlState>( () => {
    
    return {
      tdl:this.tdl,
      nbItemsLeft:this.tdl.items.length,
      isAllDone:this.tdl.items.every((i:TodoItem)=>{ (i.done)==true}),
      currentFilter:this._currentFilter(),
      filteredItems: this.tdl.items.filter(this._currentFilter())
    }});


}




interface TdlState {
  readonly tdl: TodoList;
  readonly nbItemsLeft: number;
  readonly isAllDone: boolean;
  readonly currentFilter: FCT_FILTER;
  readonly filteredItems: readonly TodoItem[];
}

// avec
type FCT_FILTER = (item: TodoItem) => boolean;
