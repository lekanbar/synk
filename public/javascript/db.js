
var mysql = require('mysql');

exports.db = (function(){
    var out = {};
    var connection = mysql.createConnection({
        user: 'root',
        password: 'golden',
        database: 'my_ip',
        multipleStatements: true
    });

    /*var connection = mysql.createConnection({
        host: 'eu-cdbr-azure-north-b.cloudapp.net',
        user: 'b39f34eafe714c',
        password: '642055e0',
        database: 'synkDB',
        multipleStatements: true
    });*/

    connection.connect(function(err){
        if(err){
            throw err;
        }
    });

    //=====myIP QUERIES=======
    out.getUserByLoginAndPassword = function(login, password, cb){
        var sql = "SELECT * FROM user WHERE (email = ? OR username = ?) AND pword = ?";
        connection.query(sql, [login, login, password], function(err, res){
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
        });
    };

    out.getUserInfoByType = function(userId, typeId, cb){
        var sql = "SELECT i.id, i.info, i.more, i.ts, (SELECT COUNT(id) FROM pins_info pi \
                    WHERE pi.info = i.id) as 'pins' \
                    FROM info i \
                    WHERE user = ? AND type_fk = ?";
        connection.query(sql, [userId, typeId], function(err, res){
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
        });
    };

    out.getUserPins = function(userId, cb){
        var sql = "SELECT p.id, p.pin, p.name, p.photo_path, p.ts, \
	                (SELECT COUNT(id) FROM contact c WHERE c.pin = p.id) AS 'count', \
	                EXISTS(SELECT pi.id FROM pins_info pi INNER JOIN info i \
		                ON i.id = pi.info \
		                INNER JOIN type t \
		                ON t.id = i.type_fk \
		                WHERE LCASE(t.name) = 'name' \
		                AND pi.pin = p.id LIMIT 1) AS 'has_name_info' \
                    FROM pin p \
                    WHERE p.user = ? \
                    ORDER BY p.name ASC";
        connection.query(sql, [userId], function(err, res){
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
        });


    };

    out.getPinInfo = function(userId, pinId, cb){
        var sql = "SELECT i.id, i.info, i.more, i.ts, t.id AS 'type', \
                   EXISTS(SELECT * FROM pins_info pi WHERE pi.info = i.id AND pi.pin = ?) AS 'exists' \
                   FROM info i \
                   INNER JOIN type t ON t.id = i.type_fk \
                   WHERE i.user = ? \
                   ORDER BY t.id ASC";

        connection.query(sql, [pinId, userId], function (err, res) {
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
       });
    };

    out.getContacts = function(userId, cb){
        var sql = "SELECT c.id, i.info AS 'name', p.pin, p.id AS 'pinId', p.photo_path FROM contact c \
                    INNER JOIN pin p ON p.id = c.pin \
                    INNER JOIN user u ON u.id = p.user \
                    INNER JOIN pins_info pi ON pi.pin = p.id \
                    INNER JOIN info i ON i.id = pi.info \
                    WHERE c.user = ? AND i.type_fk = (SELECT id FROM type WHERE LCASE(name) = 'name' LIMIT 1) \
                    ORDER BY i.info ASC";
       connection.query(sql, [userId], function (err, res) {
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
       });
    };

    out.getPinContacts = function(userId, pinId, cb){
        var sql = "SELECT c.id, u.username, c.can_update FROM contact c \
                    INNER JOIN user u ON u.id = c.user \
                    INNER JOIN pin p ON p.id = c.pin \
                    WHERE p.user = ? AND p.id = ? \
                    ORDER BY u.username ASC";

       connection.query(sql, [userId, pinId], function (err, res) {
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
       });
    };

    out.getContactInfo = function(userId, pinId, cb){

        var sql = "SELECT i.info, i.more, t.id as 'type' FROM pins_info pi \
                    INNER join info i ON i.id = pi.info \
                    INNER join type t ON t.id = i.type_fk \
                    INNER join contact c ON c.pin = pi.pin \
                    INNER join user u ON u.id = c.user \
                    WHERE pi.pin = ? \
                    AND u.id = ? \
                    ORDER BY t.id ASC";

        connection.query(sql, [pinId, userId], function (err, res) {
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
       });
    };

    out.getInfoCount = function(userId, cb){
        var sql = "SELECT COUNT(id) AS 'count', type_fk AS 'typeId' \
                    FROM info \
                    WHERE user = ? \
                    GROUP BY type_fk \
                    ORDER BY type_fk ASC";

        connection.query(sql, userId, function (err, res) {
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
        });
    };

    out.getPinPhoto = function(userId, pinId, photoPath, cb){
        var sql = "SELECT c.id FROM contact c \
                    INNER JOIN pin p ON p.id = c.pin \
                    WHERE c.user = ? AND c.pin = ? \
                    AND p.photo_path = ? LIMIT 1 \
                    UNION SELECT u.id FROM user u \
                    INNER JOIN pin p ON p.user = u.id \
                    WHERE u.id = ? AND p.id = ? \
                    AND p.photo_path = ? LIMIT 1";

        connection.query(sql, [userId, pinId, photoPath, userId, pinId, photoPath], function (err, res) {
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
        });
    };

    //======myIP COMMANDS=======
    out.insertUser = function (username, email, password, cb) {
       var sql = "INSERT INTO user (id, username, email, pword, reg_date) \
                    SELECT * FROM (SELECT UUID(), ?, ?, ?, NOW()) AS tmp \
                    WHERE NOT EXISTS (SELECT id FROM user WHERE username = ? OR email = ?) LIMIT 1;";
       connection.query(sql, [username, email, password, username, email], function (err, res) {
           if(err){
               console.log("error occured!", err);
           }
           cb(err, res);
       });
    };

    out.insertInfo = function (type, user, info, detail, cb) {
        var sql = "INSERT INTO info \
                    SELECT * FROM (SELECT UUID(), ? as 'user', ? as 'type', ? as 'info', ? as 'more', UNIX_TIMESTAMP() as 'ts', 0) AS tmp \
                    WHERE EXISTS (SELECT id FROM type WHERE id = ?) AND EXISTS (SELECT id FROM user WHERE id = ?) LIMIT 1";
        connection.query(sql, [user, type, info, detail, type, user], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

    out.insertInfo_poll = function (guid, type, user, info, detail, cb) {
        var sql = "INSERT INTO info \
                    SELECT * FROM (?, ? as 'user', ? as 'type', ? as 'info', ? as 'more', UNIX_TIMESTAMP() as 'ts', 0) AS tmp \
                    WHERE EXISTS (SELECT id FROM type WHERE id = ?) AND EXISTS (SELECT id FROM user WHERE id = ?) LIMIT 1";
        connection.query(sql, [guid, user, type, info, detail, type, user], function (err, res) {
            if (err) {
                cb(err, res);
                console.log("error occured!", err);
            }
            else{
                return returnTimeStampForTable("info", res, cb);
            }            
        });
    };

    var returnTimeStampForTable = function(table, res, cb){
        var sql = "SELECT id, ts FROM " + table + " WHERE id = ?";
        connection.query(sql, res.insertId, function(err, res){
            cb(err, res);
        });
    };

    out.insertPin = function(userId, pin, name, imagePath, cb){
        imagePath = imagePath === "" ? null : imagePath;

        var sql = "INSERT INTO pin SELECT * FROM (SELECT UUID(), ? as 'user', ? as 'pin', ? as 'name', ? as 'photo_path', UNIX_TIMESTAMP() as 'ts') AS tmp \
                    WHERE EXISTS (SELECT id FROM user WHERE id = ?) \
                    AND NOT EXISTS (SELECT id FROM pin WHERE LCASE(pin) = LCASE(?)) LIMIT 1";
        connection.query(sql, [userId, pin, name, imagePath, userId, pin], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        })
    };

    out.insertPinInfo = function(userId, pinId, infoId, cb){
        var sql = "INSERT INTO pins_info SELECT * FROM (SELECT UUID(), ?, ?, UNIX_TIMESTAMP() as 'ts', 0) AS tmp \
                    WHERE NOT EXISTS(SELECT id FROM pins_info WHERE pin = ? AND info = ? LIMIT 1) \
                    AND EXISTS(SELECT id FROM pin WHERE id = ? AND user = ? LIMIT 1) \
                    AND EXISTS(SELECT id FROM info WHERE id = ? AND user = ? LIMIT 1)";

        connection.query(sql, [pinId, infoId, pinId, infoId, pinId, userId, infoId, userId], function(err, res){
            if(err){
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

    out.insertPinInfo_poll = function(guid, userId, pinId, infoId, cb){
        var sql = "INSERT INTO pins_info SELECT * FROM (?, ?, ?, UNIX_TIMESTAMP() as 'ts', 0) AS tmp \
                    WHERE NOT EXISTS(SELECT id FROM pins_info WHERE pin = ? AND info = ? AND NOT is_deleted LIMIT 1) \
                    AND EXISTS(SELECT id FROM pin WHERE id = ? AND user = ? AND NOT is_deleted LIMIT 1) \
                    AND EXISTS(SELECT id FROM info WHERE id = ? AND user = ? AND NOT is_deleted LIMIT 1)";

        connection.query(sql, [guid, pinId, infoId, pinId, infoId, pinId, userId, infoId, userId], function(err, res){
            if (err) {
                cb(err, res);
                console.log("error occured!", err);
            }
            else{
                return returnTimeStampForTable("pins_info", res, cb);
            } 
        });
    };

    out.insertContact = function(userId, pin, cb){

        /* This sql statement checks the following conditions (in order) before adding a pin
            1. That the PIN exists
            2. The the PIN is not owned by the same user
            3. That the PIN does not already exist for the user as a contact
            4. That the PIN has associated 'name' info to make it valid
        */
        var sql = "INSERT INTO contact SELECT * FROM (SELECT UUID(), (SELECT id FROM pin WHERE LCASE(pin) = LCASE(?) LIMIT 1), ?, 1 as 'can_update') AS tmp \
                    WHERE EXISTS (SELECT id FROM pin WHERE LCASE(pin) = LCASE(?) AND user <> ? LIMIT 1) \
                    AND NOT EXISTS (SELECT c.id FROM contact c \
				        INNER JOIN pin p ON p.id = c.pin \
				        WHERE LCASE(p.pin) = LCASE(?) AND c.user = ? LIMIT 1) \
                    AND EXISTS(SELECT pi.id FROM pins_info pi \
                        INNER JOIN info i ON i.id = pi.info \
                        WHERE pi.pin = (SELECT id FROM pin WHERE LCASE(pin) = LCASE(?) LIMIT 1) \
                        AND i.type_fk = (SELECT id FROM type WHERE LCASE(name) = 'name' LIMIT 1) LIMIT 1)";

        connection.query(sql, [pin, userId, pin, userId, pin, userId, pin], function(err, res){
            if(err){
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

    out.updateInfo = function(userId, info, detail, serverId, cb){
        var sql = "UPDATE info SET info = ?, more = ? WHERE id = ? AND user = ?";
        connection.query(sql, [info, detail, serverId, userId], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

    out.updateInfo_poll = function(guid, userId, info, detail, cb){
        var sql = "UPDATE info SET info = ?, more = ?, ts = UNIX_TIMESTAMP() WHERE id = ? AND user = ?";
        connection.query(sql, [info, detail, guid, userId], function (err, res) {
            if (err) {
                cb(err, res);
                console.log("error occured!", err);
            }
            else{
                return returnTimeStampForTable("info", res, cb);
            }
        });
    };

    out.updatePin = function(userId, name, pinId, cb){
        var sql = "UPDATE pin SET name = ? WHERE user = ? AND id = ?";
        connection.query(sql, [name, userId, pinId], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        })
    };

    out.updatePin_poll = function(userId, name, guid, cb){
        var sql = "UPDATE pin SET name = ?, ts = UNIX_TIMESTAMP() WHERE user = ? AND id = ?";
        connection.query(sql, [name, userId, guid], function (err, res) {
            if (err) {
                cb(err, res);
                console.log("error occured!", err);
            }
            else{
                return returnTimeStampForTable("pin", res, cb);
            }
        })
    };

    out.updatePinContact = function(userId, contactId, canUpdate, cb){
        canUpdate = canUpdate === '1' ? 1 : 0;
        var sql = "UPDATE contact c SET c.can_update = ? \
                    WHERE c.id = ? \
                    AND EXISTS(SELECT p.id FROM pin p WHERE p.user = ? AND p.id = c.pin LIMIT 1)";

        connection.query(sql, [canUpdate, contactId, userId], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        })
    };

    out.updatePinInfo = function(userId, pinId, oldInfoId, newInfoId, cb){

        //user is owner of pin
        //user is owner of infoid
        //entry does not exist (newPin)
        var sql = "CREATE TEMPORARY TABLE temp_pins_info SELECT * FROM pins_info WHERE pin = ? AND info = ? LIMIT 1; \
                    UPDATE pins_info SET info = ? \
                    WHERE info = ? AND pin = ? \
                    AND NOT EXISTS(SELECT id FROM temp_pins_info) \
                    AND EXISTS(SELECT id FROM pin WHERE id = ? AND user = ? LIMIT 1) \
                    AND EXISTS(SELECT id FROM info WHERE id = ? AND user = ? LIMIT 1); \
                    DROP TABLE temp_pins_info;";

        connection.query(sql, [pinId, newInfoId, newInfoId, oldInfoId, pinId, pinId, userId, newInfoId, userId], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        })
    };

    out.updatePinInfo_poll = function(userId, pinId, oldInfoId, newInfoId, cb){

        //user is owner of pin
        //user is owner of infoid
        //entry does not exist (newPin)
        var sql = "CREATE TEMPORARY TABLE temp_pins_info SELECT * FROM pins_info WHERE pin = ? AND info = ? LIMIT 1; \
                    UPDATE pins_info SET info = ?, ts = UNIX_TIMESTAMP() \
                    WHERE info = ? AND pin = ? \
                    AND NOT EXISTS(SELECT id FROM temp_pins_info) \
                    AND EXISTS(SELECT id FROM pin WHERE id = ? AND user = ? LIMIT 1) \
                    AND EXISTS(SELECT id FROM info WHERE id = ? AND user = ? LIMIT 1); \
                    DROP TABLE temp_pins_info;";

        connection.query(sql, [pinId, newInfoId, newInfoId, oldInfoId, pinId, pinId, userId, newInfoId, userId], function (err, res) {
            if (err) {
                cb(err, res);
                console.log("error occured!", err);
            }
            else{
                return returnTimeStampForTable("pins_info", res, cb);
            }
        })
    };

    out.updatePinPhoto = function(userId, pinId, photoPath, cb){
        photoPath = photoPath === "" ? null : photoPath;

        var sql = "UPDATE pin SET photo_path = ? WHERE user = ? AND id = ?";
        connection.query(sql, [photoPath, userId, pinId], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        })
    };

    out.deleteInfo = function(userId, serverId, cb){
        var sql = "DELETE FROM info WHERE id = ? AND user = ?";
        connection.query(sql, [serverId, userId], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

    out.deleteInfo_poll = function(userId, guid, cb){
        //TODO: ensure info being deleted isn't connected to a PIN
        //Names already used with PINs can only be Updated and not deleted
        var sql = "UPDATE info SET is_deleted = 1 AND ts = UNIX_TIMESTAMP() WHERE id = ? AND user = ? \
                    AND NOT EXISTS(SELECT id FROM info i INNER JOIN type t ON t.id = i.type_fk \
                        WHERE i.id = ? AND LCASE(t.name) = 'name' LIMIT 1)";
        connection.query(sql, [guid, userId, guid], function (err, res) {
            if (err) {
                cb(err, res);
                console.log("error occured!", err);
            }
            else{
                return returnTimeStampForTable("info", res, cb);
            }
        });
    };

    out.deletePin = function(userId, pinId, cb){
        //delete from pins_info
        //delete from contact
        //delete from pin

        var sql = "DELETE FROM contact WHERE EXISTS(SELECT id FROM my_ip.pin p WHERE p.user = ? AND p.id = ? LIMIT 1) AND pin = ?; \
                    DELETE FROM pins_info WHERE EXISTS(SELECT id FROM my_ip.pin p WHERE p.user = ? AND p.id = ? LIMIT 1) AND pin = ?; \
                    DELETE FROM pin WHERE id = ? AND user = ?;";
        connection.query(sql, [userId, pinId, pinId, userId, pinId, pinId, pinId, userId], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

    out.deletePin_poll = function(userId, pinId, cb){
        //delete from pins_info
        //delete from contact
        //delete from pin

        var sql = "UPDATE contact SET is_deleted = 1, ts = UNIX_TIMESTAMP() WHERE EXISTS(SELECT id FROM my_ip.pin p WHERE p.user = ? AND p.id = ? LIMIT 1) AND pin = ?; \
                UPDATE pins_info SET is_deleted = 1, ts = UNIX_TIMESTAMP() WHERE EXISTS(SELECT id FROM my_ip.pin p WHERE p.user = ? AND p.id = ? LIMIT 1) AND pin = ?; \
                UPDATE pin SET is_deleted = 1, ts = UNIX_TIMESTAMP() WHERE id = ? AND user = ?;";
        connection.query(sql, [userId, pinId, pinId, userId, pinId, pinId, pinId, userId], function (err, res) {
            if (err) {
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

    out.deletePinInfo = function(userId, pinId, infoId, cb){
        var sql = "DELETE FROM pins_info \
                    WHERE pin = ? AND info = ? \
                    AND EXISTS(SELECT id FROM pin WHERE id = ? AND user = ? LIMIT 1) \
                    AND EXISTS(SELECT id FROM info WHERE id = ? AND user = ? LIMIT 1)";
        connection.query(sql, [pinId, infoId, pinId, userId, infoId, userId], function(err, res){
            if(err){
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

    out.deletePinInfo_poll = function(userId, pinId, infoId, guid, cb){
        var sql = "UPDATE pins_info \
                    SET is_deleted = 1 AND ts = UNIX_TIMESTAMP() \
                    WHERE pin = ? AND info = ? AND id = ? \
                    AND EXISTS(SELECT id FROM pin WHERE id = ? AND user = ? LIMIT 1) \
                    AND EXISTS(SELECT id FROM info WHERE id = ? AND user = ? LIMIT 1)";
        connection.query(sql, [pinId, infoId, guid, pinId, userId, infoId, userId], function(err, res){
            if (err) {
                cb(err, res);
                console.log("error occured!", err);
            }
            else{
                return returnTimeStampForTable("pins_info", res, cb);
            }
        });
    };

    out.deleteContact = function(userId, contactId, cb){
        var sql = "DELETE FROM contact WHERE id = ? AND user = ?";

        connection.query(sql, [contactId, userId], function(err, res){
            if(err){
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

    out.deleteContact_poll = function(userId, guid, cb){
        var sql = "UPDATE contact SET is_deleted = 1, ts = UNIX_TIMESTAMP() WHERE id = ? AND user = ?";

        connection.query(sql, [guid, userId], function(err, res){
            if(err){
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };
       

    out.deletePinPhoto = function(userId, pinId, cb){
        var sql = "UPDATE pin SET photo_path = null WHERE id = ? AND user = ?";

        connection.query(sql, [pinId, userId], function(err, res){
            if(err){
                console.log("error occured!", err);
            }
            cb(err, res);
        });
    };

   return out;
}());
