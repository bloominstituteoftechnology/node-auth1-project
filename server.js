const express = require('express');
const mongoose = require('mongoose');
const User = require('./UserModel.js')

mongoose.connect('mongodb://localhost/')