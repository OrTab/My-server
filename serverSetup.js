const http = require('http');
const path = require('path');
const { extendRequest } = require('./request');
const { extendResponse } = require('./response');
const { getRouteDetails } = require('./routing/routeUtils');
const { app } = require('./app');
const { MIME_TYPES } = require('./constants');
const { handleRequest, serveStaticFiles } = require('./requestUtils');

extendRequest();
extendResponse();

const server = http.createServer((req, res) => {
	if (req.headers.origin) {
		if (app.authorizedOrigins.includes(req.headers.origin)) {
			res.setHeader(
				'Access-Control-Allow-Origin',
				req.headers.origin
			);
		} else {
			return res
				.status(401)
				.send(
					`Access to fetch at ${req.url} from origin ${req.headers.origin} has been blocked by CORS policy: No Access-Control-Allow-Origin header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.`
				);
		}
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
	return res.send({ msg: 'no api route match' });
});

module.exports = {
	app,
	server
};
