/* jshint node: true */

var EventEmitter = require('events'),
    util = require('util'),
    should = require('should'),
    Device = require('../lib/device.js'),
    Gadget = require('../lib/gadget.js'),
    Netcore = require('../lib/netcore.js'),
    _ = require('lodash');

var fb = Object.create(new EventEmitter());

var ncname = 'mync';
var controller = {};
var protocol = {
    phy: 'myphy',
    nwk: 'mynwk'
};
var opt = {};

var nc = new Netcore(ncname, controller, protocol, opt);
nc._fb = fb;

// var netMandatoryDrvs = [ 'start', 'stop', 'reset', 'permitJoin', 'remove', 'ping' ],
//     netOptionalDrvs = [ 'ban', 'unban' ],
//     devMandatoryDrvs = [ 'read', 'write' ],
//     devOptionalDrvs = [ 'identify' ],
//     gadMandatoryDrvs = [ 'read', 'write' ],
//     gadOptionalDrvs = [ 'exec', 'setReportCfg', 'getReportCfg' ];

nc.registerNetDrivers({
    start: function (cb) { return cb(null); },
    stop: function (cb) { return cb(null); },
    reset: function (mode, cb) { 
        return cb(null, mode);
    },
    permitJoin: function (duration, cb) { return cb(null, duration); },
    remove: function (permAddr, cb) { return cb(null, permAddr);  },
    ping: function (permAddr, cb) { return cb(null, 10); }
});

nc.registerDevDrivers({
    read: function (permAddr, attr, cb) { return cb(null, 'read'); },
    write: function (permAddr, attr, val, cb) { return cb(null, 'written'); }
});

nc.registerGadDrivers({
    read: function (permAddr, auxId, attr, cb) { return cb(null, 'read'); },
    write: function (permAddr, auxId, attr, val, cb) { return cb(null, 'written'); }
});

fb.on('_nc:error', function (err) {
    console.log(err);
});

describe('Drivers test - optional', function () {
// var netMandatoryDrvs = [ 'start', 'stop', 'reset', 'permitJoin', 'remove', 'ping' ],
//     netOptionalDrvs = [ 'ban', 'unban' ],
//     devMandatoryDrvs = [ 'read', 'write' ],
//     devOptionalDrvs = [ 'identify' ],
//     gadMandatoryDrvs = [ 'read', 'write' ],
//     gadOptionalDrvs = [ 'exec', 'setReportCfg', 'getReportCfg' ];


    nc.registerNetDrivers({
        ban: function (permAddr, cb) { return cb(null, 'ban'); },
        unban: function (permAddr, cb) { return cb(null, 'unban'); }
    });

    nc.registerDevDrivers({
        identify: function (permAddr, cb) { return cb(null, 'identify'); },
    });

    nc.registerGadDrivers({
        exec: function (permAddr, auxId, attr, args, cb) { return cb(null, 'exec'); },
        setReportCfg: function (permAddr, auxId, attr, cfg, cb) { return cb(null, 'reportcfg'); },
        getReportCfg: function (permAddr, auxId, attr, cb) { return cb(null, 'reportcfg'); },
    });

    nc.enable();
    it('ban(permAddr, callback) - cb', function (done) {
        nc.ban('0x1111', function (err, d) {
            if (!err && d === '0x1111')
                done();
        });
    });

    it('ban(permAddr, callback) - lsn', function (done) {
        fb.once('_nc:netBan', function (d) {
            if (d.permAddr === '0x1111')
                done();
        });
        nc.ban('0x1111');
    });

    it('unban(permAddr, callback) - cb', function (done) {
        nc.unban('0x1111', function (err, d) {
            if (!err && d === '0x1111')
                done();
        });
    });

    it('unban(permAddr, callback) - lsn', function (done) {
        fb.once('_nc:netUnban', function (d) {
            if (d.permAddr === '0x1111')
                done();
        });
        nc.unban('0x1111');
    });

    it('identify(permAddr, callback) - cb', function (done) {
        nc.identify('0x1111', function (err, d) {
            if (!err && d === 'identify')
                done();
        });
    });


    it('gadExec(permAddr, auxId, attrName, args, callback) - cb', function (done) {
        var p = '0x1234',
            aux = 3,
            r = 33;

        nc.gadExec(p, aux, 'x', [ r ], function (err, da) {
            if (!err && da === 'exec')
                done();
        });
    });

    it('gadExec(permAddr, auxId, attrName, args, callback) - lsn', function (done) {
        var p = '0x1234',
            aux = 3,
            r = 33;

        fb.once('_nc:gadExec', function (d) {
            if (d.permAddr === p && d.auxId === aux && d.data.x === 'exec')
                done();
        });

        nc.gadExec(p, aux, 'x', [ r ], function (err, da) {});
    });

    it('setReportCfg(permAddr, auxId, attrName, cfg, callback) - cb', function (done) {
        var p = '0x1234',
            aux = 3,
            r = {};

        nc.setReportCfg(p, aux, 'x', r, function (err, da) {
            if (!err && da === 'reportcfg')
                done();
        });
    });

    it('setReportCfg(permAddr, auxId, attrName, cfg, callback) - lsn', function (done) {
        var p = '0x1234',
            aux = 3,
            r = {};

        fb.once('_nc:gadSetReportCfg', function (d) {
            if (d.permAddr === p && d.auxId === aux && d.data.x === 'reportcfg')
                done();
        });

        nc.setReportCfg(p, aux, 'x', r, function (err, da) {});
    });

    it('getReportCfg(permAddr, auxId, attrName, callback) - cb', function (done) {
        var p = '0x1234',
            aux = 3,
            r = {};

        nc.getReportCfg(p, aux, 'x', function (err, da) {
            if (!err && da === 'reportcfg')
                done();
        });
    });


    it('getReportCfg(permAddr, auxId, attrName, callback) - lsn', function (done) {
        var p = '0x1234',
            aux = 3,
            r = {};

        fb.once('_nc:gadGetReportCfg', function (d) {
            if (d.permAddr === p && d.auxId === aux && d.data.x === 'reportcfg')
                done();
        });

        nc.getReportCfg(p, aux, 'x', function (err, da) {});
    });
});
