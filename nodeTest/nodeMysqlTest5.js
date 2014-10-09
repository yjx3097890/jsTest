var Sequelize = require('sequelize');

var sequelize = new Sequelize('nodetest', 'root', null,{logging: false});

var nodes = sequelize.define('nodes',         //没有生成nodess
	{id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	title: {type: Sequelize.STRING, allowNull: false, unique: false},
	text: Sequelize.TEXT,
	able: Sequelize.BOOLEAN
	});
nodes.sync().error(logError);

var chainer = new Sequelize.Utils.QueryChainer;

chainer.add(nodes.create({title: 'a first object', text:'first', able: true})).
add(nodes.create({title: 'a second object', text:'second', able: true}));

chainer.run().error(logError).success(function (result) {
	console.log(result);
});

function logError(err) {
	console.log(err);
}