const express = require('express');
const mongoose = require('mongoose');

mongoose
.connect('mongodb://localhost/authN')
.then(connects => {
    console.log('You got connected');
})
.catch(err => {
    console.log('Can\'t connect');
})