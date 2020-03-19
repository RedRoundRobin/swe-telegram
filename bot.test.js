//const sum = require('./bot');
const jsonTest = require('./bot');
/*
test('adds 2 + 2 to equal 4', () => {
    expect(sum(2, 2)).toBe(4);
});

 */
test('extracts value from JSON formatted string', () => {
    let num = jsonTest();
    expect(num).toBe(42);
});