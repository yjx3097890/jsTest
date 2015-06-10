
function MultipleTimeChart(option) {
  if (!option) {
    option = {};
  }
  this.margin = option.margin || {top: 20, right: 20, bottom: 20, left: 20};
  this.width = option.width || 960;
  this.height = option.height || 500;
  this.radius = option.radius || 5;
  this.color = d3.scale.category20();
  this.shape = {};
  this.data = {};
  this.svg = null;
}

var prototype = MultipleTimeChart.prototype = {
  constructor: MultipleTimeChart,

  init: function (id) {

    var that = this;

    this.force = d3.layout.force()
      .linkDistance(10)
      .linkStrength(2)
      .size([this.width, this.height]);


    this.svg =  d3.select('#'+id).append('svg')
        .attr("width", this.width)
        .attr("height", this.height);

    return this;
  },

  extractData: function (data) {
    var that = this;
    this.data = {};
    this.data.nodes = data.nodes;
    this.data.links = [];
    this.data.bilinks = [];

    var  nodes = this.nodes = data.nodes.slice(); //克隆了一份

    data.links.forEach(function(link) {
       var s = nodes[link.source],
           t = nodes[link.target],
           i = {}; // 过渡节点
       nodes.push(i);
       that.data.links.push({source: s, target: i}, {source: i, target: t});
       that.data.bilinks.push([s, i, t]);
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
