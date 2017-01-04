import test from 'ava';

//test的多余的参数会传递给测试函数,于是有：
function macro(t, input, expected) {
    t.is(eval(input), expected);
}

test('2 + 2 === 4oo', macro, '2 + 2', 4);
test('2 * 3 === 6oo', macro, '2 * 3', 6);

//绑定title
//providedTitle是test的第一个参数，默认为''
macro.title = (providedTitle, input, expected) => `${providedTitle} ${input} === ${expected}`.trim();

test(macro, '2 + 2', 4);
test(macro, "'6oo'", '6oo');
test('providedTitleoo', macro, '3 * 3', 9);

//可以传递macro数组
const safeEval = require('safe-eval');

function evalMacro(t, input, expected) {
    t.is(eval(input), expected);
}

function safeEvalMacro(t, input, expected) {
    t.is(safeEval(input), expected);
}

test([evalMacro, safeEvalMacro], '2 + 2', 4);
test([evalMacro, safeEvalMacro], '2 * 3', 6);