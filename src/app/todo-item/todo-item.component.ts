import { AfterViewChecked, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, Subject, bufferCount, filter, switchMap } from 'rxjs';
import { TodoItem, initialTDL } from '../data/todolist';
@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoItemComponent implements AfterViewChecked {
  public sigItemState;

  private _sigItem = signal<TodoItem>(initialItem);
  protected _sigEditing = signal<boolean>(false);
  @Input({ required: true })
    get tdi() {return this._sigItem()}
    set tdi(v: TodoItem) {this._sigItem.set(v)}
  @Output() update=new EventEmitter<Partial<TodoItem>>()
  @Output() delete=new EventEmitter<TodoItem[]>()
  /**On basculera alors (opérateur switchMap) sur l’observable viewChecked, 
   * de sorte à attendre le prochain rafraichissement de la vue du composant. */
  constructor(){
    this.sigItemState=computed<ItemState>(()=>{
      return {item:this.tdi,editing:this.editing}
    })
    this.obsItemState=toObservable<ItemState>(this.sigItemState);
    this.twoVals=this.obsItemState.pipe(filter(()=>this.editing),
                                        bufferCount(2),
                                        switchMap(()=>this.obsItemState),
                                        ); //array of last two events when editing true,then refresh viewchecked
    this.abonnement()
  }
  public abonnement(){
    this.obsItemState.subscribe();
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
    private _viewChecked= new Subject<void>;
    public ngAfterViewChecked(): void {
      this._viewChecked.next();
    }
  
    public obsItemState:Observable<ItemState>;
    public twoVals;
}
interface ItemState {
  readonly item: TodoItem; 
  readonly editing: boolean; // true ssi l'utilisateur est en train d'éditer le label de la tâche
}
const initialItem=initialTDL.items[0];


