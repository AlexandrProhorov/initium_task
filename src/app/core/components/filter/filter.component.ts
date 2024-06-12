import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'filter-view',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent { // Компонент фильтра, вызывается при вводе данных в инпут
    @Input() onSubmit: EventEmitter<string> = new EventEmitter<string>();
    @Output() onChange: EventEmitter<string> = new EventEmitter<string>();

    onSubmitValue(event: any) {
        if (!this.onSubmit) return;
        const value = event.target.value;
        this.onSubmit.emit(value);
    }
    onChangeValue(event: any) {
        if (!this.onChange) return;
        const value = event.target.value;
        this.onChange.emit(value);
    }
}
