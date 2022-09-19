import http, { ServerResponse, IncomingMessage, RequestListener } from 'http';

interface Response extends ServerResponse {
	send: (data: {}) => void;
	status: (status: number) => Response;
}

interface Request extends IncomingMessage {
	isMobile: boolean;
	queryString: string;
	params: { [key: string]: string };
	query: { [key: string]: string };
	userAgent: string;
	send: (data: any) => void;
	body: Promise<unknown>;
}

type TRequestHandler = (request: Request, response: Response) => void;

type TRequestDescription = {
	params: string[];
	callback: TRequestHandler;
	routesKeywords: string[];
};

type TRouteHandler = {
	[route: string]: TRequestDescription;
};

type TMethods = 'get' | 'put' | 'post' | 'delete';

type THandlers = {
	get: TRouteHandler;
	post: TRouteHandler;
	put: TRouteHandler;
	delete: TRouteHandler;
};
