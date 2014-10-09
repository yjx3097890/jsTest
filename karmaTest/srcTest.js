//jasmine 测试脚本

describe("测试src.js文件", function () {
  it('使字符串翻转', function () {
    expect("dcba").toEqual(reverse('abcd'));
  });
});
