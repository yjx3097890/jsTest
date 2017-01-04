import test from 'ava';

//如果一个test中有多个断言失败，ava只显示第一个。

//     .pass([message])
// Passing assertion.

//     .fail([message])
// Failing assertion.

//     .truthy(value, [message])
// Assert that value is truthy.

//     .falsy(value, [message])
// Assert that value is falsy.

//     .true(value, [message])
// Assert that value is true.

//     .false(value, [message])
// Assert that value is false.

//     .is(value, expected, [message])
// Assert that value is equal to expected.

//     .not(value, expected, [message])
// Assert that value is not equal to expected.

//     .deepEqual(value, expected, [message])
// Assert that value is deep equal to expected.

//     .notDeepEqual(value, expected, [message])
// Assert that value is not deep equal to expected.

//     .throws(function|promise, [error, [message]])
// Assert that function throws an error, or promise rejects with an error.
// error can be an error constructor, error message, regex matched against the error message, or validation function.
// Returns the error thrown by function or a promise for the rejection reason of the specified promise.
const fn = () => {
    throw new TypeError('🦄');
};
test('throwsoo', t => {
    const error = t.throws(() => {
        fn();
    }, TypeError);

    t.is(error.message, '🦄');
});
const promise = Promise.reject(new TypeError('🦄'));
test('rejectsoo', async t => {
    const error = await t.throws(promise);
    t.is(error.message, '🦄');
});

// .notThrows(function|promise, [message])
// Assert that function does not throw an error or that promise does not reject with an error.

//     .regex(contents, regex, [message])
// Assert that contents matches regex.

//     .notRegex(contents, regex, [message])
// Assert that contents does not match regex.

//     .ifError(error, [message])
// Assert that error is falsy.

//     .snapshot(contents, [message])
// Make a snapshot of the stringified contents.

//t.skip.xxx()可以跳过断言，但仍然记在plan中

test('enhanceoo', t => {
    const a = /foo/;
    const b = 'bar';
    const c = 'baz';
    t.true(a.test(b) || b === c);
});