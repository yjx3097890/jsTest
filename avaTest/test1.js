import test from 'ava';

test('foo', t=> {
    console.log(11)
    t.pass();
})

test('boo', async t => {
    console.log(12)
    const bar = Promise.resolve('bar');
    t.is(await bar, 'bar'); 
}) 