
function AreaChart(option) {
  if (!option) {
    option = {};
  }
  this.margin = option.margin || {top: 20, right: 20, bottom: 20, left: 20};
  this.width = option.width || 960;   //这个width和height已减去外边距
  this.height = option.height || 120;
  this.xScale = option.xScale || d3.time.scale();   //x轴的比例
  this.yScale = option.yScale || d3.scale.linear();
  this.name = option.name || 'USA';
  this.maxValue = option.maxDataPoint || 0;
  this.id = option.id;
  this.shape = {};
  this.data = null;
  this.svg = option.svg;
}

var prototype = AreaChart.prototype = {
  constructor: AreaChart,

  init: function (id) {

    var that = this;

    this.shape.line = d3.svg.line().x(function (d) {
      return that.xScale(d[0]);
    }).y(function (d) {
      return that.yScale(d[1]);
    });   //由line计算d的值
    this.shape.area = d3.svg.area().x(function (d) {
      return that.xScale(d[0]);
    }).y1(function (d) {
      return that.yScale(d[1]);
    }).y0(that.height);

    this.xAxis=d3.svg.axis().scale(this.xScale).orient("bottom").tickSize(6, 1);
    this.yAxis=d3.svg.axis().scale(this.yScale).orient('left').ticks(5);

    //定义裁剪区
    this.svg.append('defs').append('clipPath')
    .attr('id', 'clip_'+that.id)
    .append('rect')
    .attr('width', this.width)
    .attr('height', this.height)

    return this;
  },

  extractData: function (data) {  //穿入格式化好的data
    var that = this;

    this.data = data.map(function(d, i) {
      return [d.Year, d[that.name]];  //year , value
    });

    return this;
  },

  draw: function () {
    this.xScale
    .domain(d3.extent(this.data, function(d) { return d[0]; }))
    .range([0, this.width]);

    this.yScale
        .domain([0, this.maxValue])
        .range([this.height, 0]);

    this.svg.datum(this.data);

    var g = this.svg.append("g")
    .classed(this.name.toLowerCase(), true)
    .attr("transform", "translate(" + this.margin.left + "," + (this.margin.top + (this.height * this.id) + (10 * this.id)) + ")");;

    g.append("path")
    .classed( "chart", true)
    .attr('clip-path', 'url(#clip_'+this.id+')')
    .attr('d',  this.shape.area);


    g.append("g").classed( "y axis" , true)
    .attr('transform', 'translate(-15, 0)')
    .call(this.yAxis);

    g.append("text")
			.attr("class","country-title")
			.attr("transform", "translate(15,40)")
			.attr("style","font-size: 18px; font-weight: bold;")
			.text(this.name);



    return this;
  },

  update: function (b) {
		this.xScale.domain(b);
  	this.svg.select('.' + this.name.toLowerCase() + " path").data([this.data]).attr("d", this.shape.area);
    return this;
  }
}
