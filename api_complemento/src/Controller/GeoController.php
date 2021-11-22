<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Estampillado;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7;

/**
 * @return JsonResponse
 * @Route("/complemento", name="api_geo")
 */
class GeoController extends ApiController
{
  
    /**
     * @return JsonResponse
     * @Route("/prueba", name="get_prueba", methods={"GET"})
     */
    public function getPrueba(){

        return $this->response([
            "num_expediente" => "bom bn",
        ]);
    }

}
