const fs = require('fs');
const path = require('path');
const { app } = require('./app');

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

const getStaticFilePath = (filePath) =>
	path.join(`${process.cwd()}/${app.staticFolder}`, filePath);

const serveStaticFiles = ({ res, filePath, contentType }) => {
	res.setHeader('Content-Type', contentType);
	const stream = fs.createReadStream(getStaticFilePath(filePath));
	stream.on('error', () => {
		res.statusCode = 404;
		const pageNotFoundPath = getStaticFilePath('404.html');
		try {
			if (fs.existsSync(pageNotFoundPath)) {
				const stream = fs.createReadStream(pageNotFoundPath);
				stream.pipe(res);
			} else {
				res.setHeader('Content-Type', 'application/json');
				res.write(JSON.stringify({ error: "Couldn't find path" }));
				res.end();
			}
		} catch (err) {
			console.error(err);
		}
	});
	stream.pipe(res);
};

module.exports = {
	handleRequest,
	serveStaticFiles,
};
