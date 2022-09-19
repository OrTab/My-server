import http, { RequestListener } from 'http';
import path from 'path';
import { extendRequest } from '../request/request';
import { extendResponse } from '../response/response';
import { getRouteDetails } from '../routing/routeUtils';
import { app } from './app';
import { MIME_TYPES } from './constants';
import {
	handleRequest,
	serveStaticFiles,
	checkIfFileExist,
} from '../request/requestUtils';
import { Request, Response } from '../types/types';

extendRequest();
extendResponse();

const requestHandler = (req: Request, res: Response) => {
	if (req.headers.origin) {
		if (app.authorizedOrigins.includes(req.headers.origin)) {
			res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
		} else {
			return res
				.status(401)
				.send(
					`Access to fetch at ${req.url} from origin ${req.headers.origin} has been blocked by CORS policy: No Access-Control-Allow-Origin header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.`
				);
		}
	}
	const [requestUrl = '', queryParams = ''] = (req.url as string).split('?');
	let extension;
	if (requestUrl === '/') {
		extension = '.html';
	} else {
		extension = path.extname(requestUrl as string);
	}
	req.queryString = queryParams;
	if (MIME_TYPES[extension]) {
		const filePath = (
			extension === '.html' && requestUrl === '/'
				? 'index.html'
				: requestUrl
		) as string;
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
				app.handlers[(req.method as string).toLowerCase()],
			requestRoutesKeywords,
		}) || {};
	if (callback) {
		req.params = params;
		callback(req, res);
		return;
	}
	return res.send({ msg: 'no api route match' });
};

const server = http.createServer(requestHandler as RequestListener);

export const noDep = (): { app: typeof app; server: http.Server } => {
	return { app: app, server };
};
