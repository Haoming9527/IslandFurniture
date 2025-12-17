var db = require('./model/databaseConfig.js');
var conn = db.getConnection();

conn.connect(function (err) {
    if (err) {
        console.log("Error connecting to DB: " + err);
        process.exit(1);
    } else {
        console.log("Connected to DB");

        // Inserting 'VAL05' as a 5% discount (approximating $5 off as system uses %)
        // Valid from 2025-01-01 to 2027-12-31
        // Using Country ID 25 (from previous test context)

        var sql = "INSERT INTO promotioncodeentity (PROMOCODE, DESCRIPTION, DISCOUNTRATE, STARTDATE, ENDDATE, COUNTRY_ID, ITEM_ID) VALUES (?, ?, ?, ?, ?, ?, ?)";
        var startDate = '2025-01-01';
        var endDate = '2027-12-31';

        conn.query(sql, ['VAL05', 'Special $5 (5%) Off', 5, startDate, endDate, 25, null], function (err, result) {
            if (err) {
                console.log("Error inserting: " + err);
            } else {
                console.log("Inserted valid promotion 'VAL05' for Country 25.");
            }
            conn.end();
        });
    }
});
