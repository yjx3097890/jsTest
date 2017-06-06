import test from 'ava';

//promise
test('proo', t => {
    return Promise.resolve('unicorn').then(result => {
        t.is(result, 'unicorn');
    });
});

//generator
test('genoo', function* (t) {
    const value = yield Promise.resolve(true);
    t.true(value);
});

//async await
test('asyncoo', async function (t) {
    const value = await Promise.resolve(true);
    t.true(value);
});

// async arrow function
test(async t => {
    const value = await Promise.resolve(true);
    t.true(value);
});

//Observable
test('ooo', t => {
    t.plan(3);
    return require('rxjs/Rx').Observable.of(1, 2, 3, 4, 5, 6)
        .filter(n => {
            // only even numbers
            return n % 2 === 0;
        })
        .map(() => t.pass());
});

//callback
test.cb.skip(t => {
    // t.end automatically checks for error as first argument
    fs.readFile('data.txt', t.end);
});