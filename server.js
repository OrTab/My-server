
const hostname = '127.0.0.1';
const port = 5003;
const { createServer } = require('./apiSetup.js')
const { server, app } = createServer();
let router = require('./router');
router = new router()
const routeTest = require('./api/routeTest');


app.get('/api/v2/profile/:profileId/photos/:photoId', (req, res) => {
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

app.post('/api/my-post/:id', async (req, res) => {
    res.statusCode = 200;
    const body = await req.getBody();
    res.send({
        msg: `This is the post with parser body and the id is ${req.params.id}`,
        body
    })
})

app.put('/api/my-put/:id', async (req, res) => {
    res.statusCode = 200;
    const body = await req.getBody();
    res.send({
        msg: `the put worked and the id is ${req.params.id}`,
        body
    })
})

router.forRoute('/api/testing', routeTest)

app.delete('/api/my-delete', (req, res) => {
    res.statusCode = 200;
    res.send({
        msg: `the delete worked and the id is ${req.params.id}`,
        body
    })

})


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


