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

app.get('/api/promotion/:code', function (req, res) {
    var code = req.params.code;
    var countryId = req.query.countryId;

    if (!countryId) {
        res.status(400).send({ success: false, message: 'Country ID is required' });
        return;
    }

    promotion.getPromotionByCode(code, countryId)
        .then((result) => {
            if (result) {
                // Check date validity
                var now = new Date();
                var start = new Date(result.startDate);
                var end = new Date(result.endDate);

                if (now >= start && now <= end) {
                    res.send({ success: true, promotion: result });
                } else {
                    res.send({ success: false, message: 'Promotion is expired or not yet active' });
                }
            } else {
                res.send({ success: false, message: 'Invalid promotion code' });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ success: false, message: 'Internal server error' });
        });
});

app.get('/api/getMinorPromotions', function (req, res) {
    var countryId = req.query.countryId;
    if (!countryId) {
        res.status(400).send("Country ID is required");
        return;
    }
    promotion.getMinorPromotions(countryId)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get minor promotions");
        });
});

module.exports = app;
