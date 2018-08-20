/**Library for storing and rotating logs**/

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

let lib = {};

lib.baseDir = path.join(__dirname, '/../.logs/');

//Append string to file. Create it if not exists
lib.append = function(file, str, callback) {
    //Opening the file for appending
    fs.open(lib.baseDir + file + '.log', 'a', function(err, fileDescriptor) {
        if (err || !fileDescriptor) {
            return callback('Could not open file for appending');
        }

        fs.appendFile(fileDescriptor, str + '\n', function(err) {
            if (err) {
                return callback('Error appending to file');
            }

            fs.close(fileDescriptor, function(err) {
                if (err) {
                    return callback('Error closing file taht was being appended');
                }

                callback(false);
            })
        });
    });
};

//List all the logs and optionally include compress logs
lib.list = function(includeCompressedLogs, callback) {
    fs.readdir(lib.baseDir, function(err, data) {
        if (err || !data || data.length <= 0) {
            return callback(err, data);
        }

        let trimmedFileNames = [];
        data.forEach(function(fileName) {
            //Add the .log files
            if (fileName.indexOf('.log') > -1) {
                trimmedFileNames.push(fileName.replace('.log', ''));
            }

            //Add on the .gz

            if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
                trimmedFileNames.push(fileName.replace('.gz.b64', ''));
            }

            callback(false, trimmedFileNames);

        });
    });
};

lib.compress = function(logId, newFileId, callback) {
    let sourceFile = logId + '.log';
    let destinationFile = newFileId + '.gz.b64';

    fs.readFile(lib.baseDir + sourceFile, 'utf8', function(err, inputString) {
        if (err || !inputString) {
            return callback(err);
        }

        //compress string
        zlib.gzip(inputString, function(err, buffer) {
            if (err || !buffer) {
                return callback(err);
            }

            fs.open(lib.baseDir + destinationFile, 'wx', function(err, fileDescriptor) {
                if (err || !fileDescriptor) {
                    return callback(err);
                }

                fs.writeFile(fileDescriptor, buffer.toString('base64'), function(err) {
                    if (err) {
                        return callback(err);
                    }

                    fs.close(fileDescriptor, function(err) {
                        if (err) {
                            return callback(err);
                        }

                        callback(false);
                    });
                })
            });
        });
    });
};

lib.decompress = function(fileId, callback) {
    let fileName = fileId + '.gz.b64';
    fs.readFile(baseDir + fileName, 'utf8', function(err, str) {
        if (err || !str) {
            return callback(err);
        }

        let inputBuffer = Buffer.from(str, 'base64');
        zlib.unzip(inputBuffer, function(err, outputBuffer) {
            if (err || !outputBuffer) {
                return callback(err);
            }

            let str = outputBuffer.toString();
            callback(false, str);
        });

    });

};

lib.truncate = function(logId, callback) {
    fs.truncate(lib.baseDir + logId + '.log', 0, function(err) {
        if (err) {
            return callback(err);
        }

        callback(false);
    });
};

module.exports = lib;