var fs = require('fs');
var path = require('path');

var config = {
    root: '.',
    index: 'index.html',
    port: 3000
};
require('http').createServer(function (request, response) {
    var file = path.normalize(config.root + request.url);
    file = (file == config.root + '/') ? file + config.index : file;

    console.log('Trying to serve: ', file);

    function showError(error) {
        console.log(error);
        response.writeHead(500);
        response.end('Internal Server Error');
    }
    fs.exists(file, function (exists) {
        if (exists) {
            fs.stat(file, function (error, stat) {
                var readStream;
                if (error) {
                    return showError(error);
                }
                if (stat.isDirectory()) {
                    response.writeHead(403);
                    response.end('Forbidden');
                }
                else {
                    readStream = fs.createReadStream(file);

                    readStream.on('error', showError);

                    response.writeHead(200);
                    readStream.pipe(response);
                }
            });
        }
        else {
            response.writeHead(404);
            response.end('Not found');
        }
    });

}).listen(config.port, function() {
    console.log('Server running at http://localhost:%d', config.port);
});
