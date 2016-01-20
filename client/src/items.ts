import {Store} from '@ngrx/store';
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

export interface Item {
  id: string;
  name: string;
  description: string;
}

export interface AppStore {
  items: Item[];
  selectedItem: Item;
}

//-------------------------------------------------------------------
// ITEMS STORE
//-------------------------------------------------------------------
export const items = (state: any = [], {type, payload}) => {
  switch (type) {
    case 'ADD_ITEMS':
      return payload;
    case 'CREATE_ITEM':
      return [...state, payload];
    case 'UPDATE_ITEM':
      return state.map(item => {
        return item.id === payload.id ? Object.assign({}, item, payload) : item;
      });
    case 'DELETE_ITEM':
      return state.filter(item => {
        return item.id !== payload.id;
      });
    default:
      return state;
  }
};

//-------------------------------------------------------------------
// SELECTED ITEM STORE
//-------------------------------------------------------------------
export const selectedItem = (state: any = null, {type, payload}) => {
  switch (type) {
    case 'SELECT_ITEM':
      return payload;
    default:
      return state;
  }
};

//-------------------------------------------------------------------
// ITEMS SERVICE
//-------------------------------------------------------------------
@Injectable()
export class ItemsService {
  items: Observable<Array<Item>>;

  constructor(private store: Store<AppStore>) {
    this.items = store.select('items');
  }

  loadItems() {
    // NOTE: Hard coding data for now... will replace with http calls
    let initialItems: Item[] = [
      {'id': '1', 'name': 'Item 1', 'description': 'This is a description'},
      {'id': '2', 'name': 'Item 2', 'description': 'This is a description'},
      {'id': '3', 'name': 'Item 3', 'description': 'This is a lovely item'}
    ];

    this.store.dispatch({ type: 'ADD_ITEMS', payload: initialItems });
  }

  saveItem(item: Item) {
    (item.id) ? this.updateItem(item) : this.createItem(item);
  }

  createItem(item: Item) {
    this.store.dispatch({ type: 'CREATE_ITEM', payload: this.addUUID(item) });
  }

  updateItem(item: Item) {
    this.store.dispatch({ type: 'UPDATE_ITEM', payload: item });
  }

  deleteItem(item: Item) {
    this.store.dispatch({ type: 'DELETE_ITEM', payload: item });
  }

  // NOTE: Utility functions to simulate server generated IDs
  private addUUID(item: Item): Item {
    return Object.assign({}, item, {id: this.generateUUID()}); // Avoiding state mutation FTW!
  }

  private generateUUID(): string {
    return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11)
      .replace(/1|0/g, function() {
        return (0 | Math.random() * 16).toString(16);
      });
  };
}
