const
    winston = require('winston'),
    expressWinston = require('express-winston');

const
    loggers = {};

exports.log = (name) => {

    if( loggers[name] )
        return loggers[name];

    loggers[name] = new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                timestamp: function() {
                    return new Date().toISOString();
                },
                label: name
            })
        ],
        exitOnError: false
    });

    return loggers[name];
};

exports.http  = expressWinston.logger({
      transports: [
          new winston.transports.Console({
              colorize: true,
              timestamp: function() {
                  return new Date().toISOString();
              },
              label: "http"
          })
      ],
      meta: false, // optional: control whether you want to log the meta data about the request (default to true)
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
  });
