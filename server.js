// on importe le package qui permet de créer un serveur
const http = require('http');
// on importe l'application Express
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// si l'environnement de dév nous envoie un port, on l'utilise sinon, on prend 3000
const port = normalizePort(process.env.PORT ||'3030');
// on doit aussi définir quel port l'app doit écouter
app.set('port', port);

//recherche les différentes erreurs lors du démaraage du serveur et après. 
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//on créé le serveur
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// on écoute le port qui va nous faire des appels.
server.listen(port);
