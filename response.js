const { ServerResponse } = require('http');

const extendResponse = () => {
	ServerResponse.prototype.send = function (value) {
		this.setHeader('Content-Type', 'application/json');
		this.write(typeof value !== 'string' ? JSON.stringify(value) : value);
		this.end();
	};
	ServerResponse.prototype.status = function (statusCode) {
		this.statusCode = statusCode;
		return this;
	};
};

module.exports = {
	extendResponse,
};
