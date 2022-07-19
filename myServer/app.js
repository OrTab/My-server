const { getRouteDetails } = require('../routing/routeUtils');
const { METHODS } = require('./constants');
class App {
	handlers = {};
	staticFolder = 'public';
	authorizedOrigins = [];
	constructor() {
		METHODS.forEach((method) => {
			this.handlers[method] = {};
			this[method] = function (route, callback) {
				const { params, routesKeywords } = getRouteDetails(route);
				this.handlers[method][route] = {
					params,
					callback,
					routesKeywords,
				};
			};
		});
	}

	setStaticFolder(folderName) {
		this.staticFolder = folderName;
	}

	enableCorsForOrigins(origins) {
		this.authorizedOrigins = origins;
	}
}

module.exports = {
	app: new App(),
};
