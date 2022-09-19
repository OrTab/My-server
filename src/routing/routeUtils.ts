import { TRequestDescription } from '../types/types';

export const getRouteDetails = (route: string) => {
	const initialObj: Omit<TRequestDescription, 'callback'> = {
		routesKeywords: [],
		params: [],
	};
	if (route === '/') {
		return initialObj;
	}
	return route
		.substring(1)
		.split('/')
		.reduce((routeMap, keyword: string) => {
			if (keyword.charAt(0) === ':') {
				routeMap.params.push(keyword.substring(1));
			} else {
				routeMap.routesKeywords.push(keyword);
			}
			return routeMap;
		}, initialObj);
};
