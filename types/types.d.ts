import { ServerResponse, IncomingMessage, RequestListener } from 'http';

interface ICustomServerResponse extends ServerResponse {
	send: (data: {}) => void;
	status: (status: number) => ICustomServerResponse;
}

interface ICustomIncomingMessage extends IncomingMessage {
	isMobile: boolean;
	queryString: string;
	params: { [key: string]: string };
	query: {};
	userAgent: string;
	send: (data: {}) => void;
	body: Promise<unknown>;
}

type TRequestHandler = (
	request: ICustomIncomingMessage,
	response: ICustomServerResponse
) => void;

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
