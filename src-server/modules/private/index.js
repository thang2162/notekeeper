//Notekeeper Private Controller!

const exp = require('express');
const rtr = exp.Router();

const { checkSchema } = require('express-validator');

const getNotes_module = require('./getNotes');
const newNote_module = require('./newNote');
const deleteNote_module = require('./deleteNote');
const changePassword_module = require('./changePassword');
const deleteUser_module = require('./deleteUser');
const editNote_module = require('./editNote');

//Load my notebook page
rtr.get('/getNotes', checkSchema(require('../reqModels/empty')), (req, res) => { getNotes_module.getNotes(req, res) });

//Create new note
rtr.post('/newNote', checkSchema(require('../reqModels/newNote')), (req, res) => { newNote_module.newNote(req, res) });

//Delete Note
rtr.delete('/deleteNote/:note_id', checkSchema(require('../reqModels/deleteNote')), (req, res) => { deleteNote_module.deleteNote(req, res) });

//Change Password
rtr.post('/changePassword', checkSchema(require('../reqModels/changePw')), (req, res) => { changePassword_module.changePassword(req, res) });

//Delete Account
rtr.delete('/deleteUser', checkSchema(require('../reqModels/empty')), (req, res) => { deleteUser_module.deleteUser(req, res,) });

//Edit Note
rtr.post('/editNote', checkSchema(require('../reqModels/editNote')), (req, res) => { editNote_module.editNote(req, res) });

module.exports = rtr;
