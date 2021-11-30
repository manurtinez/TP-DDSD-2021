<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use GuzzleHttp\Client;

/**
  * @return JsonResponse
  * @Route("/api/geo")
 */
class GeoController extends AbstractController
{
    private $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'http://countries.trevorblades.com'
        ]);
    }

    /**
     * @Route("/continente", name="geo_continentes", methods={"GET"})
     */
    public function getContinentesAction(Request $request)
    {     
        $response = $this->client->request('POST', '', [
            'json' => [
                "operationName" => null,
                "variables" => "{}",
                "query" => "{
                    continents {
                        code
                        name
                    }
                }"
            ],
        ]);

        $datos = json_decode((string) $response->getBody());
        return new JsonResponse($datos->data->continents, 200);
    }

    /**
     * @Route("/continente/{code}/pais", name="geo_paises", methods={"GET"})
     */
    public function getPaisesAction($code, Request $request)
    {   
        if($code == null){
            return new JsonResponse("Debe indicar el codigo del continente", 400 );
        }

        $response = $this->client->request('POST', '', [
            'json' => [
                "operationName" => null,
                "variables" => '{"continentCode": "'.$code.'"}',
                "query" => '
                    query($continentCode: ID!){
                        continent(code: $continentCode) {
                            countries {name code languages { code name native }}
                        }
                    }'
            ],
        ]);

        $datos = json_decode((string) $response->getBody());
        if($datos->data->continent == null){
            return new JsonResponse("No se encontraron paises para el continente indicado", 400 );
        }

        return new JsonResponse($datos->data->continent->countries, 200);
    }

    /**
     * @Route("/pais/{code}/estado", name="geo_estados", methods={"GET"})
     */
    public function getEstadosAction($code,Request $request)
    {     
        if($code == null){
            return new JsonResponse("Debe indicar el codigo del Pais", 400 );
        }

        $response = $this->client->request('POST', '', [
            'json' => [
                "operationName" => null,
                "variables" => '{"paisCode": "'.$code.'"}',
                "query" => '
                    query($paisCode: ID!){
                        country(code: $paisCode) {
                            states {name code }
                        }
                    }'
            ],
        ]);

        $datos = json_decode((string) $response->getBody());
        if($datos->data->country == null){
            return new JsonResponse("No se encontraron estados para el pais indicado", 400 );
        }

        return new JsonResponse($datos->data->country->states, 200);
    }
    
}