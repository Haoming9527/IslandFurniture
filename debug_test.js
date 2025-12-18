var db = require('./model/databaseConfig.js');
var promotionModel = require('./model/promotionModel.js');

var conn = db.getConnection();

conn.connect(function (err) {
    if (err) {
        console.log("Error connecting to DB: " + err);
        process.exit(1);
    } else {
        console.log("Connected to DB");

        promotionModel.getMinorPromotions(25)
            .then(results => {
                console.log("Results for Country 25:");
                console.log(JSON.stringify(results, null, 2));

                var found = results.find(p => p.promoCode === 'EXPIRED_TEST');
                if (found) {
                    console.log("VERDICT: FAILED (Expired promo found)");
                } else {
                    console.log("VERDICT: SUCCESS (Expired promo NOT found)");
                }
                conn.end();
            })
            .catch(err => {
                console.log("Error: " + err);
                conn.end();
            });
    }
});
