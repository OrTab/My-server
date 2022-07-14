let route = require('../routing/route');
route = new route()


route.get('/:id', (req, res) => { })

route.nestedFor('/:id')
module.exports = route;
