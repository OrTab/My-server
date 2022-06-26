const { URLSearchParams } = require("url");

const getRouteDetails = (route) => {
    const params = [];
    const routesKeywords = [];
    for (let i = 0; i < route.length; i++) {
        if (route.charAt(i) + route.charAt(i + 1) === '/:') {
            i += 2;
            let idx = route.indexOf('/', i);
            idx = idx === -1 ? route.length : idx;
            const routeParam = route.substring(i, idx);
            params.push(routeParam);
            i = idx - 1;
        } else if (route.charAt(i) === '/') {
            let idx = route.indexOf('/', i + 1);
            idx = idx === -1 ? route.length : idx;
            const routePath = route.substring(i + 1, idx);
            i = idx - 1;
            routesKeywords.push(routePath);
        }
    }
    return { params, routesKeywords }
}

const handleQueryParams = (req, url) => {

    const formattedUrl = new URLSearchParams(url);
    const query = {};
    for (const [key, value] of formattedUrl.entries()) {
        query[key] = value;
    }
    req.query = query;
}

module.exports = { getRouteDetails, handleQueryParams }