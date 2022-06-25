
const hostname = '127.0.0.1';
const port = 5003;
const { createServer } = require('./apiSetup.js')

const { server, app } = createServer();

app.get('/massage', (req, res) => {
    res.statusCode = 200;
    res.send({
        massage: 'massage from server'
    });
})

app.get('/massage/:id', (req, res) => {
    const { id } = req.params;
    res.statusCode = 200;
    res.send({
        massage: `massage from server with id - ${id}`
    });
})

app.get('/massage/:id/yes/:someString', (req, res) => {
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

app.post('/api/my-post', (req, res) => {
    res.statusCode = 200;
    res.send({
        msg: 'the post worked'
    })
})


app.post('/api/my-post/:id', (req, res) => {
    res.statusCode = 200;
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    })
    req.on('end', () => {
        body = JSON.parse(body);
        res.send({
            msg: `the post worked and the id is ${req.params.id}`,
            body
        })
    })

})

app.put('/api/my-put/:id', (req, res) => {
    res.statusCode = 200;
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    })
    req.on('end', () => {
        body = JSON.parse(body);
        res.send({
            msg: `the put worked and the id is ${req.params.id}`,
            body
        })
    })

})


app.delete('/api/my-delete', (req, res) => {
    res.statusCode = 200;
    console.log(req.params);
    res.send({
        msg: `the delete worked and the id is ${req.params.id}`,
        body
    })

})


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


