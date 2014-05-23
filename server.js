var express = require('express'),
    http = require('http'),
    app = express(),
    //db = require('./public/javascript/db').db,
    //db2 = require('./public/javascript/db2').db2,
    db2 = require('./server/db2').db2,
    path = require('path'),
    fs = require('fs'),
    bcrypt = require('bcrypt-nodejs'),
    crypto = require('crypto');

var secret = "@one is gonna be a blast";

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
    db2.getTypes(null, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Welcome to '@One'. " + result.length + " types");
        }
    });
});

//=====================POLL GET==============================
app.get("/api/poll/get/clientpersonalinfo", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp,
        token_e: req.query.token,
        token_d: decrypt(req.query.token)
    };
    db2.getUserInfo_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.get("/api/poll/get/clientpins", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp,
        token_e: req.query.token,
        token_d: decrypt(req.query.token)
    };

    db2.getUserPins_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.get("/api/poll/get/clientpininfo", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp,
        token_e: req.query.token,
        token_d: decrypt(req.query.token)
    };
    db2.getUserPinsInfo_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.get("/api/poll/get/clientcontacts", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp,
        token_e: req.query.token,
        token_d: decrypt(req.query.token)
    };
    db2.getUserContacts_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.get("/api/poll/get/clientcontactinfo", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp,
        token_e: req.query.token,
        token_d: decrypt(req.query.token)
    };
    db2.getUserContactsInfo_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.get("/api/poll/get/clientcontactandcontactinfo", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp,
        token_e: req.query.token,
        token_d: decrypt(req.query.token)
    };
    db2.getUserContactAndContactInfo_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.get("/api/poll/get/pinimage", function (req, res) {
    //api/get/pins/?pin_id=3&user_id=1
    var data = {
        userId: req.query.user_id,
        pinId: req.query.pin_id,
        path: req.query.photo_path,
        token_e: req.query.token,
        token_d: decrypt(req.query.token)
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
});

app.get("/api/poll/get/clientconnectedcontacts", function (req, res) {
    var data = {
        userId: req.query.user_id,
        timestamp: req.query.time_stamp,
        token_e: req.query.token,
        token_d: decrypt(req.query.token)
    };
    db2.getUserConnectedContacts_poll(data, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.get("/api/get/types", function (req, res) {
    db2.getTypes(null, function (err, result) {
        res.send(result);
    });
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
            for (var i in result) {
                if (result.hasOwnProperty(i)) {
                    if (bcrypt.compareSync(data.password, result[i]["pword"])) {
                        result[i]["token"] = encrypt(result[i]["email"]);
                        res.send(result);
                    }
                    else {
                        res.send([]);
                    }
                }
            }
            res.send([]);
        }
    });
});

app.get("/api/get/pinimage", function (req, res) {
    //api/get/pins/?pin_id=3&user_id=1
    var data = {
        userId: req.query.user_id,
        pinId: req.query.pin_id,
        token_e: req.query.token,
        token_d: decrypt(req.query.token)
    };
    db2.getPinPhoto(data, function (err, result) {
        if (result.length >= 1) {
            res.sendfile(__dirname + '/public/uploads/' + result[0].photo_path);
        }
        else {
            res.status(404).send();
        }
    });
});

//server first
app.get("/api/get/register", function (req, res) {
    var password = bcrypt.hashSync();
    var data = {
        username: req.query.username,
        email: req.query.email,
        pword: bcrypt.hashSync(req.query.password),
        defname: req.query.defaultName,
        timestamp: getTimestamp(),
        token: encrypt(req.query.email)
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
});

//==========POST=================

app.post("/api/poll/post/info", function (req, res) {
    //{type:1, user_id:3,info:"svenroy", detail:"facebook.com/svenroy"}
    var data = {
        guid: req.body.guid,
        type: req.body.type,
        user: req.body.user_id,
        info: req.body.info,
        detail: req.body.detail,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };
    if (data.info !== "") {
        db2.insertInfo_poll(data, function (err, result) {
            if (err) {
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
    var data = {
        user: req.body.user_id,
        pin: getPin(),
        name: req.body.name,
        imagePath: "",
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };

    if (req.files && req.files.image) {
        data.imagePath = req.files.image.path.split('\\');
        data.imagePath = data.imagePath[(data.imagePath.length - 1)];
    }

    db2.insertPin(data, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured inserting information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

app.post("/api/poll/post/pininfo", function (req, res) {
    var data = {
        guid: req.body.guid,
        userId: req.body.user_id,
        pinId: req.body.pin_id,
        infoId: req.body.info_id,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };
    db2.insertPinInfo_poll(data, function (err, result) {
        if (err) {
            res.status(404).send({ success: 'false', error: 'An error occured inserting information' });
        }
        else {
            res.status(200).send(result); //{id:, ts:}
        }
    });
});

//server first
app.post("/api/post/contact", function (req, res) {
    var data = {
        userId: req.body.user_id,
        pin: req.body.pin,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };
    var def = [{ ts: 0 }];

    db2.insertContact(data, function (err, affectedRows) {
        if (err || affectedRows <= 0) {
            if (err) {
                res.status(404).send(def);
            }
            else {
                res.status(200).send(def);
            }
        }
        else {
            db2.getNewContactTimeStamps(data, function (err2, result2) {
                if (err2) {
                    res.status(404).send(result2);
                }
                else {
                    res.status(200).send(result2);
                }
            });
        }
    });
});

//==========PUT=================

app.put("/api/poll/put/info", function (req, res) {
    //{user_id:3,info:"svenroy", detail:"facebook.com/svenroy", server_id:4}
    var data = {
        guid: req.body.guid,
        userId: req.body.user_id,
        info: req.body.info,
        detail: req.body.detail,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };
    if (data.info !== "") {
        db2.updateInfo_poll(data, function (err, result) {
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

app.put("/api/poll/put/pin", function (req, res) {
    var data = {
        userId: req.body.user_id,
        name: req.body.name,
        guid: req.body.guid,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };
    db2.updatePin_poll(data, function (err, result) {
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
    var data = {
        userId: req.body.user_id,
        contactId: req.body.contact_id,
        canUpdate: req.body.can_update,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };

    db2.updatePinContact(data, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured updating information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

app.put("/api/poll/put/pininfo", function (req, res) {
    //this method is only used to change the 'Name' info associated with a PIN
    //a valid PIN must have only ONE name entry
    var data = {
        guid: req.body.guid,
        userId: req.body.user_id,
        pinId: req.body.pin_id,
        infoId: req.body.info_id,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };

    db2.updatePinInfo_poll(data, function (err, result) {
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
    //TODO: Delete from directory
    var data = {
        userId: req.body.user_id,
        pinId: req.body.pin_id,
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };
    db2.deletePinPhoto(data, function (err, result) {
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
    var data = {
        userId: req.body.user_id,
        pinId: req.body.pin_id,
        photoPath: "",
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };

    if (req.files && req.files.image) {
        data.photoPath = req.files.image.path.split('\\');
        data.photoPath = data.photoPath[(data.photoPath.length - 1)];
    }

    if (data.photoPath !== "") {
        db2.updatePinPhoto(data, function (err, result) {
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

app.delete("/api/poll/delete/pinInfo", function (req, res) {
    var data = {
        userId: req.body.user_id,
        pinId: req.body.pin_id,
        infoId: req.body.info_id,
        guid: req.body.guid,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
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

app.delete("/api/poll/delete/info", function (req, res) {
    //{user_id:3, server_id:4}
    //NOTE: cannot delete 'Name' info if connected to PINs or is last 'Name' info
    var data = {
        userId: req.body.user_id,
        guid: req.body.guid,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };

    db2.deleteInfo_poll(data, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured deleting information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

app.delete("/api/poll/delete/pin", function (req, res) {
    var data = {
        userId: req.body.user_id,
        pinId: req.body.guid,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };

    db2.deletePin_poll(data, function (err, result) {
        if (err) {
            res.status(404).send({ error: 'An error occured deleting information' });
        }
        else {
            res.send({ success: 'true' });
        }
    });
});

app.delete("/api/poll/delete/contact", function (req, res) {
    var data = {
        userId: req.body.user_id,
        guid: req.body.guid,
        timestamp: getTimestamp(),
        token_e: req.body.token,
        token_d: decrypt(req.body.token)
    };

    db2.deleteContact_poll(data, function (err, result) {
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

var encrypt = function(text){
    var cipher = crypto.createCipher('aes-256-cbc', secret);
    var c = cipher.update(text, 'utf8', 'hex');
    c += cipher.final('hex');
    return c;
};

var decrypt = function(text){
    var decipher = crypto.createDecipher('aes-256-cbc', secret);
    var d = decipher.update(text, 'hex', 'utf8');
    d += decipher.final('utf8');
    return d;
};

//==========SERVER=================

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
var types = [{ id: '1', name: 'Address', icon_name: '198,24,0', phone_url: '' },
{ id: '2', name: 'BBM', icon_name: '198,24,0', phone_url: '' },
{ id: '3', name: 'Email', icon_name: '198,24,0', phone_url: 'mailto:' },
{ id: '4', name: 'Facebook', icon_name: '59,89,152', phone_url: 'fb:' },
{ id: '5', name: 'Instagram', icon_name: '47,11,11', phone_url: '' },
{ id: '6', name: 'Name', icon_name: '198,24,0', phone_url: '' },
{ id: '7', name: 'Phone', icon_name: '140,198,63', phone_url: 'tel:,sms:,facetime:,' },
{ id: '8', name: 'Pinterest', icon_name: '201,34,40', phone_url: 'pinit12:' },
{ id: '9', name: 'Skype', icon_name: '18,165,244', phone_url: 'skype:' },
{ id: '10', name: 'Twitter', icon_name: '29,202,255', phone_url: 'twitter:' },
{ id: '11', name: 'Whatsapp', icon_name: '198,24,0', phone_url: '' }];

types.forEach(function (data) {
    db2.insertTypeOnStartUp(data, function (err, result) {
        if (err) {
            throw err;
        }
    });
});