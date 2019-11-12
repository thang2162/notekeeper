var mongoose = require('mongoose/');

mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb+srv://', { useNewUrlParser: true });


var Schema = mongoose.Schema;

// Schemas
const user_schema = require('./schemas/UserSchema');
const note_schema = require('./schemas/NoteSchema');

var UserSchema = new Schema(user_schema);
var NoteSchema = new Schema(note_schema);

mongoose.model('User', UserSchema);
mongoose.model('Note', NoteSchema);

module.exports = mongoose;
