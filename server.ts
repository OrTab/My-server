const hostname = '127.0.0.1';
const port = 5000;
import { noDep } from './src/setup/serverSetup';
const { app, server } = noDep();
app.setStaticFolder('static');
app.enableCorsForOrigins({
	'http://127.0.0.1:5000': ['*'],
	'https://nodejs.org': ['GET'],
});

app.get('/api/v2/:id', (req, res) => {
	res.send({
		massage: `massage from server and id -  ${req.params['id']}`,
	});
});

app.get('/api/v2/profile/:profileId/photos/:photoId', (req, res) => {
	const { profileId, photoId } = req.params;
	res.send({
		massage: `massage from server , profile id - ${profileId} and photo id - ${photoId}`,
	});
});

app.get('/massage/:id', (req, res) => {
	const { id } = req.params;
	res.status(200).send({
		massage: `massage from server with id - ${id}`,
	});
});

app.get('/massage/:id/yes/:someString', (req, res) => {
	const { id, someString } = req.params;
	res.send({
		massage: `massage from server with id - ${id} and some string - ${someString}`,
	});
});

app.get('/test', (req, res) => {
	res.send({
		massage: 'test from server',
	});
});

app.post('/api/my-post', (req, res) => {
	res.send({
		msg: 'the post worked',
	});
});

app.post('/api/my-post/:id', async (req, res) => {
	const body = await req.body;
	res.send({
		msg: `This is the post with parser body and the id is ${req.params['id']}`,
		body,
	});
});

app.put('/api/my-put/:id', async (req, res) => {
	const body = await req.body;
	res.send({
		msg: `the put worked and the id is ${req.params['id']}`,
		body,
	});
});

app.delete('/api/my-delete', (req, res) => {
	res.send({
		msg: `the delete worked and the id is ${req.params['id']}`,
	});
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
