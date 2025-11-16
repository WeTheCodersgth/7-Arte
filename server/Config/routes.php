<?php
/** @var \Bramus\Router\Router $router Instância do router vinda da classe Aplicacao */
$router = $this->router->getInstancia();

// Define a base path para a config
$router->setBasePath('/config');

// Rota de teste
$router->get('/', function() {
    \App\Core\Response::json(['mensagem' => 'Bem-vindo à API v1 da We, The Coders!']);
});

$router->get('index', function() {
    \App\Core\Response::json(['mensagem' => 'Bem-vindo à API v1 da We, The Coders!']);
});

// Grupo de rotas de autenticação
$router->mount('/autenticacao', function() use ($router) {
   
    $router->post('/cadastrar', 'AuthController@cadastrar');
});

// Handler para rotas não encontradas dentro da API
$router->set404(function() {
    \App\Core\Response::erro('Endpoint não encontrado.', 404);
});
