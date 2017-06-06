import test from 'ava';

test('foo', t=> {
    t.plan(1)
    console.log(22);
    t.pass();
})

//会首先顺序运行serial的测试
test.serial('qoo', t => {
    console.log(11)
    console.log(t.context.data)

    t.pass();
});

//所有文件只会运行这个，胡说！因为用了match，它的优先极高
test.only('woo', t => {
    console.log(33)
    t.pass();
});

test.todo('will think about writing this lateroo');

test.failing('demonstrate some bugoo', t => {
    console.log(44)
    t.fail(); // test will count as passed
});

test.skip('will not be runoo', t => {
    console.log(44)
    t.fail();
});


test.before('before1', t => {
    // 这个会在本文件的所有测试前运行
    console.log(0)
    return Promise.resolve('b1');
});

test.before(async t => {
    console.log(0.1)
    await Promise.resolve('b2');
    // 这个会在上面的方法后面运行，但在测试之前运行

});

test.after('cleanup', t => {
    // 这个会在所有测试之后运行
    //test.after.always() 在所有测试和钩子完成后运行，无论成败，受fail-fast影响
});

test.beforeEach(t => {
    // 这个会在每个测试之前运行，在before之后
    t.context.data = 'context1'; //context设置不能在before，after里用。
});

test.afterEach(t => {
    // 这个会在每个测试之后运行，在after之前
    //test.afterEach.always() 在所有测试和钩子完成后运行，无论成败，受fail-fast影响
});
//.serial, .only and .skip等都可以在before, after, beforeEach and afterEach上使用。