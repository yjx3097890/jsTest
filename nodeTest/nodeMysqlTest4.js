var Sequelize = require('sequelize');

var sequelize = new Sequelize('nodetest', 'root', null,{logging: false});

var nodes = sequelize.define('node', 
	{id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	title: {type: Sequelize.STRING, allowNull: false, unique: false},
	text: Sequelize.TEXT,
	able: Sequelize.BOOLEAN
	});
nodes.sync().error(logError);

var test = nodes.build({text: 'new Object', title: 'new OBJ', able: true});

test.save().success(function (t) {
	console.log(t.dataValues);
	nodes.find({where: {title: 'new OBJ'}}).success(function (test) {
		console.log(arguments);
		test.title = 'new obj title';
		test.save().error(logError).success(function (t) {
			nodes.find({where: {title: 'new obj title'}}).success(function (test) {
				test.updateAttributes({title: 'An second update title'}).success(function () {
				});
				test.save().success(function() {
					nodes.findAll().success(function (tests) {
						console.log(tests);
						console.log(tests[0].title);
						
					});
				});
			});
		});
	});
});


function logError(err) {
	console.log(err);
}