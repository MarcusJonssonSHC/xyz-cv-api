'use strict';

var path = require('path');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var attributeRoutes = require('./routes/attribute.routes')(express.Router());
var userRoutes = require('./routes/user.routes')(express.Router());
var roleRoutes = require('./routes/role.routes')(express.Router());
var skillRoutes = require('./routes/skill.routes')(express.Router());
var skillGroupRoutes = require('./routes/skillGroup.routes')(express.Router());
var officeRoutes = require('./routes/office.routes')(express.Router());

var roleToAttributeConnectorRoutes = require('./routes/roleToAttributeConnector.routes')(express.Router());
var userToSkillConnectorRoutes = require('./routes/userToSkillConnector.routes.js')(express.Router());
var skillToSkillGroupConnectorRoutes = require('./routes/skillToSkillGroupConnector.routes.js')(express.Router());
var userToOfficeConnectorRoutes = require('./routes/userToOfficeConnector.routes.js')(express.Router());

var errorMiddleware = require('./middleware/error.middleware');
var authenticationMiddleware = require('./middleware/authentication.middleware');
var responseMiddleware = require('./middleware/response.middleware');

var config = require('config');

var app = express();

// CONFIG
// ============================================================================
var port = process.env.PORT || 9000;

app.set('superSecret', config.SECRET);

// json
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// logging
app.use(morgan('dev'));

// ROUTES & MIDDLEWARE
// ============================================================================
app.use(authenticationMiddleware.authentication);
app.use(responseMiddleware.nocache);
app.use(responseMiddleware.accessControl);

app.use('/attribute', attributeRoutes);
app.use('/user', userRoutes);
app.use('/role', roleRoutes);
app.use('/skill', skillRoutes);
app.use('/skillGroup', skillGroupRoutes);
app.use('/office', officeRoutes);

app.use('/roleToAttributeConnector', roleToAttributeConnectorRoutes);
app.use('/userToSkillConnector', userToSkillConnectorRoutes);
app.use('/skillToSkillGroupConnector', skillToSkillGroupConnectorRoutes);
app.use('/userToOfficeConnector', userToOfficeConnectorRoutes);

app.use(errorMiddleware.errorFilter);

// for debugging
app.get('/kalle', function(req, res) {
    res.send('Your email is: ' + req.headers['x-forwarded-email'] + ' and your accname: ' + req.headers['x-forwarded-user']);
});

var server = app.listen(port, function() {
    console.log('Server started: http://localhost:%s/', server.address().port);
});
