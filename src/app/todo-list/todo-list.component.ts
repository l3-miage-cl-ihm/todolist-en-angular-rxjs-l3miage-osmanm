import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal, } from '@angular/core';
import { TodoItem, TodoList, initialTDL } from '../data/todolist';
import { NonEmptyList, nonEmptyList } from '../data/utils';

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
  public readonly filterAll:FCT_FILTER=(()=>{return true});
  public readonly filterDone:FCT_FILTER=((i:TodoItem)=>{return i.done});
  public readonly filterUndone:FCT_FILTER=((i:TodoItem)=>{return !(i.done)});
  private readonly _currentFilter=signal<FCT_FILTER>(this.filterAll)
  
  readonly sigState = computed<TdlState>( () => {
    
    return {
      tdl:this.tdl,
      nbItemsLeft:this.nbItemsUndone(),
      isAllDone:this.tdl.items.every((i:TodoItem)=>{ (i.done)==true}),
      currentFilter:this._currentFilter(),
      filteredItems: this.tdl.items.filter(this._currentFilter())
    }});
    public updateAppendI(e:string):void{
      if (e.length>0){
        let h:NonEmptyList<string>=[e]
        this.appendItems.emit(h);
      }
      
    }
    updateItem(p:Partial<TodoItem>,t: NonEmptyList<TodoItem>){
      const items = this.tdl.items;
      if(nonEmptyList(items)){
        this.updateItems.emit([p,t])
      }
    }
    deleteItem(t:TodoItem){
      this.deleteItems.emit([t]);
    }
     
    checkAllItems(){
      const items = this.tdl.items;
      if (nonEmptyList(items)) {
        this.updateItems.emit([
          { done:!this.sigState().isAllDone},
          items
        ])
      }
    }
    nbItemsUndone() {
      return this.tdl.items.reduce((acc, val) => !val.done ? acc + 1 : acc, 0);
    }


    public RmvElemtsDone(){
      let e:TodoItem[]=this.tdl.items.filter(item=>item.done)
      if (nonEmptyList(e))
        this.deleteItems.emit(e);
    
    }
    
    public currentFilterToAll(){
      this._currentFilter.set(this.filterAll);
    }
    public currentFilterToDone(){
      this._currentFilter.set(this.filterDone);
    }
    public currentFilterToUnDone(){
      this._currentFilter.set(this.filterUndone);
    }
     
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


