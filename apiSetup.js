const fs = require('fs');
const path = require('path');
const http = require('http');
const { extendRequest } = require('./request');

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

const handleRouteParams = (route) => {
    const params = [];
    const routesKeywords = [];
    for (let i = 0; i < route.length; i++) {
        if (route.charAt(i) + route.charAt(i + 1) === '/:') {
            i += 2
            let idx = route.indexOf('/', i);
            idx = idx === -1 ? route.length : idx;
            const routeParam = route.substring(i, idx);
            params.push(routeParam);
            i = idx - 1;
        } else if (route.charAt(i) === '/') {
            let idx = route.indexOf('/', i + 1);
            idx = idx === -1 ? route.length : idx;
            const routePath = route.substring(i + 1, idx);
            i = idx - 1;
            routesKeywords.push(routePath);
        }
    }
    return { params, routesKeywords }
}

const handleRoute = ({ route, method, callback }) => {
    const { params, routesKeywords } = handleRouteParams(route);
    handlers[method][route] = {
        params,
        callback,
        routesKeywords
    }
}

const createServer = () => {
    extendRequest();
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
        const method = req.method.toLowerCase();
        const { routesKeywords: requestRoutesKeywords } = handleRouteParams(req.url);
        const currMethodHandlers = handlers[method];
        for (let path in currMethodHandlers) {
            const currHandler = currMethodHandlers[path];
            const filteredRouteParams = [];
            const filteredRouteKeywords = [];
            for (let keyword of requestRoutesKeywords) {
                if (currHandler.routesKeywords.includes(keyword)) {
                    filteredRouteKeywords.push(keyword)
                } else {
                    filteredRouteParams.push(keyword);
                }
            }
            if (filteredRouteParams.length === currHandler.params.length &&
                filteredRouteKeywords.length === currHandler.routesKeywords.length) {
                res.send = function (value) {
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.write(typeof value !== 'string' ? JSON.stringify(value) : value);
                    res.end();
                }
                const routeParams = currMethodHandlers[path].params;
                req.params = routeParams.reduce((params, param, idx) => {
                    params[param] = filteredRouteParams[idx];
                    return params
                }, {});
                currMethodHandlers[path].callback(req, res)
                return;
            }
        }

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

    });
    return { server, app }
}

module.exports = {
    createServer
}


