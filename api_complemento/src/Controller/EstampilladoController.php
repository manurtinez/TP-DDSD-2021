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
 * @Route("/api/estampillado", name="api_estampillado")
 */
class EstampilladoController extends ApiController
{
  
    /**
     * @return JsonResponse
     * @Route("/{hash}", name="get_estampillado_by_hash", methods={"GET"})
     */
    public function getEstampillado($hash){
        $entityManager = $this->getDoctrine()->getManager();
        $estampillado = $entityManager->getRepository(Estampillado::class)->findOneBy(['hash' => $hash]);
        
        if($estampillado != null){
            return $this->response([
                "num_expediente" => $estampillado->getNumExpediente(),
                "hash" => $estampillado->getHash(),
                "qr" => $estampillado->getQr(),
            ]);
        }

        return $this->respondValidationError("El hash indicado no corresponde a un expediente válido");
    }


    /**
     * @return JsonResponse
     * @Route("", name="get_estampillados", methods={"GET"})
     */
    public function getEstampillados(){
        $entityManager = $this->getDoctrine()->getManager();
        $estampillados = $entityManager->getRepository(Estampillado::class)->findAll();

        $rta=[];
        foreach ($estampillados as $key => $value) {
            $rta[] = [
                "num_expediente" => $value->getNumExpediente(),
                "hash" => $value->getHash(),
                "qr" => $value->getQr(),
            ];
        }
        return $this->response($rta);
    }

    /**
     * @return JsonResponse
     * @Route("", name="new_estampillado", methods={"POST"})
     */
    public function createEstampillado(Request $request){
        $request = $this->transformJsonBody($request);
        $estatuto = $request->get('estatuto');
        $num_expediente = $request->get('num_expediente');
        $urlBase = $request->get('url_organismo_solicitante');
        $dev = $request->get('dev');

        if($estatuto == null || trim($estatuto) == '' ){
            return $this->respondValidationError("El párametro 'estatuto' es obligatorio");
        }
        
        if(!$this->is_base64($estatuto)){
            return $this->respondValidationError("El estatuto parece no ser un archivo válido");
        }
        
        if($num_expediente == null || trim($num_expediente) == ''){
            return $this->respondValidationError("El párametro 'num_expediente' es obligatorio");
        }

        if($urlBase == null || trim($urlBase) == ''){
            return $this->respondValidationError("El párametro 'url_organismo_solicitante' es obligatorio");
        }

        $hash = md5(random_bytes(20));

        if($dev == null){
            $qr = base64_encode($this->generateQr($urlBase."/".$hash));
        } else {
            $qr = "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";
        }
        
        try {
            $entityManager = $this->getDoctrine()->getManager();
            $estampillado = new Estampillado();
            $estampillado->setEstatuto($estatuto);
            $estampillado->setNumExpediente($num_expediente);
            $estampillado->setHash($hash);
            $estampillado->setQr($qr);
            $entityManager->persist($estampillado);
            $entityManager->flush();
        } catch (\Doctrine\DBAL\Exception\UniqueConstraintViolationException $e) {
            $this->setStatusCode(500);
            return $this->respondWithErrors("El número de expediente ya ha sido estampillado");
        } catch (\Exception $e) {
            $this->setStatusCode(500);
            return $this->respondWithErrors($e->getMessage());
        }        

        return $this->respondCreated([
            "hash" => $estampillado->getHash()
        ]);
    }

    private function is_base64($s){
        // Check if there are valid base64 characters
        if (!preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $s)) return false;
    
        // Decode the string in strict mode and check the results
        $decoded = base64_decode($s, true);
        if(false === $decoded) return false;
    
        // Encode the string again
        if(base64_encode($decoded) != $s) return false;
    
        return true;
    }

    private function generateQr($url, $key = "622ba6892dmsh07d7bf795f1a476p1d5971jsnb43d3e4bada2"){
        $client = new Client([
            'base_uri' => 'https://neutrinoapi-qr-code.p.rapidapi.com'
        ]);       

        try {
            $response = $client->request('POST', 'qr-code', [
                'verify' => (($this->getParameter('kernel.environment') == "dev")? false : true ),
                'headers' => [
                    'content-type' => 'application/x-www-form-urlencoded',
                    'x-rapidapi-host' => 'neutrinoapi-qr-code.p.rapidapi.com',
                    'x-rapidapi-key' => $key
                ],
                'form_params' => [
                    "content" => $url,
                    "width" => "256",
                    "height" => "256",
                    "fg-color" => "#000000",
                    "bg-color" => "#ffffff"
                ]
            ]);
        } catch (\Exception $e) {
            return $this->generateQr($url,"4fc11a3da3mshe830a408f668c5ap1439f7jsn1d0514b93f1d");
        }

        return (string) $response->getBody();
    }
}
