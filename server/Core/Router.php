<?php
namespace App\Core;

use Bramus\Router\Router;

class Router
{
    /** @var Router A instância do router da biblioteca bramus/router. */
    private Router $instancia;

    public function __construct()
    {
        $this->instancia = new Router();
    }

    /**
     * Retorna a instância do router para que as rotas possam ser definidas.
     * @return Router
     */
    public function getInstancia(): Router
    {
        return $this->instancia;
    }
}
