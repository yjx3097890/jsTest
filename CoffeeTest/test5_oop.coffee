#ʹ��class�����ࣺclass ���� extends ���� �� ������ĸ�ʽ�붨���������
#construction ������Ĺ��캯�����ڴ�����ֱ��ʹ�á�@��������this��ֵ�ļ�д,��ʱ����ʡ�Ժ����壬������ʡ��->
#����Ķ����� @���� ��ʾ���ຯ�������徲̬���ԣ�����@������ԭ�ͼ�Ϊʵ����������
#super��ʾ���࣬�ں�����ʹ��super��Ĭ�ϵ��ø�����ͬ������

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
    
#ʹ�� :: ���Կ������ö���ԭ��
       
String::dasherize = ->
    @replace /_/g, "-"
       
#ʹ�� => ���Զ��庯�����Ѻ����е�this��Ϊ��ǰ��������
#���ں���������ʹ�� => ������this�Զ���Ϊʵ�����Ķ���

Account = (@customer, @cart) -> 
    $(".shopping").bind "click", (event) => @customer.purcher @cart