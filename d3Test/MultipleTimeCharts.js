
function MultipleTimeChart(option) {
  if (!option) {
    option = {};
  }
  this.margin = option.margin || {top: 10, right: 40, bottom: 150, left: 60};
  this.width = option.width || 960;
  this.height = option.height || 500;
  this.brushWidth = (this.width - this.margin.left - this.margin.right) / 2;  //时间框的宽度
  this.brushHeight = option.brushWidth || 50;
  this.color = d3.scale.category20();
  this.shape = {};
  this.data = null;
  this.svg = null;
}

var prototype = MultipleTimeChart.prototype = {
  constructor: MultipleTimeChart,

  init: function (id) {

    var that = this;

    this.svg =  d3.select('#'+id)
        .append('svg')
        .attr("width", this.width)
        .attr("height", this.height);

    this.xAxisTop = d3.svg.axis().orient('bottom');
    this.xAxisBottom = d3.svg.axis().orient('top');

    this.brush = d3.svg.brush();

    this.charts = [];
    this.shape.brush = this.svg.append('g')
    .classed('context', true)
    .attr('transform', 'translate(' + (this.width * .25) + ',' + (this.height - this.margin.bottom + 60) +' )');

    this.brushXScale = d3.time.scale().range([0, this.brushWidth]);
    this.brushXAxis = d3.svg.axis()
    .scale(this.brushXScale)
    .innerTickSize(this.brushHeight)
      .tickPadding(-10)
      .orient('bottom');
    return this;
  },

  extractData: function (data) {
    var that = this;
    this.data = {};
    this.data.contries = [];
    this.data.maxPoint = 0;
    var formatDate = d3.time.format('%Y');

    for (var prop in data[0]) {
      if (data[0].hasOwnProperty(prop) && prop !== 'Year') {
        this.data.contries.push(prop);
      }
    }
    this.data.data = data.map(function (d) { //g格式转换
      for (var key in that.data.contries) {
        var prop = that.data.contries[key];
    		if (d.hasOwnProperty(prop)) {
    			d[prop] = +d[prop];

    			if (d[prop] > that.data.maxPoint) {
            that.data.maxPoint = d[prop];
    			}
    		}
      }
      d.Year = formatDate.parse(d.Year);
      return d;
    });



    return this;
  },

  draw: function () {
    var that = this;

    this.data.contries.forEach( function (country, i, arr) {
      var chart = new AreaChart({
				id: i,
				name: country,
				width: that.width - that.margin.left - that.margin.right,
				height: (that.height - that.margin.top - that.margin.bottom) * (1 / arr.length),
				maxDataPoint: that.data.maxPoint,
				svg: that.svg,
				margin: that.margin
      });
      chart.init().extractData(that.data.data).draw();
      that.charts.push(chart);
    });

    this.brushXScale.domain(that.charts[0].xScale.domain());

    this.xAxisTop.scale(that.charts[0].xScale);
    this.xAxisBottom.scale(that.charts[0].xScale);

    this.svg.append('g')
    .classed('x axis top', true)
    .attr('transform', 'translate('+this.margin.left+','+this.margin.top+')')
    .call(this.xAxisTop);

    this.svg.append("g")
			.attr("class", "x axis bottom")
			.attr("transform", "translate("+this.margin.left +"," + (this.height - this.margin.bottom+ 40) + ")")
			.call(this.xAxisBottom);

    //brush 滑块
    this.brush
    .x(this.brushXScale)
    .on('brush', onBrush);

    this.shape.brush.append("g")
			.attr("class", " axis top")
			.call(this.brushXAxis)

      this.shape.brush.append("g")
  		.attr("class", "x brush")
  		.call(this.brush)
  		.selectAll("rect")
			.attr("y", 0)
			.attr("height", this.brushHeight);

      this.shape.brush.append("text")
				.attr("class","instructions")
				.attr("transform", "translate(0," + (this.brushHeight + 20) + ")")
				.text('Click and drag above to zoom / pan the data');

        function onBrush(){
             	/* this will return a date range to pass into the chart object */
             	var b = that.brush.empty() ? that.brushXScale.domain() : that.brush.extent();
             	that.charts.forEach(function (chart) {
                 chart.update(b);
               });
            //   that.brushXScale.domain(b);
               that.svg.select(".x.axis.top").call(that.xAxisTop);
               that.svg.select(".x.axis.bottom").call(that.xAxisBottom);
        }

    return this;
  },

  update: function () {


  }
}
