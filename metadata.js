'use strict'

var fs = require('fs'),
    path = require('path'),
    loging = require(path.join(__dirname, 'login.config.js')),
    jsforce = require('jsforce'),
    conn = new jsforce.Connection({ loginUrl: loging.url }),
    staticResourceConfig = require(path.join(__dirname, 'sr.config.js'));

var deploy = function() {
	
    var createStaticResource = function(resp) {
        console.log(resp);
        var bitmap, base64Buf, metadata;
        var pathFile = path.join(__dirname, 'dist', staticResourceConfig.fullName + '.zip');

        bitmap = fs.readFileSync(pathFile);
        // convert binary data to base64 encoded string
        base64Buf = new Buffer(bitmap).toString('base64');
        metadata = [{
            fullName: staticResourceConfig.fullName,
            content: base64Buf,
            contentType: staticResourceConfig.contentType,
            description: staticResourceConfig.description,
            cacheControl: staticResourceConfig.cacheControl
        }];
        return metadata;
    };

    var upsertStaticResource = function(mdPkg) {
        return conn.metadata.upsert('StaticResource', mdPkg)
    }

    conn.login(loging.us, loging.pw)
    .then(createStaticResource)
    .then(upsertStaticResource)
    .then(function(res) { console.log(res); })
    .catch(function(res) { console.log(res); });
}


module.exports = {
    deploy: deploy
};
