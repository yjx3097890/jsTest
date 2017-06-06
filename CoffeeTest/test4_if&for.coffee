#if语句不需要大括号和小括号，多行也是使用缩进表示内容分隔
#if可以前缀也可以后缀，unless与if相反表示如果不
#if ... then ... else ...  会编译为  。。。？ 。。。： 。。。
#and ,not 和 or 表示 且 ,非和 或
#可以用in、of组成条件句，判断数组与对象中是否有相应值
#on、yes代表true，off、no代表false

mood = greatlyImproved unless singing and not q

if sing == 1
    mood = greatlyImproved
    mood =2
    
if sing is 1 then mood = greatlyImproved; mood=2

if hehe and xixi
    mood = 2
if hehe or xixi
    mood = 2
    
#循环语句也不需要大括号和小括号，for可以在前也可以在后
#可以用when为循环带上条件语句，is、isnt会编译为===、!== ， ==、!=也是

for food in ['toast', 'cheese', 'wine']
    eat food 
    
courses = ['greens', 'caviar', 'truffles', 'roast', 'cake']
menu i + 1, dish for dish, i in courses

for dish,i in courses when dish is caviar
    play dish
    
#把迭代赋值给一个变量，迭代则会收集每次迭代后函数返回的结果，装入数组后返回

cdown = (num "as";true for num in [10..1])

#可以使用by，指定间隔跳跃的迭代

event = (x for x in [2..8] by 2)

#使用of来迭代数组，键值是keys和values数组的值
#在双引号中可以包含#{}标签,会把里面包含的表达式的值插入到字符串中.同时支持多行文本

olds = lili: 10, mama: 99, nima: 100
args =  for child, age of olds
        "#{child} is #{age}"                           #同child + "is" + val
   
#用own过滤原型中的属性 

name for own name of olds 

#也支持while循环，也可以把while循环赋值给变量，相当于把循环的所有返回值装成数组赋值给变量
#until 是while的反义词

if this.studyingEconomics
  buy()  while supply > demand
  sell() until supply > demand
  
#再循环中可以使用，do 关键字，会立即调用do之后定义的函数，并且函数只初始化一次

for filename in list
 do (filename) ->
    fs.readFile filename, (err, contents) ->
      compile filename, contents.toString()
      
# 变量？ 表示判断该变量是否存在

solipsism = true if mind? and not world?

# ?= 表示已声明的变量是否为0 ，null，空字符串，是则赋值

speed = 0
speed ?= "aa"

# ？ 还可代替 ||，但更安全

footprints = yeti ? "bear"

# ?.可以取出非空变量的属性，当不确定变量是否为空时用它代替.
# ?() 可以代替()，确保函数变量非空

zip = lottery.drawWinner?().address?.zipcode

# 在coffee中使用switch，格式如下： switch condition,  when clauses, else the default case.
# clauses可以有多个值，用逗号分隔。每个情况后悔自动break;

switch day 
    when "Mon" 
        go work
    when "TUE" then go relex
    when "Fri","Sat" 
        if day is bingoDay
            go bingo
            go dancing
    else go work
        
# switch 中condition变量可以省略，

score = 76
grade = switch
    when score < 60 then 'F'
    when score < 70 then 'D'
    when score < 80 then 'C'
    when score < 90 then 'B'
    else 'A'