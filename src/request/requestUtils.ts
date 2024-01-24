import fs from 'fs';
import path from 'path';
import { app } from '../setup/app';
import {
	CORS_HEADERS,
	HTTP_STATUS_CODES,
	MIME_TYPES,
} from '../setup/constants';
import {
	Response,
	Request,
	TMethodsUppercase,
	TRequestHandler,
	TRouteHandler,
} from '../types/types';

export const handleRequest = ({
	requestRoutesKeywords,
	currentMethodHandlers,
}: {
	requestRoutesKeywords: string[];
	currentMethodHandlers: TRouteHandler;
}): {
	callback: TRequestHandler;
	params: {};
} | null => {
	for (let route in currentMethodHandlers) {
		const currHandler = currentMethodHandlers[route];
		if (!currHandler) continue;
		const filteredRouteParams: string[] = [];
		const filteredRouteKeywords: string[] = [];
		for (let keyword of requestRoutesKeywords) {
			if (currHandler.routesKeywords.includes(keyword)) {
				filteredRouteKeywords.push(keyword);
			} else {
				filteredRouteParams.push(keyword);
			}
		}
		if (
			filteredRouteParams.length === currHandler.params.length &&
			filteredRouteKeywords.length === currHandler.routesKeywords.length
		) {
			const { params: routeParams, callback } = currHandler;
			const params = routeParams.reduce(
				(params: Record<string, unknown>, param, idx) => {
					params[param] = filteredRouteParams[idx];
					return params;
				},
				{}
			);

			return { callback, params };
		}
	}
	return null;
};

const getStaticFilePath = (filePath: string) =>
	path.join(`${process.cwd()}/${app.staticFolder}`, filePath);

export const checkIfFileExist = (filePath: string) => {
	const path = getStaticFilePath(filePath);
	return fs.existsSync(path);
};

export const serve404 = (res: Response) => {
	res.status(HTTP_STATUS_CODES.NOT_FOUND);
	const pageNotFoundFileName = app.pageNotFoundFileName;
	const pageNotFoundPath = getStaticFilePath(pageNotFoundFileName);
	try {
		if (checkIfFileExist(pageNotFoundFileName)) {
			const stream = fs.createReadStream(pageNotFoundPath);
			stream.pipe(res);
		} else {
			res.send({ error: "Couldn't find path" });
		}
	} catch (err) {
		console.error(err);
	}
};

export const setCorsHeaders = (res: Response, origin: string) => {
	res.setHeaders([
		{
			headerName: CORS_HEADERS.ALLOW_ORIGIN,
			value: origin,
		},
		{
			headerName: CORS_HEADERS.ALLOW_METHODS,
			value: app.authorizedOrigins[origin].join(),
		},
	]);
};

export const handleBadCorsRequest = (
	res: Response,
	method: TMethodsUppercase
) => {
	const status =
		method === 'OPTIONS'
			? HTTP_STATUS_CODES.BAD_REQUEST
			: HTTP_STATUS_CODES.FORBIDDEN;
	res.status(status);
	res.send(
		`CORS policy violation: Request from origin ${origin} is not allowed.`
	);
};

export const isValidCorsRequest = (req: Request) => {
	const { method, headers } = req;
	const { origin } = headers;
	const accessControlMethod = headers['access-control-request-method'];
	return (
		app.authorizedOrigins[origin!]?.includes(
			(method === 'OPTIONS'
				? accessControlMethod
				: method) as TMethodsUppercase
		) || app.authorizedOrigins[origin!].includes('*')
	);
};

export const serveStaticFiles = ({
	res,
	filePath,
	contentType,
}: {
	res: Response;
	filePath: string;
	contentType: (typeof MIME_TYPES)[keyof typeof MIME_TYPES];
}) => {
	res.setHeader('Content-Type', contentType);
	const stream = fs.createReadStream(getStaticFilePath(filePath));
	stream.on('error', () => {
		serve404(res);
	});
	stream.pipe(res);
};
