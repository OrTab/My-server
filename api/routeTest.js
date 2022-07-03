let route = require('../route');
route = new route()


route.get('/:id', (req, res) => { })

route.nestedFor('/:id')
module.exports = route;
