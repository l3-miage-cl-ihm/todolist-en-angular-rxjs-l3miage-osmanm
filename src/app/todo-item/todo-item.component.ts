import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { TodoItem, deleteItems, initialTDL } from '../data/todolist';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoItemComponent {
  public sigItemState;

  private _sigItem = signal<TodoItem>(initialItem);
  protected _sigEditing = signal<boolean>(false);
  @Input({ required: true })
    get tdi() {return this._sigItem()}
    set tdi(v: TodoItem) {this._sigItem.set(v)}
  @Output() update=new EventEmitter<Partial<TodoItem>>()
  @Output() delete=new EventEmitter<TodoItem[]>()

  constructor(){
    this.sigItemState=computed<ItemState>(()=>{
      return {item:this.tdi,editing:this.editing}
    })
  }
  protected get editing() : boolean{
    return this._sigEditing();
  }
  public deleteItem(i:TodoItem){
    this.delete.emit([i]);
  }
  updateItemLabel(s:string){
    this.update.emit({
      ...this.tdi,
      label:s
    })
  }
  checksDoneItem(b:boolean){
    this.update.emit({
      ...this.tdi,
      done:b
    })
  }
    
  
}
interface ItemState {
  readonly item: TodoItem; 
  readonly editing: boolean; // true ssi l'utilisateur est en train d'éditer le label de la tâche
}
const initialItem=initialTDL.items[0];