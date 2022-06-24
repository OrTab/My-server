const fs = require('fs');
const path = require('path');
const http = require('http');


const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const handlers = {
    get: {},
    post: {},
    put: {},
    delete: {}
}

const splitRouteParams = (route) => {
    return route.split(/[/:/\s]/).filter(x => x !== '');
}

const handleRoute = ({ route, method, callback }) => {
    const [baseRoute, ...params] = splitRouteParams(route);
    handlers[method][baseRoute + params.length] = {
        params,
        callback
    }
}

const createServer = () => {
    const app = {
        get(route, callback) {
            handleRoute({
                route,
                method: 'get',
                callback
            })
        },
        post(route, callback) {
            handleRoute({
                route,
                method: 'post',
                callback
            })
        },
        put(route, callback) {
            handleRoute({
                route,
                method: 'put',
                callback
            })
        },
        delete(route, callback) {
            handleRoute({
                route,
                method: 'delete',
                callback
            })
        }
    }

    const server = http.createServer((req, res) => {
        const [baseRoute, ...params] = splitRouteParams(req.url);
        const method = req.method.toLowerCase();
        const route = baseRoute + params.length
        if (handlers[method][route]) {
            res.send = function (value) {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.write(typeof value !== 'string' ? JSON.stringify(value) : value);
                res.end();
            }
            const routeParams = handlers[method][route].params;
            const requestParams = params;
            req.params = routeParams.reduce((params, param, idx) => {
                params[param] = requestParams[idx];
                return params
            }, {});
            handlers[method][route].callback(req, res);
        } else {
            let fileUrl;
            if (req.url == '/') {
                fileUrl = 'index.html';
            } else {
                fileUrl = req.url;
            }
            const stream = fs.createReadStream(path.join(`${__dirname}/public`, fileUrl));
            stream.on('error', function () {
                res.writeHead(404, 'application/json');
                //TODO - add support for 404 page or custom massage
                res.write(JSON.stringify({ error: 'Couldn\'t find path' }))
                res.end();
            });
            stream.pipe(res);
        }
    });
    return { server, app }
}

module.exports = {
    createServer
}


