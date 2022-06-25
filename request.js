const { IncomingMessage } = require('http');

const extendRequest = () => {
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