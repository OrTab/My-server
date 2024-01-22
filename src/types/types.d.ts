import http, {
	ServerResponse,
	IncomingMessage,
	OutgoingHttpHeader,
} from 'http';

interface Response extends ServerResponse {
	send: (data: unknown) => void;
	status: (status: number) => Response;
	setHeaders: (headers: IAdditionalResponseHeaders) => Response;
}

interface Request extends IncomingMessage {
	isMobile: boolean;
	queryString: string;
	params: { [key: string]: string };
	query: { [key: string]: string };
	userAgent: string;
	send: (data: any) => void;
	body: () => Promise<unknown>;
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

type TMethods = 'get' | 'put' | 'post' | 'delete' | 'options' | '*';
type TMethodsUppercase = Uppercase<TMethods>;

type TAllowedOriginsAndMethods = {
	[origin: string]: TMethodsUppercase[];
};

type THandlers = Record<TMethods, TRouteHandler>;

type TResponseHeadersNames =
	| 'Accept-Patch'
	| 'Accept-Ranges'
	| 'Access-Control-Allow-Credentials'
	| 'Access-Control-Allow-Headers'
	| 'Access-Control-Allow-Methods'
	| 'Access-Control-Allow-Origin'
	| 'Access-Control-Expose-Headers'
	| 'Access-Control-Max-Age'
	| 'Age'
	| 'Allow'
	| 'Alt-Svc'
	| 'Cache-Control'
	| 'Connection'
	| 'Content-Disposition'
	| 'Content-Encoding'
	| 'Content-Language'
	| 'Content-Length'
	| 'Content-Location'
	| 'Content-Range'
	| 'Content-Security-Policy'
	| 'Content-Type'
	| 'Date'
	| 'Delta-Base'
	| 'ETag'
	| 'Expires'
	| 'IM'
	| 'Last-Modified'
	| 'Link'
	| 'Location'
	| 'Pragma'
	| 'Proxy-Authenticate'
	| 'Public-Key-Pins'
	| 'Refresh'
	| 'Retry-After'
	| 'Server'
	| 'Set-Cookie'
	| 'Strict-Transport-Security'
	| 'Tk'
	| 'Trailer'
	| 'Transfer-Encoding'
	| 'Upgrade'
	| 'Vary'
	| 'Via'
	| 'WWW-Authenticate'
	| 'Warning'
	| 'X-Powered-By'
	| 'X-Request-ID'
	| 'X-UA-Compatible'
	| 'X-XSS-Protection'
	| 'max-age'
	| 'no-cache'
	| 'no-store';

type IAdditionalResponseHeaders = {
	headerName: TResponseHeadersNames;
	value: OutgoingHttpHeader;
}[];
