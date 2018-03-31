import { Directive, OnInit, Input, Inject, ElementRef, Renderer, EventEmitter } from '@angular/core';

@Directive({
  selector: '[prFocus]'
})
export class FocusDirective implements OnInit {
  @Input('prFocus') prFocus: any;

  constructor(@Inject(ElementRef) private element: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    if (!this.prFocus) return;
    if (!this.prFocus.eventEmitter) this.prFocus.eventEmitter = new EventEmitter<boolean>();
    this.element.nativeElement.onfocus = (event) => this.prFocus.eventEmitter.emit(true);
    this.element.nativeElement.onblur = (event) => this.prFocus.eventEmitter.emit(false);
    this.prFocus.eventEmitter.subscribe(event => {
      event && this.prFocus.onFocus && this.prFocus.onFocus(this.element.nativeElement);
      !event && this.prFocus.onBlur && this.prFocus.onBlur(this.element.nativeElement);
      event && this.renderer.invokeElementMethod(this.element.nativeElement, 'focus', []);
    });
  }
}
