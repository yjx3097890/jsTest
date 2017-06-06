#函数由小括号，"->" , 函数体组成
#函数调用时参数可以用空格分隔，但会一直到行末
###
    最后一句默认自动return， 可加true 或null
###

fill = (contain, div = "coffee")   -> 
    div +="asa"
    contain.push(div)
    true
fill = (contain, div = "coffee")   -> div +="asa";contain.push(div)


#省略号...用于函数的定义与调用，定义时表示多个不定参数，调用时会通过apply传递一个数组

medias = ( first, second, others...) -> 
    g = first
    s = second 
    rest = others
    true;
    
contenders = [
  "Michael Phelps"
  "Liu Xiang"
  "Yao Ming"
  "Allyson Felix"
  "Shawn Johnson"
  "Roman Sebrle"
  "Guo Jingjing"
  "Tyson Gay"
  "Asafa Powell"
  "Usain Bolt"
]

medias "ass", "zz", contenders...

#可以直接使用try...catch语句

alert(
    try
        non / undefined
    catch error
        "有错误#{error}"
)

# **表示指数运算 ，//表示整除运算， %% 表示求膜

2**5

