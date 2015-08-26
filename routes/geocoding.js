/**
 * Created by anatoly on 8/24/15.
 */
var pg = require('pg');
var config = require('../config');
var connectionString = 'postgres://' + config.db.username + ':' + config.db.password + '@' + config.db.host + '/' + config.db.database;

var handleError = function(err, res, client) {
  // no error occurred, continue with the request
  if (!err) {
    return false;
  }
  //return the db connection to the connection pool
  res.status(500).json({
    status: 'ERROR',
    message: 'An error occurred',
    detail: err
  });
  return true;
};

// expects *address* querystring parameter,
// if optional *limit* param is passed, it's used to limit the query to the state passed in the param
// sample query:
//  http://localhost:1337/geocode?address=425%20se%2011th%20ave%20portland%20or&limit_state=OR
exports.controller = function (req, res, next) {
  var dt = +new Date();
  pg.connect(connectionString, function(err, client, done) {

    if (handleError(err, res)) {
      if (client) {
        done(client);
      }
      return;
    }

    var handler = function(err) {
      //return the db connection to the connection pool
      done();
      if (handleError(err, res)) {
        if (client) {
          done(client);
        }
      }
    };

    //using prepared statement to avoid SQL injection
    var result = null;
    if (req.query.limit) {
      result = client.query(
        "SELECT g.rating, ST_X(g.geomout) As lon, ST_Y(g.geomout) As lat,"
        + " (addy).address As street_no, (addy).predirAbbrev pre_address_abbrev, (addy).streetname As street_name, "
        + " (addy).postdirAbbrev post_address_abbrev, (addy).streettypeabbrev As street_type_abbrev, (addy).internal, "
        + " (addy).location As city, (addy).stateabbrev As state, (addy).zip, pprint_addy(addy) pretty "
        + " FROM tiger.state state"
        + " JOIN geocode($1, 5, state.the_geom) As g on 1=1"
        + " WHERE state.stusps = $2 and rating < 5 order by rating asc", [req.query.address, req.query.limit], handler);
    }
    else {
      result = client.query(
        "SELECT g.rating, ST_X(g.geomout) As lon, ST_Y(g.geomout) As lat,"
        + " (addy).address As street_no, (addy).predirAbbrev pre_address_abbrev, (addy).streetname As street_name, "
        + " (addy).postdirAbbrev post_address_abbrev, (addy).streettypeabbrev As street_type_abbrev, (addy).internal, "
        + " (addy).location As city, (addy).stateabbrev As state, (addy).zip, pprint_addy(addy) pretty "
        + "FROM geocode($1) As g where rating < 5 order by rating asc", [req.query.address], handler);
    }
    var json = {
      results: [],
      status: 'OK'
    };

    //generate the response
    result.on('row', function(row) {
      json.results.push({
        "lon": row.lon,
        "lat": row.lat,
        "pretty": row.pretty,
        "rating": row.rating,
        "address": {
          street_no: row.street_no,
          pre_address_abbrev: row.pre_address_abbrev,
          street_name: row.street_name,
          street_type: row.street_type_abbrev,
          post_address_abbrev: row.post_address_abbrev,
          city: row.city,
          state: row.state,
          zip: row.zip
        }
      });
    });

    //end the response
    result.on('end', function(err, result) {
      json.took = +new Date() - dt;
      console.log('took', json.took);
      res.status(200).json(json);
    });

  });
};