var db = require('./model/databaseConfig.js');
var promotionModel = require('./model/promotionModel.js');

var conn = db.getConnection();

conn.connect(function (err) {
    if (err) {
        console.log("Error connecting to DB: " + err);
        process.exit(1);
    } else {
        console.log("Connected to DB");

        // User's specific expired promotion
        // ID=3, Country=25
        var sql = "INSERT INTO promotioncodeentity (ID, PROMOCODE, DESCRIPTION, DISCOUNTRATE, STARTDATE, ENDDATE, COUNTRY_ID, ITEM_ID) VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), ?, NULL) ON DUPLICATE KEY UPDATE PROMOCODE=VALUES(PROMOCODE), ENDDATE=VALUES(ENDDATE)";

        // Using ON DUPLICATE KEY UPDATE to handle if ID 3 exists, or if we run this multiple times

        conn.query(sql, [3, 'EXPIRED_TEST', 'This offer has expired', 50, 25], function (err, result) {
            if (err) {
                console.log("Error inserting test data: " + err);
                conn.end();
            } else {
                console.log("Inserted/Updated expired promotion 'EXPIRED_TEST' for Country ID 25.");

                // Now try to fetch it using the model
                console.log("Testing getMinorPromotions(25)...");
                promotionModel.getMinorPromotions(25)
                    .then(results => {
                        console.log(`Fetched ${results.length} promotions for Country 25.`);

                        var found = results.find(p => p.promoCode === 'EXPIRED_TEST');
                        if (found) {
                            console.log("FAILED: Expired promotion WAS returned!");
                        } else {
                            console.log("SUCCESS: Expired promotion was NOT returned.");
                        }
                        conn.end();
                    })
                    .catch(err => {
                        console.log("Error fetching promotions: " + err);
                        conn.end();
                    });
            }
        });
    }
});
