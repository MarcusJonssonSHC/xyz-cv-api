'use strict';

// middleware
exports.errorFilter = function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal server error.');
};
