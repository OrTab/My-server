
const hostname = '127.0.0.1';
const port = 5001;
const { createServer } = require('./apiSetup.js')

const { server, app } = createServer();

app.get('/massage', (req, res) => {
    console.log(req.params);
    res.statusCode = 200;
    res.send({
        massage: 'massage from server'
    });
})

app.get('/massage/:id', (req, res) => {
    const { id } = req.params;
    res.statusCode = 200;
    res.send({
        massage: `massage from server with only id - ${id}`
    });
})

app.get('/massage/:id/:someString', (req, res) => {
    const { id, someString } = req.params;
    res.statusCode = 200;
    res.send({
        massage: `massage from server with id - ${id} and some string - ${someString}`
    });
})

app.get('/test', (req, res) => {
    res.statusCode = 200;
    res.send({
        massage: 'test from server'
    });
})



server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


