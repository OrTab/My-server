export class Router {
	routes = {};
	constructor() {}

	forRoute(baseRoute, routeHandlers) {
		this.routes[baseRoute] = routeHandlers;
	}
}
