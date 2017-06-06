angular.module('appDirectives').directive('map', ['d3Service',  '$window', function (d3, $window) {

  return {
    restrict: 'EA',
    scope: {
      area: '=',    //地区
      onClick: '&'
    },
    link: function (scope, element, attrs) {

      //代码分为两部分:
      //静态部分，就是渲染时不会改变的，如d3元素的父元素，watcher函数，和helper函数。
      //动态部分，就是代码会在渲染时运行，如高，宽，data和scale。

      var margin = parseInt(attrs.margin) || {left:0, top: 0, bottom: 0, right: 0};
      var svg = d3.select(element[0])
                  .append('svg');

      var CITY={"65":"新疆","54":"西藏","15":"内蒙古","63":"青海","51":"四川","23":"黑龙江","62":"甘肃","53":"云南","45":"广西","43":"湖南",
          "61":"陕西","44":"广东","22":"吉林","13":"河北","42":"湖北","52":"贵州","37":"山东","36":"江西","41":"河南","21":"辽宁",
          "14":"山西","34":"安徽","35":"福建","33":"浙江","32":"江苏","50":"重庆","64":"宁夏","46":"海南","71":"台湾","11":"北京",
          "12":"天津","31":"上海","81":"香港","82":"澳门"};

        //监听resize事件，进入$digest循环
        $window.addEventListener('resize', function () {
          scope.$apply();


        }, false);

          //监视resize事件
          scope.$watch(function () {
              return angular.element($window)[0].innerWidth;
          }, function () {
              scope.render(scope.data);
          });

          // watch for data changes and re-render, watchCollection不行
          // scope.$watch('data', function (newVals, oldVals) {
          //   return scope.render(newVals);
          // }, true);

          scope.render = function () {
              //移除svg中所有元素
              svg.selectAll('*').remove();

              // calculate the chart width
              var width = d3.select(element[0]).node().clientWidth - margin.right - margin.left,
             // calculate the chart height
              height = d3.select(element[0]).node().clientHeight - margin.top - margin.bottom,
             // Use the category20() scale function for multicolor support
              color = d3.scale.category20();

               // set the height based on the calculations above
               svg.attr('height', height).attr('width', width);

               var projection;


               if (scope.area) {
                 d3.json('../data/chinapart.json', function (e, china) {
             		  if (e) return console.log(e);

                   var data = china.features.filter(function (d) {
                       return CITY[d.id.slice(0,2)] === scope.area;
                    });

                     projection= d3.geo.mercator().center([112,37.6]).scale(width * 3).translate([width/2,height/2]);

                      draw(data, projection);

                  });
               } else {
                 d3.json('../data/china.json', function (e, china) {
                      if (e) return console.log(e);

                     projection= d3.geo.mercator().center([105,37]).scale(width * 1.15).translate([width/2,height/2]);

                      draw(china.features, projection);
                 });

               }

                function draw(data, projection) {
                  var path = d3.geo.path().projection(projection);

                  svg.selectAll('.sub')
                  .data(data)
                  .enter()
                  .append('path')
                  .classed('map', true)
                  .attr('d', path);


                  var labels = svg.selectAll(".label")
                  .data(data)
                  .enter()
                  .append('g')
                  .attr("class", "label" )
                  .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; });//计算图心

                  labels.append("text")
                  .attr("dy", ".35em")
                  .text(function(d) { return d.properties.name; });

                  labels.append('circle')
                  .attr({cx: -5,
                    cy:0,
                    r: 1});
                }

          };  //end render

    }  //end link
  }; //end return
}]);
