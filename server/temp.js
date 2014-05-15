
var express = require('express'),
    http = require('http'),
    app = express(),
    //db = require('./public/javascript/db').db,
    db2 = require('./public/javascript/db2').db2,
    path = require('path'),
    fs = require('fs');

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));
app.use(express.errorHandler());

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get("/index", function (req, res) {
    res.send("Hello world");
});

//=====================POLL GET==============================
app.get("/api/poll/get/clientpersonalinfo", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp
    };
    db2.getUserInfo_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });

    /*db.getUserInfo_poll(userId, timeStamp, function (err, result){
        if(err){
            console.log("error occured with: ", err);
            res.send(err);
        }
        else{
            res.send(result);
        }
    });*/
});

app.get("/api/poll/get/clientpins", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp
    };

    db2.getUserPins_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });

    /*db.getUserPins_poll(userId, timeStamp, function(err, result){
        if(err){
            console.log("error occured with: ", err);
            res.send(err);
        }
        else{
            res.send(result);
        }
    });*/
});

app.get("/api/poll/get/clientpininfo", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp
    };
    db2.getUserPinsInfo_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });

    /*db.getUserPinsInfo_poll(userId, timeStamp, function(err, result){
        if(err){
            console.log("error occured with: ", err);
            res.send(err);
        }
        else{
            res.send(result);
        }
    });*/
});

app.get("/api/poll/get/clientcontacts", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp
    };
    db2.getUserContacts_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });

    /*db.getUserContacts_poll(userId, timeStamp, function (err, result){
        if(err){
            console.log("error occured with: ", err);
            res.send(err);
        }
        else{
            res.send(result);
        }
    });*/
});

app.get("/api/poll/get/clientcontactinfo", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp
    };
    db2.getUserContactsInfo_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });

    /*db.getUserContactsInfo_poll(userId, timeStamp, function(err, result){
        if(err){
            console.log("error occured with: ", err);
            res.send(err);
        }
        else{
            res.send(result);
        }
    });*/
});

app.get("/api/poll/get/clientcontactandcontactinfo", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp
    };
    db2.getUserContactAndContactInfo_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });

    /*db.getUserContactAndContactInfo_poll(userId, timeStamp, function (err, result) {
        if (err) {
            console.log("error occured with: ", err);
            res.send(err);
        }
        else {
            res.send(result);
        }
    });*/
});

app.get("/api/poll/get/pinimage", function (req, res) {
    //api/get/pins/?pin_id=3&user_id=1
    var data = {
        userId: req.query.user_id,
        pinId: req.query.pin_id,
        path: req.query.photo_path
    };
    db2.getPinPhoto(data, function (err, result) {
        if (result.length >= 1) {
            fs.exists(__dirname + '/public/uploads/' + data.path, function (exists) {
                if (exists) {
                    res.send();
                }
                else {
                    res.header("content-disposition", "attachment; filename='" + result[0].photo_path + "'");
                    res.sendfile(__dirname + '/public/uploads/' + result[0].photo_path);
                }
            });
        }
        else {
            res.status(404).send();
        }
    });

    /*db.getPinPhoto(userId, pinId, function (err, result) {
        if (result.length >= 1) {
            fs.exists(__dirname + '/public/uploads/' + photoPath, function (exists) {
                if (exists) {
                    res.send();
                }
                else {
                    res.header("content-disposition", "attachment; filename='" + result[0].photo_path+"'");
                    res.sendfile(__dirname + '/public/uploads/' + result[0].photo_path);
                }
            });
            
        }
        else {
            res.status(404).send();
        }
    });*/
});

app.get("/api/poll/get/clientconnectedcontacts", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp
    };
    db2.getUserConnectedContacts_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
    /*db.getUserConnectedContacts_poll(userId, timeStamp, function(err, result){
        if(err){
            console.log("error occured with: ", err);
            res.send(err);
        }
        else{
            res.send(result);
        }
    });*/
});

app.get("/api/get/types", function (req, res) {
    db2.getTypes(null, function (err, result) {
        res.send(result);
    });

    /*db.getTypes(function(err, result){
        res.send(result);
    });*/
});

//==========GET=================

app.get("/api/get/login", function (req, res) {
    var data = {
        login: req.query.login,
        password: req.query.password
    };
    db2.getUserByLoginAndPassword(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });

    /*db.getUserByLoginAndPassword(login, password, function(err, result){
        if(err){
            console.log("error occured with: ", err);
            res.send(err);
        }
        else{
            res.send(result);
        }
    });*/
});

app.get("/api/get/pinimage", function (req, res) {
    //api/get/pins/?pin_id=3&user_id=1
    var data = {
        userId: req.query.user_id,
        pinId: req.query.pin_id
    };
    db2.getPinPhoto(data, function (err, result) {
        if (result.length >= 1) {
            res.sendfile(__dirname + '/public/uploads/' + result[0].photo_path);
        }
        else {
            res.status(404).send();
        }
    });

    /*db.getPinPhoto(userId, pinId, function(err, result){
        if (result.length >= 1) {
            res.sendfile(__dirname + '/public/uploads/' + result[0].photo_path);
        }
        else{
            res.status(404).send();
        }
    });*/
});

//server first
app.get("/api/get/register", function (req, res) {
    var data = {
        username: req.query.username,
        email: req.query.email,
        pword: req.query.password,
        defname: req.query.defaultName,
        timestamp: getTimestamp()
    };

    db2.getExistingUser(data, function (err1, result1) {
        if (result1.length > 0) {
            res.send(result1);
        }
        else {
            db2.insertUser(data, function (err2, result2) {
                db2.getUserByUsernameAndEmail(data, function (err3, result3) {
                    res.send(result3);
                });
            });
        }
    });

    /*db.insertUser(username, email, password, defaultName, function (err, result) {
        res.send(result);
    });*/
});

/*app.get("/api/get/pinInfo", function(req, res){
    var pinId = req.query.pin_id,
        userId = req.query.user_id;
    db.getPinInfo(userId, pinId, function(err, result){
        if(err){
            res.status(404).send({error: 'An error occured trying to perform the operation'});
        }
        else{
            res.send(result);
        }
    });
});*/

/*app.get("/api/get/info", function(req, res){
    var type = req.query.type_id,
        user = req.query.user_id;

    if(type <= 0 || user <= 0){
        res.status(404).send({error: 'Invalid parameters'});
    }
    else{
        db.getUserInfoByType(user, type, function(err, result){
            if(err){
                res.status(404).send({error: 'An error occured trying to perform the operation'});
            }
            else{
                res.send(result);
            }
        });
    }
});*/

/*app.get("/api/get/pins", function(req, res){
    //api/get/pins/?user_id=3
    var userId = req.query.user_id;
    db.getUserPins(userId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured getting information'});
        }
        else{
            res.send(result);
        }
    });
});*/



/*app.get("/api/get/contacts", function(req, res){
    var userId = req.query.user_id;

    db.getContacts(userId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured getting information'});
        }
        else{
            res.send(result);
        }
    });
});*/

/*app.get("/api/get/pincontacts", function(req, res){
    var userId = req.query.user_id,
        pinId = req.query.pin_id;

    db.getPinContacts(userId, pinId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured getting information'});
        }
        else{
            res.send(result);
        }
    });
});*/

/*app.get("/api/get/contactinfo", function(req, res){
    var userId = req.query.user_id,
        pinId = req.query.pin_id;
    db.getContactInfo(userId, pinId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured getting information'});
        }
        else{
            res.send(result);
        }
    });
});*/

/*app.get("/api/get/infocount", function(req, res){
    var userId = req.query.user_id;
    db.getInfoCount(userId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured getting information'});
        }
        else{
            res.send(result);
        }
    });
});*/

//==========POST=================

/*app.post("/api/post/info", function (req, res) {
    //{type:1, user_id:3,info:"svenroy", detail:"facebook.com/svenroy"}
    var type = req.body.type,
        user = req.body.user_id,
        info = req.body.info,
        detail = req.body.detail;
    if(info !== ""){
        db.insertInfo(type, user, info, detail, function (err, result) {
            if (err) {
                console.log("An error occured", err);
                res.send(err);
            }
            else {
                res.send({server_id: result.insertId});
            }
        });
    }
    else{
        res.send({success: false, message:'invalid data'});
    }
});*/

app.post("/api/poll/post/info", function (req, res) {
    //{type:1, user_id:3,info:"svenroy", detail:"facebook.com/svenroy"}
    var type = req.body.type,
        user = req.body.user_id,
        info = req.body.info,
        detail = req.body.detail,
        guid = req.body.guid;

    if (info !== "") {
        /*db.insertInfo_poll(guid, type, user, info, detail, function (err, result) {
            if (err) {
                console.log("An error occured", err);
                res.send(err);
            }
            else {
                res.send(result); //{id:, ts:}
            }
        });*/

        db2.insertInfo_poll({ guid: guid, type: type, user: user, info: info, detail: detail, timestamp: getTimestamp() }, function (err, result) {
            if (err) {
                console.log("An error occured", err);
                res.send(err);
            }
            else {
                res.send(result); //{id:, ts:}
            }
        });
    }
    else {
        res.send({ success: false, message: 'invalid data' });
    }
});

//server first
app.post("/api/post/pin", function (req, res) {
    var name = req.body.name,
        userId = req.body.user_id,
        pin = getPin(),
        imagePath = "";

    if (req.files && req.files.image) {
        imagePath = req.files.image.path.split('\\');
        imagePath = imagePath[(imagePath.length - 1)];
    }

    db2.insertPin({ user: userId, pin: pin, name: name, imagePath: imagePath, timestamp: getTimestamp() }, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured inserting information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });

    /*db.insertPin(userId, pin, name, imagePath, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured inserting information'});
        }
        else{
            res.send({success:'true'});
        }
    });*/
});

/*app.post("/api/post/pininfo", function(req, res){
    var userId = req.body.user_id,
        infoId = req.body.info_id,
        pinId = req.body.pin_id;

    db.insertPinInfo(userId, pinId, infoId, function(err, result){
        if(err){
            res.status(404).send({success:'false', error:'An error occured inserting information'});
        }
        else{
            res.status(200).send({success:'true'});
        }
    });
});*/

app.post("/api/poll/post/pininfo", function (req, res) {
    var data = {
        guid: req.body.guid,
        userId: req.body.user_id,
        pinId: req.body.pin_id,
        infoId: req.body.info_id,
        timestamp: getTimestamp()
    };
    db2.insertPinInfo_poll(data, function (err, result) {
        if (err) {
            res.status(404).send({ success: 'false', error: 'An error occured inserting information' });
        }
        else {
            res.status(200).send(result); //{id:, ts:}
        }
    });

    /*db.insertPinInfo_poll(guid, userId, pinId, infoId, function(err, result){
        if(err){
            res.status(404).send({success:'false', error:'An error occured inserting information'});
        }
        else{
            res.status(200).send(result); //{id:, ts:}
        }
    });*/
});

//server first
app.post("/api/post/contact", function (req, res) {
    var userId = req.body.user_id,
        pin = req.body.pin;

    /*db.insertContact(userId, pin, function(err, result){
        if(err){
            res.status(404).send(result);
        }
        else {
            res.status(200).send(result);
        }
    });*/

    db2.insertContact({ userId: req.body.user_id, pin: req.body.pin, timestamp: getTimestamp() }, function (err, affectedRows) {
        console.log(err);
        if (err || affectedRows <= 0) {
            if (err) {
                console.log("ROY 1:", err);
                res.status(404).send([{ ts: 0 }]);
            }
            else {
                console.log("ROY 2:");
                res.status(200).send([{ ts: 0 }]);
            }
        }
        else {
            console.log("ROY 3:", affectedRows);
            db2.getNewContactTimeStamps({ pin: req.body.pin }, function (err2, result2) {
                if (err2) {
                    console.log("ROY 4:", err2);
                    res.status(404).send(result2);
                }
                else {
                    console.log("ROY 5:", result2);
                    res.status(200).send(result2);
                }
            });
        }
    });
});

//==========PUT=================

/*app.put("/api/put/info", function (req, res){
    //{user_id:3,info:"svenroy", detail:"facebook.com/svenroy", server_id:4}
    var serverId = req.body.server_id,
        userId = req.body.user_id,
        info = req.body.info,
        detail = req.body.detail;
    if(info !== ""){
        db.updateInfo(userId, info, detail, serverId, function(err, result){
            if(err){
                res.status(404).send({error:'An error occured updating information'});
            }
            else{
                res.send({success:'true'});
            }
        });
    }
});*/

app.put("/api/poll/put/info", function (req, res) {
    //{user_id:3,info:"svenroy", detail:"facebook.com/svenroy", server_id:4}
    var guid = req.body.guid,
        userId = req.body.user_id,
        info = req.body.info,
        detail = req.body.detail;
    if (info !== "") {
        /*db.updateInfo_poll(guid, userId, info, detail, function(err, result){
            if(err){
                res.status(404).send({success:'false', error:'An error occured updating information'});
            }
            else{
                res.status(200).send(result);
            }
        });*/

        db2.updateInfo_poll({ guid: req.body.guid, userId: req.body.user_id, info: req.body.info, detail: req.body.detail, timestamp: getTimestamp() }, function (err, result) {
            if (err) {
                res.status(404).send({ success: 'false', error: 'An error occured updating information' });
            }
            else {
                res.status(200).send(result);
            }
        });
    }
    else {
        res.status(404).send({ success: 'false', error: 'An error occured updating information' });
    }
});

/*app.put("/api/put/pin", function(req, res){
    //{user_id:1, name:friends, server_id:7}
    var name = req.body.name,
        userId = req.body.user_id,
        pinId = req.body.server_id;

    db.updatePin(userId, name, pinId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured updating information'});
        }
        else{
            res.send({success:'true'});
        }
    });
});*/

app.put("/api/poll/put/pin", function (req, res) {
    //{user_id:1, name:friends, server_id:7}
    var name = req.body.name,
        userId = req.body.user_id,
        guid = req.body.guid;

    /*db.updatePin_poll(userId, name, guid, function(err, result){
        if(err){
            res.status(404).send({success:'false', error:'An error occured updating information'});
        }
        else{
            res.status(200).send(result);
        }
    });*/

    db2.updatePin_poll({ userId: req.body.user_id, name: req.body.name, guid: req.body.guid, timestamp: getTimestamp() }, function (err, result) {
        if (err) {
            res.status(404).send({ success: 'false', error: 'An error occured updating information' });
        }
        else {
            res.status(200).send(result);
        }
    });
});

//server first
app.put("/api/put/pincontact", function (req, res) {
    var userId = req.body.user_id,
        contactId = req.body.contact_id,
        canUpdate = req.body.can_update;

    /*db.updatePinContact(userId, contactId, canUpdate, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured updating information'});
        }
        else{
            res.send({success:'true'});
        }
    });*/

    db2.updatePinContact({ userId: req.body.user_id, contactId: req.body.contact_id, canUpdate: req.body.can_update, timestamp: getTimestamp() }, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured updating information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

/*app.put("/api/put/pininfo", function(req, res){
    //this method is only used to change the 'Name' info associated with a PIN
    //a valid PIN must have only ONE name entry

    var userId = req.body.user_id,
        pinId = req.body.pin_id,
        oldInfoId = req.body.old_info_id,
        newInfoId = req.body.new_info_id;

    db.updatePinInfo(userId, pinId, oldInfoId, newInfoId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured updating information'});
        }
        else{
            res.send({success:'true'});
        }
    });
});*/

app.put("/api/poll/put/pininfo", function (req, res) {
    //this method is only used to change the 'Name' info associated with a PIN
    //a valid PIN must have only ONE name entry

    var userId = req.body.user_id,
        pinId = req.body.pin_id,
        guid = req.body.guid,
        newInfoId = req.body.info_id;

    /*db.updatePinInfo_poll(guid, userId, pinId, newInfoId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured updating information'});
        }
        else{
            res.send({success:'true'});
        }
    });*/

    db2.updatePinInfo_poll({ guid: req.body.guid, userId: req.body.user_id, pinId: req.body.pin_id, infoId: req.body.info_id, timestamp: getTimestamp() }, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured updating information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

//server first
app.put("/api/put/pinPhoto/remove", function (req, res) {
    //{user_id:1, pin_id:1 }
    var userId = req.body.user_id,
        pinId = req.body.pin_id;

    /*db.deletePinPhoto(userId, pinId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured deleting information'});
        }
        else{
            res.send({success:'true'});
        }
    });*/

    db2.deletePinPhoto({ userId: req.body.user_id, pinId: req.body.pin_id }, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured deleting information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

//server first
app.post("/api/put/pinPhoto/change", function (req, res) {
    //{user_id:1, pin_id:3}
    var userId = req.body.user_id,
        pinId = req.body.pin_id,
        imagePath = "";

    if (req.files && req.files.image) {
        imagePath = req.files.image.path.split('\\');
        imagePath = imagePath[(imagePath.length - 1)];
    }

    if (imagePath !== "") {
        /*db.updatePinPhoto(userId, pinId, imagePath, function(err, result){
            if(err){
                res.status(404).send({error:'An error occured updating information'});
            }
            else{
                res.send({success:'true'});
            }
        });*/

        db2.updatePinPhoto({ userId: req.body.user_id, pinId: req.body.pin_id, photoPath: imagePath }, function (err, result) {
            if (err) {
                res.status(404).send({ error: 'An error occured updating information' });
            }
            else {
                res.send({ success: 'true' });
            }
        });
    }
    else {
        res.status(404).send({ error: 'No data received!' });
    }
});

//==========DELETE=================

/*app.delete("/api/delete/pinInfo", function(req, res){
    var userId = req.body.user_id,
        pinId = req.body.pin_id,
        infoId = req.body.info_id;

    db.deletePinInfo(userId, pinId, infoId, function(err, result){
        if(err){
            res.status(404).send({success:'false', error:'An error occured inserting information'});
        }
        else{
            res.status(200).send({success:'true'});
        }
    });
});*/

app.delete("/api/poll/delete/pinInfo", function (req, res) {
    var userId = req.body.user_id,
        pinId = req.body.pin_id,
        infoId = req.body.info_id,
        guid = req.body.guid;

    /*db.deletePinInfo_poll(userId, pinId, infoId, guid, function(err, result){
        if(err){
            res.status(404).send({success:'false', error:'An error occured deleting information'});
        }
        else{
            res.status(200).send();
        }
    });*/
    var data = {
        userId: req.body.user_id,
        pinId: req.body.pin_id,
        infoId: req.body.info_id,
        guid: req.body.guid,
        timestamp: getTimestamp()
    };
    db2.deletePinInfo_poll(data, function (err, result) {
        if (err) {
            res.status(404).send({ success: 'false', error: 'An error occured deleting information' });
        }
        else {
            res.status(200).send();
        }
    });
});

/*app.delete("/api/delete/info", function (req, res){
    //{user_id:3, server_id:4}
    //NOTE: cannot delete last 'Name' info if connected to PINs
    var serverId = req.body.server_id,
        userId = req.body.user_id;

    db.deleteInfo(userId, serverId, function(err, result){
        if(err){
            res.status(404);
            res.send({error:'An error occured deleting information'});
        }
        else{
            res.send({success:'true'});
        }
    });
});*/

app.delete("/api/poll/delete/info", function (req, res) {
    //{user_id:3, server_id:4}
    //NOTE: cannot delete 'Name' info if connected to PINs or is last 'Name' info
    var guid = req.body.guid,
        userId = req.body.user_id;

    /*db.deleteInfo_poll(userId, guid, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured deleting information'});
        }
        else{
            res.send({success:'true'});
        }
    });*/

    db2.deleteInfo_poll({ userId: req.body.user_id, guid: req.body.guid, timestamp: getTimestamp() }, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured deleting information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

/*app.delete("/api/delete/pin", function(req, res){
    //{user_id:1, server_id:7}
    var pinId = req.body.guid,
        userId = req.body.user_id;

    db.deletePin(userId, pinId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured deleting information'});
        }
        else{
            res.send({success:'true'});
        }
    });
});*/

app.delete("/api/poll/delete/pin", function (req, res) {
    //{user_id:1, server_id:7}
    var pinId = req.body.guid,
        userId = req.body.user_id;

    /*db.deletePin_poll(userId, pinId, function (err, result) {
        if(err){
            res.status(404).send({error:'An error occured deleting information'});
        }
        else{
            res.send({success:'true'});
        }
    });*/

    db2.deletePin_poll({ userId: req.body.user_id, pinId: req.body.guid, timestamp: getTimestamp() }, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured deleting information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

/*app.delete("/api/delete/contact", function(req, res){
    //{user_id:1, server_id:7}
    var contactId = req.body.server_id,
        userId = req.body.user_id;

    db.deleteContact(userId, contactId, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured deleting information'});
        }
        else{
            res.send({success:'true'});
        }
    });
});*/

app.delete("/api/poll/delete/contact", function (req, res) {
    //{user_id:1, server_id:7}
    var guid = req.body.guid,
        userId = req.body.user_id;

    /*db.deleteContact_poll(userId, guid, function(err, result){
        if(err){
            res.status(404).send({error:'An error occured deleting information'});
        }
        else{
            res.send({success:'true'});
        }
    });*/

    db2.deleteContact_poll({ userId: req.body.user_id, guid: req.body.guid, timestamp: getTimestamp() }, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured deleting information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

//==========HELPERS=================

var getPin = function () {
    var now = new Date();
    return Math.floor(Math.random() * 10) + parseInt(now.getTime()).toString(36).toUpperCase();
}

var getTimestamp = function () {
    return Math.round(new Date().getTime() / 1000.0);
};

//==========SERVER=================
app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));