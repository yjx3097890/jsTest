
angular.module('appDirectives').directive('lineChart', ['d3Service',  '$window', function (d3, $window) {

  return {
    restrict: 'EA',
    scope: {
      data: '=',
      onClick: '&'
    },
    link: function (scope, element, attrs) {

      var margin = parseInt(attrs.margin) ||  {top: 20, right: 10, bottom: 20, left: 10};

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
                        .append('svg');
          var formatDate = d3.time.format("%m-%d");
          var  xScale = d3.time.scale();
            var line = d3.svg.line().x(function (d) {
                   return xScale(d[0]);
                 }).y(function (d) {
                   return yScale(d[1]);
                 });
        var  yScale = d3.scale.linear();



          scope.render = function (data) {
            //移除svg中所有元素
            svg.selectAll('*').remove();

            if (!data) {
              return;
            }

            var data = data[0].GTK1.map(function (d) {
              return [new Date(d.time), +d.count]
            } );
            // calculate the chart width
         var width = d3.select(element[0]).node().clientWidth -  margin.left - margin.right,
          // calculate the chart height
            height = d3.select(element[0]).node().clientHeight - margin.top - margin.bottom,
           // Use the category20() scale function for multicolor support
           color = d3.scale.category20(),
           m = {top: 20, right: 20, bottom: 20, left: 20};
           // our xScale
           var xAxis=d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 1);
           var yAxis=d3.svg.axis().scale(yScale).orient("left").tickSize(3, 1).ticks(5);

           // set the height based on the calculations above
           var content = svg.attr('height', height)
           .attr('width', width)
           .append('g')
           .attr("transform", "translate(" + m.left + "," + m.top + ")")



            xScale
           .domain(d3.extent(data, function(d) { return d[0]; }))
           .range([0, width - m.left - m.right])


           yScale.domain([0 , 100])
           .range([height- m.top - m.bottom, 0]);




           var lines = content.datum(data).append("g");

           content.append("g").classed( "x axis" , true)
           .attr("transform", "translate(0," + yScale.range()[0] + ")")
           .call(xAxis.tickFormat(formatDate));
           content.append("g").classed( "y axis" , true)
           .call(yAxis);




           // Update the line path.
              lines.append('path')
              .classed('line', true)
              .attr("d", line);
              lines.selectAll('.circle').data(data)
              .enter()
              .append('g')
              .classed('circle', true)
              .attr('transform', function(d) {
                return 'translate('+xScale(d[0])+','+yScale(d[1])+')';
              })
              .append('circle')
              .attr('r', 3);

              lines.selectAll('.circle')
              .append('text')
              .attr('class', 'circle-label')
              .attr('dy', -3)
              .text(function (d) {
                return  d[1].toFixed(1);
              })

          };


    }
  }
}]);
