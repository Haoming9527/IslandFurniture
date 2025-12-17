var db = require('./databaseConfig.js');

var promotionDB = {
    getPromotions: function () {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT p.ID, p.DESCRIPTION, p.DISCOUNTRATE, p.STARTDATE, p.ENDDATE, f.IMAGEURL, i.NAME, i.SKU ' +
                              'FROM promotionentity p ' +
                              'LEFT JOIN itementity i ON p.ITEM_ID = i.ID ' +
                              'LEFT JOIN furnitureentity f ON p.ITEM_ID = f.ID ' +
                              'ORDER BY p.DISCOUNTRATE DESC LIMIT 2';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var promotions = [];
                            for(var i = 0; i < result.length; i++) {
                                var promo = {
                                    id: result[i].ID,
                                    title: result[i].NAME,
                                    description: result[i].DESCRIPTION,
                                    discountRate: result[i].DISCOUNTRATE,
                                    startDate: result[i].STARTDATE,
                                    endDate: result[i].ENDDATE,
                                    imageURL: result[i].IMAGEURL,
                                    sku: result[i].SKU
                                };
                                promotions.push(promo);
                            }
                            conn.end();
                            return resolve(promotions);
                        }
                    });
                }
            });
        });
    }
};

module.exports = promotionDB;
