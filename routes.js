var pg = require('pg');
var config = require('./config');
var geocode = require('./routes/geocoding');
var connectionString = 'postgres://' + config.db.username + ':' + config.db.password + '@' + config.db.host + '/' + config.db.database;

function coordinates(app) {

    //enable CORS
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    //the main route
    app.get('/places/:srid/:neLat/:neLng/:swLat/:swLng', function(req, res, next) {
        pg.connect(connectionString, function(err, client, done) {
            var handleError = function(err) {
                // no error occurred, continue with the request
                if (!err) return false;
                //return the db connection to the connection pool
                done(client);
                res.writeHead(500, {
                    'content-type': 'text/html'
                });
                res.end('An error occurred ' + err);
                return true;
            };
            if (handleError(err)) return;
            //using prepared statement to avoid SQL injection
            var result = client.query('SELECT name, ST_X(geom) as lng, ST_Y(geom) as lat FROM airports where ST_Contains(ST_MakeEnvelope($1, $2, $3, $4, $5),ST_SetSRID(geom,$5))', [req.params.neLat, req.params.neLng, req.params.swLat, req.params.swLng, req.params.srid], function(err) {
                //return the db connection to the connection pool
                done();
                if (handleError(err)) return;
            });

            var json = {
                response: []
            };
            //generate the response
            result.on('row', function(row) {
                json.response.push({
                    "name": row.name,
                    "lng": row.lng,
                    "lat": row.lat
                });

            });
            //end the response
            result.on('end', function(err, result) {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(json) + '\n');
            });

        });

    });

    app.get('/geocode', geocode.controller);
}

exports.coordinates = coordinates;