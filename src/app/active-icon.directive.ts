import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[activeIcon]'
})
export class ActiveIconDirective {
  
  @Input() set activeIcon(condition: boolean) {
    let style = this.elementRef.nativeElement.style;
    if (condition) {
      style.backgroundColor = "#e8fce8";
      style.boxShadow = "0 0 2px 2px lightgreen";
    } else {
      style.backgroundColor = "floralwhite";
      style.boxShadow = "0 0 0px 0px lightgreen";
    }
  }
  constructor(private elementRef: ElementRef) {
  }
}
