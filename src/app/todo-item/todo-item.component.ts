import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { TodoItem, deleteItems, initialTDL } from '../data/todolist';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
Vous devrez donc gérer un signal interne pour modéliser 
le fait que vous éditez ou pas le label de l'item. Exposez les valeurs de ce signal 
sous la forme d'un attribut calculé en lecture seul nommé editing 
(en lecture seul signifie que vous ne spécifierez que le getter).
 Pour que ce signal ne soit pas visible de l'extérieur du composant 
 mais seulement dans le composant et son template, donnez lui une portée protected. 
 Utilisez ce signal, conjointement avec l'entrée item pour en dériver 
 l'état interne de votre composant. */
export class TodoItemComponent {
  //private _sigTDI=signal<TodoItem>(initialTDL.items[0])
  public sigItemState;

  private _sigItem = signal<TodoItem>(initialItem);
  protected _sigEditing = signal<boolean>(false);
  @Input({ required: true })
    tdi!: TodoItem;
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