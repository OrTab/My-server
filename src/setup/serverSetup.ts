import http, { RequestListener, STATUS_CODES } from 'http';
import path from 'path';
import { extendRequest } from '../request/request';
import { extendResponse } from '../response/response';
import { getRouteDetails } from '../routing/routeUtils';
import { app } from './app';
import { HTTP_STATUS_CODES, MIME_TYPES } from './constants';
import {
	handleRequest,
	serveStaticFiles,
	checkIfFileExist,
	serve404,
	setCorsHeaders,
	handleBadCorsRequest,
	isValidCorsRequest,
} from '../request/requestUtils';
import { Request, Response, TMethods, TMethodsUppercase } from '../types/types';

const requestHandler = (req: Request, res: Response) => {
	const { url, method, headers } = req;
	const { origin } = headers;
	if (origin) {
		if (isValidCorsRequest(req)) {
			setCorsHeaders(res, origin);
			// If the request method is OPTIONS and it has passed CORS validation,
			// we can respond with a status NO_CONTENT (204) only if there are no OPTIONS handlers configured.
			if (method === 'OPTIONS' && !app.handlers.options) {
				res.status(HTTP_STATUS_CODES.NO_CONTENT);
				res.end();
				return;
			}
		} else {
			handleBadCorsRequest(res);
			return;
		}
	}

	const [requestUrl = '', queryParams = ''] = url!.split('?') || [];
	let extension;
	if (requestUrl === '/') {
		extension = '.html' as keyof typeof MIME_TYPES;
	} else {
		extension = path.extname(requestUrl) as keyof typeof MIME_TYPES;
	}
	req.queryString = queryParams;
	if (MIME_TYPES[extension]) {
		const filePath =
			extension === '.html' && requestUrl === '/'
				? 'index.html'
				: requestUrl;
		const isFileExist = checkIfFileExist(filePath);
		if (isFileExist) {
			serveStaticFiles({
				res,
				filePath,
				contentType: MIME_TYPES[extension],
			});
			return;
		}
	}

	const { routesKeywords: requestRoutesKeywords } =
		getRouteDetails(requestUrl);

	const { callback, params = {} } =
		handleRequest({
			currentMethodHandlers:
				app.handlers[method!.toLowerCase() as TMethods]!,
			requestRoutesKeywords,
		}) || {};

	if (!!callback) {
		req.params = params;
		callback(req, res);
		return;
	}
	return serve404(res);
};

export const noDep = (): {
	app: typeof app;
	server: http.Server;
} => {
	extendRequest();
	extendResponse();
	const server = http.createServer(<RequestListener>requestHandler);
	return { app, server };
};
