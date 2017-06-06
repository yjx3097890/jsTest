
angular.module('appDirectives').directive('pieChart', ['d3Service',  '$window', function (d3, $window) {








  return {
    restrict: 'EA',
    scope: {
      data: '=',
      onClick: '&'
    },
    transclude: false,
    link: function (scope, element, attrs) {

      var margin = parseInt(attrs.margin) || {top: 20, right: 20, bottom: 20, left: 20};
var radius = parseInt(attrs.radius) || (Math.min(element[0].clientHeight, element[0].clientHeight) / 2.5 );
        //代码分为两部分:
        //静态部分，就是渲染时不会改变的，如d3元素的父元素，watcher函数，和helper函数。
        //动态部分，就是代码会在渲染时运行，如高，宽，data和scale。

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

          var svg = d3.select(element[0])
                    .append('svg')
                    .style('width', '100%')
                    .style('height', d3.select(element[0]).node().clientHeight - 25);
          var pie = d3.layout.pie().value(function (d) {
              return d.total;
            });
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(0);

          scope.render = function (data) {
            //移除svg中所有元素
            svg.selectAll('*').remove();

            if (!data) {
              return;
            }

            // calculate the chart width
         var width = d3.select(element[0]).node().clientWidth,
          // calculate the chart height
            height = d3.select(element[0]).node().clientHeight,
           // Use the category20() scale function for multicolor support
           color = d3.scale.category20();
           // our xScale

           var g = svg.append("g")
                .attr("transform", "translate(" + (width / 2)+ "," + height / 2.5 + ")");

           var arcs = g.selectAll(".arc")
                .data(pie(data))
              .enter().append("g")
                .attr("class", "arc");

            arcs.append("path")
                .style("fill", function(d,i) { return color(i); })
                .transition()
                .duration(500)
                .attrTween("d", function(d, i ) {
                    var start = 0;
                    if (d.startAngle !==0 ) {
                        start = Math.PI * 2;
                    }
                    var int = d3.interpolate({startAngle: start, endAngle: start,padAngle: 0},{startAngle: d.startAngle, endAngle: d.endAngle,padAngle: d.padAngle});
                    return function (t) {
                        var b= int(t);
                        return arc(b);
                    };
                })

                ;

            var labels = arcs.append("g")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; });

              labels.append('text').attr("dy", ".35em")
                .style("text-anchor", "middle")
                .style('color', ' #ffffff')
                  .attr('dy', 7)
                .text(function(d) {
                  return d.data.total;
                });
              labels.append('text')
              .style("text-anchor", "middle")
              .style('color', ' #ffffff')
              .attr('dy', -7)
              .text(function (d) {
                return d.data.name;
                });


          //var labels = svg.append('g')
          //.attr("transform", "translate(" + (width -40)+ "," + height / 3 + ")")
          //.classed('svg-label', true)
          //.selectAll('rect')
          //.data(data)
          //.enter().append('g')
          //.attr('transform', function (d, i) {  return 'translate(0 ,'+ 20 * i +')' ; });
          //
          //labels.append('rect')
          //.attr({
          //  height: 10,
          //  width: 20,
          //  fill: function (d, i) {  return color(i); }
          //});
          //labels.append('text')
          //.attr('dy', 10)
          //.text(function (d) {
          //  return d.name+':';
          //});


          };  //end render


    }
  }
}]);
