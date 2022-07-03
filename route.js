class Route {
    handlers = {}
    constructor() {
        ['get', 'post', 'put', 'delete'].forEach(method => (
            this[method] = function (route, ...callbacks) {
                this.handlers[route] = this.handlers[route] || {};
                this.handlers[route][method] = function (req, res) {
                    callbacks[0](req, res, callbacks[1] || undefined);
                }
            }
        ))
    }

    nestedFor(route) {
        // console.log(this.handlers[route]);
    }

}

module.exports = Route;