
angular.module('appDirectives').directive('barChart', ['d3Service',  '$window', function (d3, $window) {

  return {
    restrict: 'EA',
    scope: {
      data: '=',
      onClick: '&'
    },
    link: function (scope, element, attrs) {

      var margin = parseInt(attrs.margin) || 20,
        barHeight = parseInt(attrs.barHeight) || 18,
        barPadding = parseInt(attrs.barPadding) || 1;

        //代码分为两部分:
        //静态部分，就是渲染时不会改变的，如d3元素的父元素，watcher函数，和helper函数。
        //动态部分，就是代码会在渲染时运行，如高，宽，data和scale。

        var svg = d3.select(element[0])
                  .append('svg')
                  .style('width', '100%');

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
          scope.$watch('data', function (newVals, oldVals) {
            return scope.render(newVals);
          }, true);

          scope.render = function (data) {
            //移除svg中所有元素
            svg.selectAll('*').remove();

            if (!data) {
              return;
            }

            data.sort(function (a ,b) {
              return b.count - a.count;
            });

            // calculate the chart width
         var width = d3.select(element[0]).node().clientWidth - margin,
          // calculate the chart height
            height = scope.data.length * (barHeight + barPadding),
           // Use the category20() scale function for multicolor support
           color = d3.scale.category20(),
           // our xScale
           xScale = d3.scale.linear()
           .domain([0, d3.max(data, function(d) {
             return d.count;
           })])
           .range([0, width]);

             // set the height based on the calculations above
             svg.attr('height', height);

             //create the rectangles for the bar chart
             svg.selectAll('g')
               .data(data).enter()
                 .append('g')
                 .classed('bar', true)
                 .attr('transform',function(d,i) {
                   return 'translate('+ Math.round(margin/2)+','+  i * (barHeight + barPadding) +')';
                 })
                 .append('rect')
                 .attr('height', barHeight)
                 .attr('width', 140)
                 .attr('fill', function(d, i) { return color(d.count); })
                 .on('click', function(d, i) {
                     return scope.onClick({item: d});  //传入一个对象，key就是标签上函数的参数名
                   })
                 .transition()
                   .duration(1000)
                   .attr('width', function(d) {
                     return xScale(d.count);
                });

                svg.selectAll('.bar')
                .append('text')
              .classed('label', true)
              .attr('x', 10)
              .attr('y', barHeight / 2)
              .attr('dy', 4)
              .text(function (d) {
                  return d.name + ' ('+ d.count.toFixed(2) +')';
              });
          };


    }
  };
}]);
