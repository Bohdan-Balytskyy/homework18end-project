import { SumFormatPipe } from './sum-format.pipe';

describe('SumFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new SumFormatPipe();
    expect(pipe).toBeTruthy();
  });
  it('create an instance', () => {
    const pipe = new SumFormatPipe();
    expect(pipe.transform(123.456)).toBe('123,46');
  });
});
