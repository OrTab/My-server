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
        }
    })

    IncomingMessage.prototype.getBody = function () {
        return new Promise((resolve, reject) => {
            try {
                let body = '';
                this.on('data', (chunk) => {
                    body += chunk.toString();
                })
                this.on('end', () => {
                    body = body ? JSON.parse(body) : '';
                    resolve(body);
                })
            } catch (err) {
                console.error(err);
                reject(err)
            }
        })
    }
}

module.exports = {
    extendRequest
}