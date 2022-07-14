
const hostname = '127.0.0.1';
const port = 5000;
const { createServer } = require('./myServer/serverSetup.js')
const { server, app } = createServer();


app.get('/api/v2', (req, res) => {
    res.statusCode = 200;
    res.send({
        massage: `massage from server`
    });
})

app.get('/api/v2/profile/:profileId/photos/:photoId', (req, res) => {
    const { profileId, photoId } = req.params;
    res.statusCode = 200;
    res.send({
        massage: `massage from server , profile id - ${profileId} and photo id - ${photoId}`
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


