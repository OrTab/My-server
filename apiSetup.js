const fs = require('fs');
const path = require('path');
const http = require('http');
const { extendRequest } = require('./request');
const { extendResponse } = require('./response');
const { getRouteDetails, handleQueryParams } = require('./routeUtils');

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

const handleRoute = ({ route, method, callback }) => {
    const { params, routesKeywords } = getRouteDetails(route);
    handlers[method][route] = {
        params,
        callback,
        routesKeywords
    }
}

const createServer = () => {
    extendRequest();
    extendResponse();
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
        const indexOfQueryParamsStart = req.url.indexOf('?');
        let requestUrl = req.url;
        if (indexOfQueryParamsStart !== -1) {
            requestUrl = req.url.substring(0, indexOfQueryParamsStart);
            const queryParams = req.url.substring(indexOfQueryParamsStart + 1);
            handleQueryParams(req, queryParams);
        }

        const { routesKeywords: requestRoutesKeywords } = getRouteDetails(requestUrl);
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
        if (requestUrl == '/') {
            fileUrl = 'index.html';
        } else {
            fileUrl = requestUrl;
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


