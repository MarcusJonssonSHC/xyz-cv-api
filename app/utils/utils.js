'use strict';

var q = require('q');

exports.extractPropertiesFromConnectors = function(property, connectors, extraProps) {
    return q.promise(function(resolve) {
        var list = [];
        connectors.forEach(function(connector) {
            var object = {};
            object._id = connector[property];
            if (extraProps) {
                extraProps.forEach(function(prop) {
                    object[prop] = connector[prop];
                });
            }

            list.push(object);
        });

        return resolve(list);
    });
};

exports.extractPropertyFromList = function(property) {
    return function(items) {
        return q.promise(function(resolve) {
            var list = [];
            items.forEach(function(item) {

                list.push(item[property]);
            });

            return resolve(list);
        });
    };
};

exports.matchListAndObjectIds = function(list) {
    return function(objects) {
        return q.promise(function(resolve) {
            var items = [];
            objects.forEach(function(object) {
                list.some(function(item) {
                    if (object._id === item._id) {
                        items.push(mergeProperties(object, item));
                        return true;
                    }

                });
            });

            q.all(items)
                .then(resolve);
        });
    };
};

exports.sortListByProperty = function(list, prop) {
    return q.promise(function(resolve) {
        list.sort(function(a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            }

            if (a[prop] < b[prop]) {
                return -1;
            }

            return 0;
        });

        return resolve(list);
    });
};

// HELPER
// ============================================================================

function listContainsId(list, id) {
    return list.indexOf(id) > -1;
}

function mergeProperties(from, to) {
    return q.promise(function(resolve) {
        for (var prop in from) {
            if (from.hasOwnProperty(prop)) {
                to[prop] = from[prop];
            }
        }

        return resolve(to);
    });
}
