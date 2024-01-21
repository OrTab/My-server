import { getRouteDetails } from '../routing/routeUtils';
import {
	TAllowedOriginsAndMethods,
	THandlers,
	TMethods,
	TRequestHandler,
} from '../types/types';

class App {
	private _handlers: Partial<THandlers> = {};
	staticFolder: string = 'public';
	pageNotFoundFileName = '404.html';
	authorizedOrigins: TAllowedOriginsAndMethods = {};
	get = this.getInitializeRequestMethod('get');
	post = this.getInitializeRequestMethod('post');
	put = this.getInitializeRequestMethod('put');
	delete = this.getInitializeRequestMethod('post');

	get handlers() {
		return this._handlers;
	}

	private getInitializeRequestMethod(method: TMethods) {
		return (route: string, callback: TRequestHandler) => {
			const { params, routesKeywords } = getRouteDetails(route);
			this._handlers[method] = this._handlers[method] ?? {};
			const currentMethodHandler = this._handlers[method];
			if (currentMethodHandler) {
				currentMethodHandler[route] = {
					params,
					callback,
					routesKeywords,
				};
			}
		};
	}

	setStaticFolder(folderName: string) {
		this.staticFolder = folderName;
	}

	setPageNotFoundFileName(fileName: string) {
		this.pageNotFoundFileName = fileName;
	}

	enableCorsForOrigins(origins: TAllowedOriginsAndMethods) {
		this.authorizedOrigins = origins;
	}
}

export const app = new App();
