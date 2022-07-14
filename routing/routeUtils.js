const { URLSearchParams } = require('url');

const getRouteDetails = (route) => {
	return route
		.substring(1)
		.split('/')
		.reduce(
			(routeMap, keyword) => {
				if (keyword.charAt(0) === ':')
					routeMap.params.push(keyword.substring(1));
				else routeMap.routesKeywords.push(keyword);
				return routeMap;
			},
			{ routesKeywords: [], params: [] }
		);
};

const handleQueryParams = (req, queryParams) => {
	const query = {};
	if (!!queryParams) {
		const formattedUrl = new URLSearchParams(queryParams);
		for (const [key, value] of formattedUrl.entries()) {
			query[key] = value;
		}
	}
	req.query = query;
};

module.exports = { getRouteDetails, handleQueryParams };
