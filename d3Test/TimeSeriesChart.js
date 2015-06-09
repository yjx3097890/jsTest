
function TimeSeriesChart(option) {
  if (!option) {
    option = {};
  }
  this.margin = option.margin || {top: 20, right: 20, bottom: 20, left: 20};
  this.width = option.width || 960;
  this.height = option.height || 120;
  this.xScale = option.xScale || d3.time.scale();
  this.yScale = option.yScale || d3.scale.linear();
  this.shape = {};
  this.data = null;
  this.svg = null;
}

var prototype = TimeSeriesChart.prototype = {
  constructor: timeSeriesChart,

  init: function (id) {

    var that = this;

    this.shape.line = d3.svg.line().x(function (d) {
      return that.xScale(d[0]);
    }).y(function (d) {
      return that.yScale(d[1]);
    });
    this.shape.area = d3.svg.area().x(function (d) {
      return that.xScale(d[0]);
    }).y1(function (d) {
      return that.yScale(d[1]);
    });

    this.xAxis=d3.svg.axis().scale(this.xScale).orient("bottom").tickSize(6, 1);
    this.yAxis=d3.svg.axis();

    this.svg =  d3.select('#'+id).append('svg')
        .attr("width", this.width)
        .attr("height", this.height);

    return this;
  },

  extractData: function (data) {
    var formatDate = d3.time.format("%b %Y");
    var xValue = function(d) { return formatDate.parse(d.date); };
    var yValue = function(d) { return +d.price; };

    this.data = data.map(function(d, i) {
      return [xValue( d, i), yValue(d, i)];
    });

    return this;
  },

  draw: function () {
    this.xScale
    .domain(d3.extent(this.data, function(d) { return d[0]; }))
    .range([0, this.width - this.margin.left - this.margin.right]);

    this.yScale
        .domain([0, d3.max(this.data, function(d) { return d[1]; })])
        .range([this.height - this.margin.top - this.margin.bottom, 0]);

    this.svg.datum(this.data);

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
