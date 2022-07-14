const fs = require('fs');
const path = require('path');
const http = require('http');
const { extendRequest } = require('../request');
const { extendResponse } = require('../response');
const { getRouteDetails } = require('../routing/routeUtils');

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
        const [requestUrl, queryParams] = req.url.split('?');
        req.queryString = queryParams || '';
        const { routesKeywords: requestRoutesKeywords } = getRouteDetails(requestUrl);
        const currMethodHandlers = handlers[method];
        for (let path in currMethodHandlers) {
            const currHandler = currMethodHandlers[path];
            const filteredRouteParams = [];
            const filteredRouteKeywords = [];
            for (let keyword of requestRoutesKeywords) {
                if (currHandler.routesKeywords.includes(keyword)) {
                    filteredRouteKeywords.push(keyword);
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
        const stream = fs.createReadStream(path.join(`${__dirname}/static-files`, fileUrl));
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


