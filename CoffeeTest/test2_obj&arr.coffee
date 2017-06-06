#对象字面量中大括号是可省略的，但要注意缩进会改变语义
#若每条属性单独一行，则逗号也可省略
#@是this的简写，会编译为this

book = title: "abc",auther: "yjx" 
people ={ 
        name:
            firstName: "yan"
            lastName: "jixian"
        sex : "male"
        class : 3    
    }
log people.class    

    
#数组中括号不能省略，但行末的逗号可以省略    
songs = [
        "do", 2
        "li" 
        "hehe"
        ]
        
#在初始化和截取,改变数组时，[]中可以使用。。。 和。。 ， 两个点表示从头到尾，三个点没有尾
#截取(slice)数组时，[]中第一个数省略表示从序号0开始，尾数字省略表示到最大值
#在改变（splice）数组时，语法同上

numbers = [0...9]
numbera = [0..9]

copy = numbers[..];
copy = numbers[3..-2];

numbers[3..6] = [-3, -4, -5, -6]

#Destructuring Assignment （解构赋值）：把对象或数组拆开，把等号右边的值赋给左边对应的变量

theBait   = 1000
theSwitch = 0
[theBait, theSwitch] = [theSwitch, theBait]

#解构赋值可以用于提取深度嵌套的属性,
futuristits = 
    sculptor : "UB"
    painter: "VB"
    pont :
        name : "FT"
        address: [
            "111"
            "222"
        ]
{poet: {name, address: [street, city]}} = futuristits

#解构赋值也可用于字符串片段赋值

tag = "<impossible>"

[open, contents..., close] = tag.split("")

text = "Every literary critic believes he will
        outwit history and have the last word"

[first, ..., last] = text.split " "

#解构赋值用于构造函数初始化属性

class Person
    constructor : (options) ->
        {@name, @age, @height} = options
tim = new Person name:"tim"