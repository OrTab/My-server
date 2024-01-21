import fs from 'fs';
import path from 'path';
import { app } from '../setup/app';
import { MIME_TYPES } from '../setup/constants';
import { Response, TRequestHandler, TRouteHandler } from '../types/types';

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
			const params = routeParams.reduce((params, param, idx) => {
				params[param] = filteredRouteParams[idx];
				return params;
			}, {});

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
	res.status(404);
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

export const serveStaticFiles = ({
	res,
	filePath,
	contentType,
}: {
	res: Response;
	filePath: string;
	contentType: keyof typeof MIME_TYPES;
}) => {
	res.setHeader('Content-Type', contentType);
	const stream = fs.createReadStream(getStaticFilePath(filePath));
	stream.on('error', () => {
		serve404(res);
	});
	stream.pipe(res);
};
