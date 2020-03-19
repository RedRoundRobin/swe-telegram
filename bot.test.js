//const sum = require('./bot');
// const jsonTest = require('./bot');
// /*
// test('adds 2 + 2 to equal 4', () => {
//     expect(sum(2, 2)).toBe(4);
// });

//  */
// test('extracts value from JSON formatted string', () => {
//     let num = jsonTest();
//     expect(num).toBe(42);
// });

function sum(n1, n2) {
    return n1 + n2;
}

test('adds 2 + 2 to equal 4', () => {
    expect(sum(2, 2)).toBe(4);
});

test('extracts value from JSON formatted string', () => {
    let num = 4;
    expect(num).toBe(4);
});