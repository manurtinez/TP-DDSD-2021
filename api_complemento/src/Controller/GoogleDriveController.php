<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Settings;


/**
  * @return JsonResponse
  * @Route("/api/drive")
 */
class GoogleDriveController extends ApiController
{
    private $parentFolderId = "1nPWdRyfHxJr-UuFtRiFIPvSEwBk6IgBW"; 

    /**
     * @Route("/carpeta-digital", name="crear_carpeta_digital", methods={"POST"})
     */
    public function crearCarpetaDigital(Request $request)
    {
        $nombre_sociedad = str_replace(' ', '', strtolower($request->get('nombre_sociedad')));
        $fecha_creacion = $request->get('fecha_creacion');
        $qr = $request->get('qr');
        $estatuto = $request->get('estatuto');
        $socios = $request->get('socios');

        if($nombre_sociedad == null || $fecha_creacion == null || $qr == null || $estatuto == null || $socios == null){
            $this->setStatusCode(400);
            return $this->respondWithErrors("Debe indicar todos los parámetros");
        }

        $estatuto_data = base64_decode($estatuto);
        $pathTemFileQr = $this->getParameter('kernel.project_dir') . '/public/qr_tmp.png';
        file_put_contents($pathTemFileQr, $estatuto_data);
        $googleDriveFile = $this->uploadFileToGoogleDriveAction($file);

        $file = new \stdClass();
        $file->fileName = $nombre_sociedad;
        $file->content = $this->createPDF($nombre_sociedad,$fecha_creacion,$qr,$socios);

        $googleDriveFile = $this->uploadFileToGoogleDriveAction($file);

        return $this->respondWithSuccess([
            "id" => $googleDriveFile->getId(),
            "name" => $googleDriveFile->getName(),
            "url" => "https://drive.google.com/open?id=".$googleDriveFile->getId()
        ]);
    }

    private function createPDF($nombre_sociedad,$fecha_creacion,$qr,$socios){
        $templateProcessor = new TemplateProcessor($this->getParameter('kernel.project_dir') . '/public/template.docx');

        $templateProcessor->setValue('nombre_sociedad', $nombre_sociedad);
        $templateProcessor->setValue('fecha_creacion', $fecha_creacion);
        $templateProcessor->setValue('qr', $qr);

        $qr_data = base64_decode($qr);
        $pathTemFileQr = $this->getParameter('kernel.project_dir') . '/public/qr_tmp.png';
        file_put_contents($pathTemFileQr, $qr_data);
        
        $templateProcessor->setImageValue('qr', array('path' => $pathTemFileQr, 'width' => 100, 'height' => 100, 'ratio' => false));
        
        $templateProcessor->cloneRow('apoderado_nombre', count($socios));
        foreach ($socios as $clave => $valor) {
            $templateProcessor->setValue('apoderado_nombre#'.($clave+1), $valor['nombre']);
            $templateProcessor->setValue('apoderado_porcentaje#'.($clave+1), $valor['aporte']);
        }

        $publicDir = $this->getParameter('kernel.project_dir') . '/public';
        $pathTemFileDoc = $publicDir . '/temp_pdf.docx';
        $templateProcessor->saveAs($pathTemFileDoc);

        
        // Make sure you have `dompdf/dompdf` in your composer dependencies.
        Settings::setPdfRendererName(Settings::PDF_RENDERER_DOMPDF);
        // Any writable directory here. It will be ignored.
        Settings::setPdfRendererPath($publicDir);
        
        $phpWord = IOFactory::load($pathTemFileDoc, 'Word2007');

        $pathTemFilePdf = $publicDir . '/temp_pdf.pdf';
        $phpWord->save('temp_pdf.pdf', 'PDF');
        $file = file_get_contents($pathTemFilePdf);
        unlink($pathTemFileDoc);
        unlink($pathTemFilePdf);
        unlink($pathTemFileQr);
        return $file;
    }

    private function findDriveFileByQuery($queryString){
        $service = $this->getDriveService();
        $optParams = array(
            // 'pageSize' => 10,
            'q' => $queryString,
            'spaces' => 'drive',
            'orderBy' => "createdTime desc"
        );
        $results = $service->files->listFiles($optParams);
        
        $files = [];
        foreach ($results['files'] as $key => $value) {
            $file = [
                "id" => $value->getId(),
                "name" => $value->getName(),
                "url" => "https://drive.google.com/open?id=".$value->getId()
            ];
            array_push($files,$file);
        }
        return $files;
    }

    private function uploadFileToGoogleDriveAction($file){
        $fileName = $file->fileName;
        $driveFile = $this->findDriveFileByQuery("'".$this->parentFolderId."' in parents and name = '".$fileName."'"); // Obtengo un archivo
        
        if(empty($driveFile)){
            $accion = 'A';
        } else {
            $accion = 'M';
        }

        $mensaje = "";
        try {
            $service = $this->getDriveService();
            
            $newDriveFile = new \Google\Service\Drive\DriveFile();
            $newDriveFile->setName($fileName); // Nombre completo con extensión
            $newDriveFile->setDescription("Cargado desde Symfony");

            $document = $file->content;
            if($accion == "A"){
                $newDriveFile->setParents([$this->parentFolderId]); 
                $resultado = $service->files->create($newDriveFile,['data' => $document]);
            } else {
                $resultado = $service->files->update($driveFile[0]['id'],$newDriveFile,['data' => $document]);
            }
            return $resultado;

        } catch (\Google\Service\GoogleServiceException $gs) {
            $mensaje = json_decode($gs->getMessage());
            $mensaje = $mensaje->error->message();
        } catch (Exception $e){
            $mensaje = $e->getMessage();
        }

        return null;
    }

    private function getDriveService(){
        $jsonKey = $this->getParameter('kernel.project_dir') . '/public/google_drive_credentials.json'; 
        $googleClient = new \Google\Client();
        $googleClient->setAuthConfig($jsonKey);
        $googleClient->addScope(\Google\Service\Drive::DRIVE);

        return new \Google\Service\Drive($googleClient);
    }

}