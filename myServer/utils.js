const fs = require('fs');
const path = require('path');

const handleRequest = ({ requestRoutesKeywords, currentMethodHandlers }) => {
	for (let path in currentMethodHandlers) {
		const currHandler = currentMethodHandlers[path];
		const filteredRouteParams = [];
		const filteredRouteKeywords = [];
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
			const routeParams = currentMethodHandlers[path].params;
			const params = routeParams.reduce((params, param, idx) => {
				params[param] = filteredRouteParams[idx];
				return params;
			}, {});

			return { callback: currentMethodHandlers[path].callback, params };
		}
	}
};

const serveStaticFiles = ({ res, filePath, contentType }) => {
	res.setHeader('Content-Type', contentType);
	const stream = fs.createReadStream(
		path.join(`${process.cwd()}/static-files`, filePath)
	);
	stream.on('error', function () {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'application/json');
		//TODO - add support for 404 page or custom massage
		res.write(JSON.stringify({ error: "Couldn't find path" }));
		res.end();
	});
	stream.pipe(res);
};

module.exports = {
	handleRequest,
	serveStaticFiles,
};
