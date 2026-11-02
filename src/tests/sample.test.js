import { sum } from '../modules/sum.js';

it('Adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
