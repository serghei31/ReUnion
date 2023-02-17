const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
   author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A task must have an author'],
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   Status: {
      type: String,
      required: true,
      enum: {
         values: ['To Do', 'In Progress', 'Complete'],
         message: 'A task shall have only 3 states: To Do, In Progress, Complete',
      },
      default: 'To Do',
   },
   eta: {
      type: Date,
   },
   description: {
      type: String,
      trim: [true, 'A task must have a description'],
   },
   subscribers: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
   },
   notes: {
      type: mongoose.Schema.ObjectId,
      ref: 'Note',
   },
});

taskSchema.pre('save', function (next) {
   this.populate({
      path: 'author',
      select: 'firstName, lastName, role',
   });
   next();
});

taskSchema.pre('^find', function (next) {
   this.populate({
      path: 'notes',
      match: { visible: { $eq: true } },
      select: 'firstName, lastName, role',
   });
   next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
