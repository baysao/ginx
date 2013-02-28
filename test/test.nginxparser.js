var assert = require('assert'),
    path = require('path'),
    GinxParser = require('./../lib/ginxparser'),
    GinxParserTest = require('./setup/ginxparsertest');

describe('.parseLine() ', function () {
    it('should parse a line of nginx logs and return correct object', function () {
        var format = '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"';
        var parser = new GinxParser(format);
        var line = '10.100.9.92 - - [12/Nov/2012:12:11:28 -0500] "GET /favicon.ico HTTP/1.1" 502 574 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11"';
        var __file = "fakefile.jpg",
            __lastCharAt = 207,
            __originalText = line;
        parser.parseLine(line,

        function (err, row) {
            if (err) throw err;
            assert.equal('10.100.9.92', row['remote_addr']);
            assert.equal(null, row['remote_user']);
            assert.equal(new Date('12 Nov 2012 12:11:28 GMT-0500').toString(), row['time_local'].toString());
            assert.equal('GET /favicon.ico HTTP/1.1', row['request']);
            assert.equal(502, row['status']);
            assert.equal(574, row['body_bytes_sent']);
            assert.equal(null, row['http_referer']);
            assert.equal('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11', row['http_user_agent']);
            assert.equal(__file, row['__file']);
            assert.equal(__lastCharAt, row['__lastCharAt']);
            assert.equal(__originalText, row['__originalText']);
        }, {
            '__file': __file,
            '__lastCharAt': 207,
            '__originalText': __originalText
        });
    });
});

describe('GinxParser', function () {
    describe('.parseDir() ', function () {
        it('should parse a directory of nginx logs and store their cursor values', function () {
            var parser = new GinxParser();
            parser.parseDir(path.join(__dirname, "/logs"),

            function (err, row) {
                if (err) throw err;
            },

            function (file) {
                console.log("[GINXPARSER-DEBUG] " + file + " parsing completed in ParseDir()");
                assert.equal("number", typeof parser.__mem.cursors[parser.getStorageKeyfromPath(file)]);
            });
        });
    });

    describe('.parseFile() ', function () {
        it('should parse an nginx log file and store their cursor values', function () {
            var parser = new GinxParser();
            parser.parseFile(path.join(__dirname, "/logs/nginx_prod-small.log"),

            function (err, row) {
                if (err) throw err;
            },

            function (file) {
                console.log("[GINXPARSER-DEBUG] " + file + " parsing completed in ParseDir()");
                assert.equal("number", typeof parser.__mem.cursors[parser.getStorageKeyfromPath(file)]);
            });
        });
    });
});