// tests/reverse.test.js
// const { test } = require('node:test');
// const assert = require('node:assert');
const { reverse, average } = require('../utilis/for_testing'); // Adjust the path if necessary

// Test the reverse function
describe("Reverse Test", ()=>{
  test('reverse of "a" is "a"', () => {
    const result = reverse('a');
    expect(result).toBe('a');
  });
  
  test('reverse of "hello" is "olleh"', () => {
    const result = reverse('hello');
    expect(result).toBe('olleh');
  });
  
  test('reverse of an empty string is an empty string', () => {
    const result = reverse('');
    expect(result).toBe('');
  });
})

// Test the average function
describe('Average Test', ()=>{
  test('average of [1, 2, 3] is 2', () => {
    const result = average([1, 2, 3]);
    expect(result).toBe(2);
  });
  
  test('average of an empty array is 0', () => {
    const result = average([]);
    expect(result).toBe(0);
  });
  
  test('average of [1, 2, 3, 4, 5] is 3', () => {
    const result = average([1, 2, 3, 4, 5]);
    expect(result).toBe(3);
  });
  
  
})
// test('reverse of a', () => {
//     const result = reverse('a');
//     assert.strictEqual(result, 'a');
// });

// test('reverse of react', () => {
//     const result = reverse('react');
//     assert.strictEqual(result, 'tcaer');
// });

// test('reverse of saippuakauppias', () => {
//     const result = reverse('saippuakauppias');
//     assert.strictEqual(result, 'saippuakauppias');
// });

// test('reverse of rohit', ()=>{
//     const ans = reverse('rohit')
//     assert.strictEqual(ans, 'tihor')
// })
