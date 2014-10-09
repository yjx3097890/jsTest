#使用class定义类：class 类名 extends 父类 ， 定义类的格式与定义对象类似
#construction 定义类的构造函数，在传参中直接使用“@变量”是this赋值的简写,此时可以省略函数体，但不能省略->
#在类的定义中 @变量 表示给类函数本身定义静态属性，不加@则都是在原型即为实例定义属性
#super表示父类，在函数中使用super，默认调用父类中同名函数

class Animal
        constructor: (name,@age) -> @name = name + "a"
        @attr: 'title'
        type: "text"
        move: (meters) -> alert @name + "move #{meters}m."
        
class Snake extends Animal
    constructor: (@name) ->
    move: -> 
        alert "slithering..."
        super 5
        
class Horse extends Animal
    move: ->
        alert ("gallop...")
        super.move 45
        
sam = new Snake "Sammy the Python"
tom = new Horse "Tommy the Palomino"

sam.move()
tom.move()
    
#使用 :: 可以快速引用对象原型
       
String::dasherize = ->
    @replace /_/g, "-"
       
#使用 => 可以定义函数并把函数中的this绑定为当前环境对象
#若在函数定义中使用 => ，则会把this自动绑定为实例化的对象

Account = (@customer, @cart) -> 
    $(".shopping").bind "click", (event) => @customer.purcher @cart