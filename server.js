const express = require('express');
const mongoose = require('mongoose');

mongoose
.connect('mongodb://localhost/authpassdb')
.then(conn => {
    console.log('\n=== connected to mongo ===\n')
})
.catch(err => {
    console.log('error connecting to mongo', err)
})