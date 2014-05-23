var edge = require('edge');

exports.db2 = (function () {
    var out = {};
    var connStr = 'Data Source=SVENROY-PC;Initial Catalog=atOne;Persist Security Info=True;User ID=sa;Password=sa';
    //var connStr = 'Server=tcp:olowchowf1.database.windows.net,1433;Database=AtOneDB;User ID=svenroy@olowchowf1;Password=sv3Nroy7;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;';

    out.insertTypeOnStartUp = edge.func('sql', {
        source: function () {/*
            insert into type select @id, @name, @icon_name, @phone_url
            where not exists (select top 1 id from type where id = @id)
        */},
        connectionString: connStr
    });

    out.getUserInfo_poll = edge.func('sql', {
        source: function () {/*
            SELECT id, type_fk, info, more, ts, is_deleted FROM info WHERE [user] = @userId AND ts > @timestamp
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e)
        */},
        connectionString: connStr
    });

    out.getUserPins_poll = edge.func('sql', {
        source: function () {/* 
            SELECT id, pin, name, ts, is_deleted FROM pin WHERE [user] = @userId AND ts > @timestamp
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e)
        */},
        connectionString: connStr
    });

    out.getUserPinsInfo_poll = edge.func('sql', {
        source: function () {/* 
            SELECT pi.id, pi.pin, pi.info, pi.ts, pi.is_deleted FROM pins_info pi
            INNER JOIN pin p ON p.id = pi.pin
            WHERE p.[user] = @userId AND pi.ts > @timestamp
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e)
        */},
        connectionString: connStr
    });

    out.getUserContacts_poll = edge.func('sql', {
        source: function () {/* 
            SELECT c.id, p.id AS 'pin_id', p.pin, c.is_deleted, c.ts FROM contact c
            INNER JOIN pin p ON p.id = c.pin
            WHERE c.[user] = @userId AND c.ts > @timestamp
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e)
        */},
        connectionString: connStr
    });

    out.getUserContactsInfo_poll = edge.func('sql', {
        source: function () {/* 
            SELECT i.id, c.id as 'contact_id', i.type_fk, i.info, i.more, i.ts, i.is_deleted FROM info i
            INNER JOIN pins_info pi ON pi.info = i.id
            INNER JOIN contact c ON c.pin = pi.pin
            WHERE c.[user] = @userId AND i.ts > @timestamp
            AND c.can_update = 1
        */},
        connectionString: connStr
    });

    out.getUserContactAndContactInfo_poll = edge.func('sql', {
        source: function () {/* 
            SELECT pi.id, c.id AS 'contact_id', i.id AS 'info_id', pi.ts, pi.is_deleted FROM contact c
            INNER JOIN pins_info pi ON pi.pin = c.pin
            INNER JOIN info i ON i.id = pi.info
            WHERE c.[user] = @userId AND pi.ts > @timestamp AND c.is_deleted = 0
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e)
        */},
        connectionString: connStr
    });

    out.getUserConnectedContacts_poll = edge.func('sql', {
        source: function () {/* 
            SELECT c.id, c.pin, u.id as 'user_id', u.username, c.can_update, c.is_deleted, c.ts
            FROM contact c
            INNER JOIN pin p ON p.id = c.pin
            INNER JOIN [user] u ON u.id = c.[user]
            WHERE p.[user] = @userId AND c.ts > @timestamp
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e)     
        */},
        connectionString: connStr
    });

    out.getUserByLoginAndPassword = edge.func('sql', {
        source: function () {/* 
            SELECT TOP 1 * FROM [user] WHERE (email = @login OR username = @login)
        */},
        connectionString: connStr
    });

    out.getPinPhoto = edge.func('sql', {
        source: function () {/* 
            SELECT TOP 1 c.id, p.photo_path FROM contact c
            INNER JOIN pin p ON p.id = c.pin
            WHERE c.[user] = @userId AND c.pin = @pinId
            UNION SELECT TOP 1 u.id, p.photo_path FROM [user] u
            INNER JOIN pin p ON p.[user] = u.id
            WHERE u.id = @userId AND p.id = @pinId
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e)
        */},
        connectionString: connStr
    });

    out.getTypes = edge.func('sql', {
        source: function () {/* 
            SELECT id, name, icon_name, phone_url FROM [type]
        */},
        connectionString: connStr
    });

    out.getExistingUser = edge.func('sql', {
        source: function () {/* 
            SELECT '1' AS 'table' FROM [user] WHERE LOWER(@username) = LOWER(username)
            UNION SELECT '2' FROM [user] WHERE LOWER(@email) = LOWER(email)
        */},
        connectionString: connStr
    });

    out.insertUser = edge.func('sql', {
        source: function () {/* 
            INSERT INTO [user] VALUES(CAST(NEWID() AS NCHAR(36)), @username, @email, @pword, GETDATE());     
            INSERT INTO info SELECT CAST(NEWID() AS NCHAR(36)), (SELECT TOP 1 u.id FROM [user] u WHERE LOWER(u.username) = @username),
	            (SELECT t.id FROM type t WHERE LOWER(t.name) = 'name'), @defname, '', @timestamp, 0
            WHERE 
	            EXISTS(SELECT u.id FROM [user] u WHERE LOWER(u.username) = LOWER(@username));
            INSERT INTO token VALUES(@token_e)  
        */},
        connectionString: connStr
    });

    out.getUserByUsernameAndEmail = edge.func('sql', {
        source: function () {/* 
            SELECT TOP 1 id, @token_e AS 'token' FROM [user] WHERE username = @username AND email = @email 
        */},
        connectionString: connStr
    });

    out.insertInfo_poll = edge.func('sql', {
        source: function () {/* 
            INSERT INTO info SELECT @guid, @user, @type, @info, @detail, @timestamp, 0
            WHERE
	            EXISTS (SELECT id FROM type WHERE id = @type) AND EXISTS (SELECT id FROM [user] WHERE id = @user) 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e)
        */},
        connectionString: connStr
    });

    out.insertPin = edge.func('sql', {
        source: function () {/* 
            INSERT INTO pin SELECT CAST(NEWID() AS NCHAR(36)), @user, @pin, @name, @imagePath, @timestamp, 0
            WHERE
                EXISTS (SELECT id FROM [user] WHERE id = @user) AND NOT EXISTS (SELECT id FROM pin WHERE LOWER(pin) = LOWER(@pin))
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);

            INSERT INTO pins_info SELECT CAST(NEWID() AS NCHAR(36)), (SELECT TOP 1 p.id FROM pin p WHERE LOWER(p.pin) = LOWER(@pin)),
                                (SELECT TOP 1 i.id FROM info i INNER JOIN type t ON i.type_fk = t.id WHERE i.[user] = @user AND LOWER(t.name) = 'name'),
                                @timestamp, 0
            WHERE
                EXISTS(SELECT TOP 1 i.id FROM info i INNER JOIN type t ON i.type_fk = t.id WHERE i.[user] = @user AND LOWER(t.name) = 'name')
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e); 
        */},
        connectionString: connStr
    });

    out.insertPinInfo_poll = edge.func('sql', {
        source: function () {/* 
            INSERT INTO pins_info SELECT @guid, @pinId, @infoId, @timestamp, 0
            WHERE
	            EXISTS(SELECT TOP 1 id FROM pin WHERE id = @pinId AND [user] = @userId AND is_deleted = 0)
	            AND EXISTS(SELECT TOP 1 id FROM info WHERE id = @infoId AND [user] = @userId AND is_deleted = 0)
	            AND NOT EXISTS(SELECT TOP 1 id FROM pins_info WHERE pin = @pinId AND info = @infoId AND is_deleted = 0)  
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.insertContact = edge.func('sql', {
        source: function () {/*
            INSERT INTO contact SELECT CAST(NEWID() AS NCHAR(36)), (SELECT TOP 1 id FROM pin WHERE LOWER(pin) = LOWER(@pin)), @userId, 1, 0, @timestamp
            WHERE 
	            EXISTS (SELECT TOP 1 id FROM pin WHERE LOWER(pin) = LOWER(@pin) AND [user] <> @userId)
	            AND NOT EXISTS (SELECT TOP 1 c.id FROM contact c
		            INNER JOIN pin p ON p.id = c.pin
		            WHERE LOWER(p.pin) = LOWER(@pin) AND c.[user] = @userId AND c.is_deleted = 0)
                AND EXISTS(SELECT TOP 1 pi.id FROM pins_info pi
                    INNER JOIN info i ON i.id = pi.info
                    WHERE pi.pin = (SELECT TOP 1 id FROM pin WHERE LOWER(pin) = LOWER(@pin))
                    AND i.type_fk = (SELECT TOP 1 id FROM type WHERE LOWER(name) = 'name'))
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e); 
        */},
        connectionString: connStr
    });

    out.getNewContactTimeStamps = edge.func('sql', {
        source: function () {/* 
            SELECT MIN(i.ts) AS 'ts' FROM info i INNER JOIN pins_info pi ON pi.info = i.id
            INNER JOIN pin p ON p.id = pi.pin
            WHERE LOWER(p.pin) = LOWER(@pin)
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e)
            UNION SELECT MIN(pi.ts) FROM pins_info pi
            INNER JOIN pin p ON p.id = pi.pin
            WHERE LOWER(p.pin) = LOWER(@pin) 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e); 
        */},
        connectionString: connStr
    });

    out.updateInfo_poll = edge.func('sql', {
        source: function () {/* 
            UPDATE info SET info = @info, more = @detail, ts = @timestamp WHERE id = @guid AND [user] = @userId 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.updatePin_poll = edge.func('sql', {
        source: function () {/* 
            UPDATE pin SET name = @name, ts = @timestamp WHERE [user] = @userId AND id = @guid 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.updatePinContact = edge.func('sql', {
        source: function () {/* 
            UPDATE contact SET contact.can_update = @canUpdate, ts = @timestamp
            WHERE contact.id = @contactId
            AND EXISTS(SELECT TOP 1 p.id FROM pin p WHERE p.[user] = @userId AND p.id = contact.pin) 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.updatePinInfo_poll = edge.func('sql', {
        source: function () {/* 
            UPDATE pins_info SET info = @infoId, ts = @timestamp 
            WHERE id = @guid
	            AND EXISTS(SELECT TOP 1 id FROM info WHERE id = @infoId AND [user] = @userId)
	            AND EXISTS(SELECT TOP 1 id FROM pin WHERE id = @pinId AND [user] = @userId)
	            AND NOT EXISTS (SELECT TOP 1 id FROM pins_info WHERE pin = @pinId AND info = @infoId) 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.deletePinPhoto = edge.func('sql', {
        source: function () {/* 
            UPDATE pin SET photo_path = null WHERE id = @pinId AND [user] = @userId 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.updatePinPhoto = edge.func('sql', {
        source: function () {/* 
            UPDATE pin SET photo_path = @photoPath WHERE [user] = @userId AND id = @pinId 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.deletePinInfo_poll = edge.func('sql', {
        source: function () {/* 
            UPDATE pins_info
            SET is_deleted = 1, ts = @timestamp
            WHERE pin = @pinId AND info = @infoId AND id = @guid
            AND EXISTS(SELECT TOP 1 id FROM pin WHERE id = @pinId AND [user] = @userId)
            AND EXISTS(SELECT TOP 1 id FROM info WHERE id = @infoId AND [user] = @userId) 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.deleteInfo_poll = edge.func('sql', {
        source: function () {/* 
            UPDATE info SET is_deleted = 1, ts = @timestamp WHERE id = @guid AND [user] = @userId
                AND NOT EXISTS(SELECT TOP 1 i.id FROM info i INNER JOIN type t ON t.id = i.type_fk
                    INNER JOIN pins_info pi ON pi.info = i.id
                    WHERE i.id = @guid AND LOWER(t.name) = 'name')
                AND (SELECT COUNT(i.id) FROM info i INNER JOIN type t ON t.id = i.type_fk WHERE LOWER(t.name) = 'name'
					AND EXISTS(SELECT i.id FROM info i INNER JOIN type t ON t.id  = i.type_fk
					WHERE i.id = @guid AND LOWER(t.name) = 'name') AND i.[user] = @userId) <> 1 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.deletePin_poll = edge.func('sql', {
        source: function () {/* 
            UPDATE contact SET is_deleted = 1, ts = @timestamp WHERE EXISTS(SELECT TOP 1 id FROM pin p WHERE p.[user] = @userId AND p.id = @pinId) AND pin = @pinId
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
            UPDATE pins_info SET is_deleted = 1, ts = @timestamp WHERE EXISTS(SELECT TOP 1 id FROM pin p WHERE p.[user] = @userId AND p.id = @pinId) AND pin = @pinId
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
            UPDATE pin SET is_deleted = 1, ts = @timestamp WHERE id = @pinId AND [user] = @userId
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    out.deleteContact_poll = edge.func('sql', {
        source: function () {/* 
            UPDATE contact SET is_deleted = 1, ts = @timestamp WHERE id = @guid AND [user] = @userId 
                AND EXISTS (SELECT TOP 1 * FROM token WHERE Token = @token_e);
        */},
        connectionString: connStr
    });

    return out;
}());

