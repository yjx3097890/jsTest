var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var objId= Schema.ObjectId;

var WidgetSchema = new Schema({
	sn: {type: String, require: true, trim: true, unique: true},
	name: {type: String, require: true, trim: true},
	description: String,
	price: Number
});

module.exports = mongoose.model('Widget', WidgetSchema);