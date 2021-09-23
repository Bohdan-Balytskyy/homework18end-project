import { ElementRef } from '@angular/core';
import { ActiveIconDirective } from './active-icon.directive';

describe('ActiveIconDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef('someEl');
    const directive = new ActiveIconDirective(el);
    expect(directive).toBeTruthy();
  });
});
