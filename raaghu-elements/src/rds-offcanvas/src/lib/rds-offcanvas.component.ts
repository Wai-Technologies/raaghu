import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'rds-offcanvas',
  templateUrl: './rds-offcanvas.component.html',
  styleUrls: ['./rds-offcanvas.component.scss']
})
export class RdsOffcanvasComponent implements OnInit {


  @Input() buttonTitle = 'Button'
  @Input() placement?: 'start' | 'end' | 'top' | 'bottom' = 'start';
  @Input() backDrop?: boolean = true;
  @Input() scrolling?: boolean = true;
  @Input() offId = 'canvasExample';
  @Input() canvasTitle: string = '';
  @Input() offcanvaswidth = 250;
  @Input() colorVariant?: 'light';
  @Input() bodySpacing: boolean = true;
  @Output() onShow = new EventEmitter<Event>();
  @Output() onClose = new EventEmitter<Event>();

  constructor() { }

  ngOnInit(): void {
  }

  public get classes(): string {
    let align = ` offcanvas offcanvas-${this.placement}`;
    if (`${this.colorVariant}` !== undefined && `${this.colorVariant}` !== "" && `${this.colorVariant}` !== "undefined") {
      align = align + ' offcanvas-bg-color ';
    }
    return align;
  }
  public get bodyClasses(): string {
    let spacing = `${this.bodySpacing === false ? ' p-0' : ''}`;
    return spacing;
  }
}
