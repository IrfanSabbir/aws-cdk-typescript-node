exports.handler = async function (event, context) {
	console.log(JSON.stringify(event, null, 2));
	return {
		statusCode: 200,
		headers: {'Content-Type': 'text/plain'},
		body: `Hello world from ${event.path}`
	}
};