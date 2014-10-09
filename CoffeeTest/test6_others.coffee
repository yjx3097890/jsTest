#�� `js����` �Ϳ�����coffeescript��ֱ�Ӽ���js����

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

#��ʽ�Ƚϣ�chained comparisons ��

cholesterol = 127
healthy = 200 > cholesterol > 60

#����ʹ������˫�������ô����ַ��������ַ����ᱣ��ԭ����ʽ�Ҳ���Ҫת��
html = """
       <strong>
         cup of coffeescript
       </strong>
       """
       
#���ô���������ʽʹ��///,���迼�ǿհ׻��������ע��ͻ���

OPERATOR = /// ^ (
  ?: [-=]>             # function
   | [-+*/%<>&|^!?=]=  # compound assign / compare
   | >>>=?             # zero-fill right shift
   | ([-+:])\1         # doubles
   | ([&|<>])\2=?      # logic / shift
   | \?\.              # soak access
   | \.{2,3}           # range or splat
) ///
