#用 `js代码` 就可以在coffeescript中直接加入js代码

hi = `function() {
  return [document.title, "Hello JavaScript"].join(": ");
}`

#try ... catch error ...finally...
try
  allHellBreaksLoose()
  catsAndDogsLivingTogether()
catch error
  print error
finally
  cleanUp()

#链式比较（chained comparisons ）

cholesterol = 127
healthy = 200 > cholesterol > 60

#可以使用三个双引号引用大量字符串，则字符串会保留原有样式且不需要转义
html = """
       <strong>
         cup of coffeescript
       </strong>
       """
       
#引用大块的正则表达式使用///,无需考虑空白还可以添加注解和换行

OPERATOR = /// ^ (
  ?: [-=]>             # function
   | [-+*/%<>&|^!?=]=  # compound assign / compare
   | >>>=?             # zero-fill right shift
   | ([-+:])\1         # doubles
   | ([&|<>])\2=?      # logic / shift
   | \?\.              # soak access
   | \.{2,3}           # range or splat
) ///
