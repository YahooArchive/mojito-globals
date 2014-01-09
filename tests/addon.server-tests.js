/*globals YUI, YUITest*/

YUI.add('mojito-globals-addon-tests', function (Y, NAME) {
    'use strict';

    var A = YUITest.Assert,
        O = YUITest.ObjectAssert,
        suite = new YUITest.TestSuite(NAME),
        req = {},
        command = {},
        adapter = {},
        ac;

    suite.add(new YUITest.TestCase({

        name: 'unit tests',

        setUp: function () {

            ac = new Y.mojito.MockActionContext({
                addons: ['http']
            });

            ac.http.expect({
                method: 'getRequest',
                returns: req
            });

            ac.globals = new Y.mojito.addons.ac.globals(command, adapter, ac);
        },

        'remove() should return false when removing a key that has not been set': function () {
            A.isFalse(ac.globals.remove('foo'));
        },

        'remove() should return true when removing a key that has been set': function () {
            ac.globals.set('foo', 'whatever');
            A.isTrue(ac.globals.remove('foo'));
        },

        'get() should return "undefined" when requesting a key that has not been set': function () {
            A.isUndefined(ac.globals.get('foo'));
        },

        'get() should return the specified default value when requesting a key that has not been set': function () {
            A.areSame('whatever', ac.globals.get('foo', 'whatever'));
        },

        'set() should set the value of the specified key': function () {
            A.isTrue(ac.globals.set('foo', 'whatever'));
            A.areSame('whatever', ac.globals.get('foo'));
            ac.globals.remove('foo');
        },

        'set() should return false if the specified key is not a string': function () {
            A.isFalse(ac.globals.set(123, 'whatever'));
            A.isFalse(ac.globals.set({}, 'whatever'));
        },

        'set() should override the value of a key if that key was already set': function () {
            ac.globals.set('foo', 'original');
            ac.globals.set('foo', 'overridden');
            A.areSame('overridden', ac.globals.get('foo'));
            ac.globals.remove('foo');
        },

        'getAll() should return all the keys that have been set': function () {
            var all = ac.globals.getAll();

            A.isObject(all);
            O.ownsNoKeys(all);

            ac.globals.set('foo', 'whatever');
            ac.globals.set('bar', 'whatever');

            all = ac.globals.getAll();

            A.isObject(all);
            O.ownsKeys(['foo', 'bar'], all);

            ac.globals.remove('foo');
            ac.globals.remove('bar');
        },

        'has() should return if a key is set, false otherwise': function () {
            A.isFalse(ac.globals.has('foo'));
            ac.globals.set('foo', 'whatever');
            A.isTrue(ac.globals.has('foo'));
            ac.globals.remove('foo');
            A.isFalse(ac.globals.has('foo'));
        }
    }));

    YUITest.TestRunner.add(suite);

}, '1.0.0', {
    requires: ['mojito-globals-addon']
});
