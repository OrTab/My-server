import { ServerResponse } from 'http';
import { ICustomServerResponse } from '../types/types';

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
		value: function (statusCode): ICustomServerResponse {
			this.statusCode = statusCode;
			return this;
		},
	});
};
