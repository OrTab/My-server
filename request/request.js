const { IncomingMessage } = require('http');

const extendRequest = () => {
	Object.defineProperty(IncomingMessage.prototype, 'query', {
		get: function () {
			const query = {};
			if (!!this.queryString) {
				const formattedUrl = new URLSearchParams(this.queryString);
				for (const [key, value] of formattedUrl.entries()) {
					query[key] = value;
				}
			}
			return query;
		},
	});

	Object.defineProperty(IncomingMessage.prototype, 'userAgent', {
		get: function () {
			return this.headers['user-agent'];
		},
	});

	Object.defineProperty(IncomingMessage.prototype, 'isMobile', {
		get: function () {
			let ua = this.userAgent;
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.exec(
					ua
				)
			) {
				return true
			};
			return false;
		},
	});

	IncomingMessage.prototype.getBody = function () {
		return new Promise((resolve, reject) => {
			try {
				let body = '';
				this.on('data', (chunk) => {
					body += chunk.toString();
				});
				this.on('end', () => {
					body = body ? JSON.parse(body) : '';
					resolve(body);
				});
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	};
};

module.exports = {
	extendRequest,
};
