
function PieChart(option) {
  if (!option) {
    option = {};
  }
  this.margin = option.margin || {top: 20, right: 20, bottom: 20, left: 20};
  this.width = option.width || 480;
  this.height = option.height || 320;
  this.radius = option.radius || 100;
  this.inR = option.inRadius || 45;
  this.tweenTime = 250;
  this.textOffset = 14;
  this.color = d3.scale.category20();
  this.data = null;
  this.svg = null;
}

var prototype = TimeSeriesChart.prototype = {
  constructor: PieChart,

  init: function (id) {

    var that = this;

    this.pie = d3.layout.pie().value(function (d) {
      return d.octetTotalCount;
    });

    this.svg =  d3.select('#'+id).append('svg')
        .attr("width", this.width)
        .attr("height", this.height);

    return this;
  },

  extractData: function () {


    var formatDate = d3.time.format("%b %Y");

    this.data = d3.range(Math.ceil(Math.random()*10)).map(function () {
      return {
        port: "port",
        octetTotalCount: Math.ceil(Math.random()*(arrayRange))
      };
    });

    return this;
  },

  draw: function () {


    this.svg.datum(this.data);

    var arcs = this.svg.append('g').classed('arc', true)
    .attr('transform', 'translate('+this.width/2 +','+this.height/2+')');

    var labels = this.svg.append('g').classed('')

    var g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");;
    g.append("path").classed( "area", true);
    g.append("path").classed("line", true);
    g.append("g").classed( "x axis" , true);

    // Update the area path.
    g.select(".area")
        .attr("d", this.shape.area.y0(this.yScale.range()[0]));

    // Update the line path.
    g.select(".line")
        .attr("d", this.shape.line);

    // Update the x-axis.
    g.select(".x.axis")
        .attr("transform", "translate(0," + this.yScale.range()[0] + ")")
        .call(this.xAxis);

    return this;
  },

  update: function () {

    return this;
  }
}
