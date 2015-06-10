
function MultipleTimeChart(option) {
  if (!option) {
    option = {};
  }
  this.margin = option.margin || {top: 10, right: 40, bottom: 150, left: 60};
  this.width = option.width || 960;
  this.height = option.height || 500;
  this.contextWidth = (this.width - this.margin.left - this.margin.right) / 2;  //时间框的宽度
  this.contextHeight = option.contextWidth || 50;
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
      for (var prop in that.data.contries) {
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

    this.force
   .nodes(this.nodes)
   .links(this.data.links)
   .start();

   var link = this.shape.link = this.svg.selectAll(".link")
       .data(this.data.bilinks)
       .enter().append("path")
       .attr("class", "link");

   var node = this.shape.node = this.svg.selectAll(".node")
       .data(this.data.nodes)
     .enter().append("circle")
       .attr("class", "node")
       .attr("r", this.radius)
       .style("fill", function(d) { return that.color(d.group); })
       .call(this.force.drag);

   node.append("title")
       .text(function(d) { return d.name; });

   this.force.on("tick", function() {
     that.shape.link.attr("d", function(d) {
       return "M" + d[0].x + "," + d[0].y
           + "S" + d[1].x + "," + d[1].y
           + " " + d[2].x + "," + d[2].y;
     });
     that.shape.node.attr("transform", function(d) {
       return "translate(" + d.x + "," + d.y + ")";
     });
   });

    return this;
  },

  update: function () {


  }
}
