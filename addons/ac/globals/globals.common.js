/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint node: true, nomen:true, indent: 4, plusplus: true */
/*global YUI */

(function () {
    'use strict';

    var Globals = function (store) {
        if (typeof store.globals === 'undefined') {
            store.globals = {};
        }
        this.store = store.globals;
    };

    Globals.prototype = {

        getAll: function () {
            return this.store;
        },

        get: function (key, defaultValue) {
            var self = this;
            return self.has(key) ? self.store[key] : defaultValue;
        },

        set: function (key, value) {
            var self = this;

            if (typeof key === 'string') {
                self.store[key] = value;
                return true;
            }

            return false;
        },

        has: function (key) {
            return this.store.hasOwnProperty(key);
        },

        remove: function (key) {
            if (this.has(key)) {
                delete this.store[key];
                return true;
            }

            return false;
        }
    };

    if (typeof YUI !== 'undefined') {

        // Act like an addon if YUI is present

        YUI.add('yahoo.addons.globals', function (Y, NAME) {

            function Addon(command, adapter, ac) {
                // Y.Global.yahoo should only be defined on the client
                var store = Y.Global && Y.Global.yahoo ?
                                Y.Global.yahoo :
                                ac.http.getRequest();

                Addon.superclass.constructor.call(this, store);
            }

            Y.extend(Addon, Globals, {
                namespace: 'globals'
            });

            Y.mojito.addons.ac.globals = Addon;

        }, '0.0.1', {
            requires: ['oop', 'mojito-http-addon']
        });

    } else if (typeof module !== 'undefined') {

        // Otherwise act like a module

        module.exports = Globals;
    }

}());
