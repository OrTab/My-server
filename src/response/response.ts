import { ServerResponse } from 'http';
import { IAdditionalResponseHeaders, Response } from '../types/types';

export const extendResponse = () => {
	Object.defineProperty(ServerResponse.prototype, 'send', {
		value: function (value): void {
			this.setHeader('Content-Type', 'application/json');
			this.write(
				typeof value !== 'string' ? JSON.stringify(value) : value
			);
			this.end();
		},
	});
	Object.defineProperty(ServerResponse.prototype, 'status', {
		value: function (statusCode: number | string): Response {
			this.statusCode = statusCode;
			return this;
		},
	});
	Object.defineProperty(ServerResponse.prototype, 'setHeaders', {
		value: function (headers: IAdditionalResponseHeaders): Response {			
			headers.forEach((header) => {
				this.setHeader(header.headerName, header.value);
			});
			return this;
		},
	});
};
