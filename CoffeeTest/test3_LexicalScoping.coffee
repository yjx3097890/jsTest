#所有语句都会自动包裹在一个自调用函数中，若要在全局变量上赋值需要用this，或直接用window、exports等
#函数外部声明后，函数内部不会在声明同一变量
this.outer = 1

outer = 3;
change = (div)-> 
    inner = -1
    outer = 6
inner = change()

#对于某些符号如+= ， 就不会自动声明变量了
div += "a";