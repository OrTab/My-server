
const hostname = '127.0.0.1';
const port = 5001;
const { createServer } = require('./apiSetup.js')

const { server, app } = createServer();

app.get('/massage', (req, res) => {
    res.statusCode = 200;
    res.send({
        massage: 'massage from server'
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


