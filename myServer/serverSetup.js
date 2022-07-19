const http = require('http');
const path = require('path');
const { extendRequest } = require('../request');
const { extendResponse } = require('../response');
const { getRouteDetails } = require('../routing/routeUtils');
const { app } = require('./app');
const { MIME_TYPES } = require('./constants');
const { handleRequest, serveStaticFiles } = require('./requestUtils');

const createServer = () => {
	extendRequest();
	extendResponse();

	const server = http.createServer((req, res) => {
		console.log(req.headers.origin);
		if (
			req.headers.origin &&
			app.authorizedOrigins.includes(req.headers.origin)
		) {
			res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
		}
		const [requestUrl, queryParams] = req.url.split('?');
		let extension;
		if (requestUrl === '/') {
			extension = '.html';
		} else {
			extension = path.extname(requestUrl);
		}
		req.queryString = queryParams || '';
		if (MIME_TYPES[extension]) {
			const filePath =
				extension === '.html' && requestUrl === '/'
					? 'index.html'
					: requestUrl;
			serveStaticFiles({
				res,
				filePath,
				contentType: MIME_TYPES[extension],
			});
			return;
		}
		const { routesKeywords: requestRoutesKeywords } =
			getRouteDetails(requestUrl);
		const { callback, params } =
			handleRequest({
				currentMethodHandlers: app.handlers[req.method.toLowerCase()],
				requestRoutesKeywords,
			}) || {};
		if (callback) {
			req.params = params;
			callback(req, res);
			return;
		}
		res.send({ msg: 'no api route match' });
	});
	return { server, app };
};

module.exports = {
	createServer,
};
