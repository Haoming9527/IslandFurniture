var express = require('express');
var app = express();
var promotion = require('../model/promotionModel.js');

app.get('/api/getPromotions', function (req, res) {
    promotion.getPromotions()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get promotions");
        });
});

module.exports = app;
