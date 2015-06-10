
function PieChart(option) {
  if (!option) {
    option = {};
  }
  this.margin = option.margin || {top: 20, right: 20, bottom: 20, left: 20};
  this.width = option.width || 480;
  this.height = option.height || 320;
  this.radius = option.radius || 100;
  this.inR = option.inRadius || 45;
  this.duration = 250;
  this.textOffset = 14;
  this.color = d3.scale.category20();
  this.data = null;
  this.svg = null;
}

var prototype = PieChart.prototype = {
  constructor: PieChart,

  init: function (id) {

    var that = this;

    this.pie = d3.layout.pie().value(function (d) {
      return d.octetTotalCount;
    });

    this.arc = d3.svg.arc()
    .startAngle(function (d) { return d.startAngle; })
    .endAngle( function (d) { return d.endAngle; })
    .innerRadius(this.inR).outerRadius(this.radius);

    this.svg =  d3.select('#'+id).append('svg')
        .attr("width", this.width)
        .attr("height", this.height);

    return this;
  },

  extractData: function () {
    var that = this;
     var arrayRange = 100000; //range of potential values for each item

    var mockData = d3.range(Math.ceil(Math.random()*10)).map(function () {
      return {
        port: "port",
        octetTotalCount: Math.ceil(Math.random()*(arrayRange))
      };
    });

    this.oldData = this.data;
    this.total = 0;
    this.data = this.pie(mockData) //格式化数据  
    .filter(function filterData(element, index, array) {
      element.name = mockData[index].port;
      element.value = mockData[index].octetTotalCount;
      that.total += element.value;
      return (element.value > 0);
    });

    return this;
  },

  draw: function () {
    var that = this;
    var arcs = this.arcs = this.svg.append('g').classed('arc', true)
    .attr('transform', 'translate('+this.width/2 +','+this.height/2+')');

    var labels = this.labels = this.svg.append('g').classed('label_group', true)
    .attr('transform', 'translate('+this.width/2 +','+this.height/2+')');

    //中间部分
    var center = this.svg.append("g")
    .attr("class", "center_group")
    .attr('transform', 'translate('+this.width/2 +','+this.height/2+')');

    center.append('circle')
    .style('fill', 'white')
    .attr('r', this.inR);

    center.append('text')
      .attr("class", "label")
      .attr("dy", -15)
      .attr("text-anchor", "middle") // text-align: right
      .text("TOTAL");

      center.append("text")
        .attr("class", "total")
        .attr("dy", 7)
        .attr("text-anchor", "middle") // text-align: right
        .text("Waiting...");

        //单位
        center.append("text")
          .attr("class", "units")
          .attr("dy", 21)
          .attr("text-anchor", "middle") // text-align: right
          .text("kb");

      //占位用
    var circle = arcs.append('circle')
    .style('fill', "#EFEFEF")
    .attr('r', this.radius);

    setInterval(function () {
       return that.update();
      }, 1500);

    return this;
  },

  update: function () {
    var that = this;
    this.extractData();

    if ( this.data.length>0 && this.oldData.length > 0) {
      //移去站位的圆
      this.arcs.selectAll("circle").remove();

      d3.select('.center_group .total').text(function(){
        var kb = that.total/1024;
        return kb.toFixed(1);
        //return bchart.label.abbreviated(totalOctets*8);
      });

      //画pie的瓣
      var paths = that.arcs.selectAll("path").data(this.data);
      paths.enter().append("path")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .style("fill", function(d, i) { return that.color(i); })
        .transition()
          .duration(that.duration)
          .attrTween("d", pieTween);
      paths
        .transition()
          .duration(that.duration)
          .attrTween("d", pieTween);
      paths.exit()
        .transition()
          .duration(that.duration)
          .attrTween("d", removePieTween)
        .remove();

      //画标签的辅助线
      var lines = that.labels.selectAll("line").data(this.data);
      lines.enter().append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", -that.radius-3)
        .attr("y2", -that.radius-8)
        .attr("stroke", "gray")
        .attr("transform", function(d) {
          return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
        });
      lines.transition()
        .duration(that.duration)
        .attr("transform", function(d) {
          return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
        });
      lines.exit().remove();

      //画百分比标签
      var valueLabels = this.labels.selectAll("text.value").data(this.data)
        .attr("dy", function(d){
          if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
            return 5;
          } else {
            return -7;
          }
        })
        .attr("text-anchor", function(d){
          if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
            return "start";
          } else {
            return "end";
          }
        })
        .text(function(d){
          var percentage = (d.value/that.total)*100;
          return percentage.toFixed(1) + "%";
        });

      valueLabels.enter().append("text")
        .attr("class", "value")
        .attr("transform", function(d) {
          return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (that.radius + that.textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (that.radius + that.textOffset) + ")";
        })
        .attr("dy", function(d){
          if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
            return 5;
          } else {
            return -7;
          }
        })
        .attr("text-anchor", function(d){
          if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
            return "start";
          } else {
            return "end";
          }
        }).text(function(d){
          var percentage = (d.value/that.total)*100;
          return percentage.toFixed(1) + "%";
        });

      valueLabels.transition().duration(that.duration).attrTween("transform", textTween);

      valueLabels.exit().remove();


      //画标签的名称
      var nameLabels = this.labels.selectAll("text.units").data(that.data)
        .attr("dy", function(d){
          if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
            return 17;
          } else {
            return 5;
          }
        })
        .attr("text-anchor", function(d){
          if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
            return "start";
          } else {
            return "end";
          }
        }).text(function(d){
          return d.name;
        });

      nameLabels.enter().append("text")
        .attr("class", "units")
        .attr("transform", function(d) {
          return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (that.radius + that.textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (that.radius + that.textOffset) + ")";
        })
        .attr("dy", function(d){
          if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
            return 17;
          } else {
            return 5;
          }
        })
        .attr("text-anchor", function(d){
          if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
            return "start";
          } else {
            return "end";
          }
        }).text(function(d){
          return d.name;
        });

      nameLabels.transition().duration(that.duration).attrTween("transform", textTween);

      nameLabels.exit().remove();



    }


    // Interpolate the arcs in data space.
function pieTween(d, i) {
    var s0;
    var e0;
    if(that.oldData[i]){
      s0 = that.oldData[i].startAngle;
      e0 = that.oldData[i].endAngle;
    } else if (!(that.oldData[i]) && that.oldData[i-1]) {
      s0 = that.oldData[i-1].endAngle;
      e0 = that.oldData[i-1].endAngle;
    } else if(!(that.oldData[i-1]) && that.oldData.length > 0){
      s0 = that.oldData[that.oldData.length-1].endAngle;
      e0 = that.oldData[that.oldData.length-1].endAngle;
    } else {
      s0 = 0;
      e0 = 0;
    }
    var i = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});
    return function(t) {
      var b = i(t);
      return that.arc(b);
    };
  }

  function removePieTween(d, i) {
    s0 = 2 * Math.PI;
    e0 = 2 * Math.PI;
    var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
    return function(t) {
      var b = i(t);
      return that.arc(b);
    };
  }

  function textTween(d, i) {
    var a;
    var oldPieData = that.oldData;
    if(oldPieData[i]){
      a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI)/2;
    } else if (!(oldPieData[i]) && oldPieData[i-1]) {
      a = (oldPieData[i-1].startAngle + oldPieData[i-1].endAngle - Math.PI)/2;
    } else if(!(oldPieData[i-1]) && oldPieData.length > 0) {
      a = (oldPieData[oldPieData.length-1].startAngle + oldPieData[oldPieData.length-1].endAngle - Math.PI)/2;
    } else {
      a = 0;
    }
    var b = (d.startAngle + d.endAngle - Math.PI)/2;

    var fn = d3.interpolateNumber(a, b);
    return function(t) {
      var val = fn(t);
      return "translate(" + Math.cos(val) * (that.radius + that.textOffset) + "," + Math.sin(val) * (that.radius + that.textOffset) + ")";
    };
  }

  }
}
