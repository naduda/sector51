import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'sector51-combo',
  templateUrl: './combo.component.html',
  styles: [ `
  div.p-2.dropdown-menu {
    max-height: 100px;
    overflow-y: auto;
  }
  i::after { margin-left: 0.5rem; }` ]
})
export class ComboComponent {
  @Output() onchange: EventEmitter<any> = new EventEmitter();
  @Input() itemToText: Function | string;
  @Input() itemToValue: Function | string;
  @Input() set selected(value) {
    this._selected = value;
    if (value) {
      this.selectedValue = value;
    }
  };
  get selected() {
    return this._selected;
  }
  private _selected: any;
  @Input() set items(value: any[]) {
    this._items = value;
    if (!value || value.length === 0) return;
    if (this.selected) {
      for (let i = 0; i < value.length; i++) {
        this.item = value[i];
        this.selectedValue = this.itemText(this.item);
        if (this.selected !== this.selectedValue) continue;
        break;
      }
    } else {
      this.item = value[0];
      this.selectedValue = this.itemText(this.item);
    }
  }
  _items: any[];
  item: any;
  selectedValue: string;

  constructor() { }

  changeValue(selectedItem: any) {
    this.item = selectedItem;
    this.selectedValue = this.itemText(selectedItem);
    this.onchange.emit(selectedItem);
  }
  
  itemText(item): string {
    return typeof this.itemToText === 'string' ?
    item[this.itemToText as string] : this.itemToText(item);
  }
  
  itemValue(item) {
    return typeof this.itemToValue === 'string' ?
    item[this.itemToValue as string] : this.itemToValue(item);
  }
  
  get valueToText() {
    return this.selectedValue;
  }
}
