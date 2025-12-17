var db = require('./databaseConfig.js');
var Promotion = require('./promotion.js');

var promotionDB = {
    getPromotionByCode: function (code, countryId) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM promotioncodeentity WHERE PROMOCODE = ? AND COUNTRY_ID = ?';
                    conn.query(sql, [code, countryId], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if (result.length > 0) {
                                var promo = new Promotion();
                                promo.id = result[0].ID;
                                promo.description = result[0].DESCRIPTION;
                                promo.promoCode = result[0].PROMOCODE;
                                promo.discountRate = result[0].DISCOUNTRATE;
                                promo.startDate = result[0].STARTDATE;
                                promo.endDate = result[0].ENDDATE;
                                promo.countryId = result[0].COUNTRY_ID;
                                promo.itemId = result[0].ITEM_ID;
                                conn.end();
                                return resolve(promo);
                            } else {
                                conn.end();
                                return resolve(null);
                            }
                        }
                    });
                }
            });
        });
    }
};

module.exports = promotionDB;
