const http = require('http');
const path = require('path');
const { extendRequest } = require('../request');
const { extendResponse } = require('../response');
const { getRouteDetails } = require('../routing/routeUtils');
const { MIME_TYPES } = require('./constants');
const { handleRequest, serveStaticFiles } = require('./utils');

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
        let extension;
        if (requestUrl === '/') {
            extension = '.html';
        } else {
            extension = path.extname(requestUrl);
        }
        req.queryString = queryParams || '';
        if (MIME_TYPES[extension]) {
            const filePath = extension === '.html' && requestUrl === '/' ? 'index.html' : requestUrl;
            serveStaticFiles({ res, filePath, contentType: MIME_TYPES[extension] });
            return;
        }
        const { routesKeywords: requestRoutesKeywords } = getRouteDetails(requestUrl);
        const { callback, params } = handleRequest({ currentMethodHandlers: handlers[method], requestRoutesKeywords }) || {};
        if (callback) {
            req.params = params;
            callback(req, res);
            return;
        }
    });
    return { server, app }
}

module.exports = {
    createServer
}


