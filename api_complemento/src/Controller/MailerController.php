<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

/**
  * @return JsonResponse
  * @Route("/api/email")
 */
class MailerController extends ApiController
{
    private $from = 'dnpjargentina@gmail.com';

    /**
     * @Route("/send/expediente", name="send_nro_expediente", methods={"POST"})
     */
    public function sendNumExpediente(Request $request, MailerInterface $mailer)
    {
        $request = $this->transformJsonBody($request);
        $nombre_sociedad = $request->get('nombre_sociedad');
        $nombre_apoderado = $request->get('nombre_apoderado');
        $destinatario = $request->get('destinatario');
        $num_expediente = $request->get('num_expediente');

        if($nombre_sociedad == null || $nombre_apoderado == null || $destinatario == null || $num_expediente == null){
            $this->setStatusCode(400);
            return $this->respondWithErrors("Debe indicar todos los parámetros");
        }

        $email = (new TemplatedEmail())
                ->from($this->from)
                ->to(new Address($destinatario))
                ->subject('Número de expediente - DNPJ')

                // path of the Twig template to render
                ->htmlTemplate('emails/num_expediente.html.twig')

                // pass variables (name => value) to the template
                ->context([
                    'titulo' => "Su solicitud de sociedad ha sido iniciada",
                    'nombre_sociedad' => $nombre_sociedad,
                    'nombre_apoderado' => $nombre_apoderado,
                    'destinatario' => $destinatario,
                    'num_expediente' => $num_expediente
                ]);

        try {
            $send = $mailer->send($email);
        } catch (\Exception $e) {
            $this->setStatusCode(500);
            return $this->respondWithErrors($e->getMessage());
        }

        return $this->respondWithSuccess("Correo Enviado");
    }

    /**
     * @Route("/send/informacion-sociedad-incorrecta", name="send_informacion_sociedad_incorrecta", methods={"POST"})
     */
    public function sendInfoSociedadIncorrecta(Request $request, MailerInterface $mailer)
    {
        $request = $this->transformJsonBody($request);
        $nombre_sociedad = $request->get('nombre_sociedad');
        $nombre_apoderado = $request->get('nombre_apoderado');
        $destinatario = $request->get('destinatario');
        $plazo_correccion = $request->get('plazo_correccion');
        $url_boton = $request->get('url_boton');

        if($nombre_sociedad == null || $nombre_apoderado == null || $destinatario == null || $plazo_correccion == null || $url_boton == null){
            $this->setStatusCode(400);
            return $this->respondWithErrors("Debe indicar todos los parámetros");
        }

        $email = (new TemplatedEmail())
                ->from($this->from)
                ->to(new Address($destinatario))
                ->subject('Información de la solicitud incorrecta - DNPJ')

                // path of the Twig template to render
                ->htmlTemplate('emails/informacion_sociedad_incorrecta.html.twig')

                // pass variables (name => value) to the template
                ->context([
                    'titulo' => "Información de la solicitud incorrecta",
                    'nombre_sociedad' => $nombre_sociedad,
                    'nombre_apoderado' => $nombre_apoderado,
                    'destinatario' => $destinatario,
                    'plazo_correccion' => $plazo_correccion,
                    'url_boton' => $url_boton
                ]);

        try {
            $send = $mailer->send($email);
        } catch (\Exception $e) {
            $this->setStatusCode(500);
            return $this->respondWithErrors($e->getMessage());
        }

        return $this->respondWithSuccess("Correo Enviado");
    }

    /**
     * @Route("/send/estatuto-invalido", name="send_estatuto_invalido", methods={"POST"})
     */
    public function sendEstatutoInvalido(Request $request, MailerInterface $mailer)
    {
        $request = $this->transformJsonBody($request);
        $nombre_sociedad = $request->get('nombre_sociedad');
        $nombre_apoderado = $request->get('nombre_apoderado');
        $destinatario = $request->get('destinatario');
        $observaciones = $request->get('observacion');
        $url_boton = $request->get('url_boton');

        if($nombre_sociedad == null || $nombre_apoderado == null || $destinatario == null || $observaciones == null || $url_boton == null){
            $this->setStatusCode(400);
            return $this->respondWithErrors("Debe indicar todos los parámetros");
        }

        $email = (new TemplatedEmail())
                ->from($this->from)
                ->to(new Address($destinatario))
                ->subject('Estatuto inválido - DNPJ')

                // path of the Twig template to render
                ->htmlTemplate('emails/estatuto_invalido.html.twig')

                // pass variables (name => value) to the template
                ->context([
                    'titulo' => "El estatuto es inválido",
                    'nombre_sociedad' => $nombre_sociedad,
                    'nombre_apoderado' => $nombre_apoderado,
                    'destinatario' => $destinatario,
                    'observaciones' => $observaciones,
                    'url_boton' => $url_boton
                ]);

        try {
            $send = $mailer->send($email);
        } catch (\Exception $e) {
            $this->setStatusCode(500);
            return $this->respondWithErrors($e->getMessage());
        }

        return $this->respondWithSuccess("Correo Enviado");
    }

    /**
     * @Route("/send/fin-solicitud", name="send_fin_solicitud", methods={"POST"})
     */
    public function sendFinSolicitud(Request $request, MailerInterface $mailer)
    {
        $request = $this->transformJsonBody($request);
        $nombre_sociedad = $request->get('nombre_sociedad');
        $nombre_apoderado = $request->get('nombre_apoderado');
        $destinatario = $request->get('destinatario');
        $url_boton = $request->get('url_boton');

        if($nombre_sociedad == null || $nombre_apoderado == null || $destinatario == null || $url_boton == null){
            $this->setStatusCode(400);
            return $this->respondWithErrors("Debe indicar todos los parámetros");
        }

        $email = (new TemplatedEmail())
                ->from($this->from)
                ->to(new Address($destinatario))
                ->subject('Fin de la socilitud - DNPJ')

                // path of the Twig template to render
                ->htmlTemplate('emails/fin_solicitud.html.twig')

                // pass variables (name => value) to the template
                ->context([
                    'titulo' => "El estatuto es inválido",
                    'nombre_sociedad' => $nombre_sociedad,
                    'nombre_apoderado' => $nombre_apoderado,
                    'destinatario' => $destinatario,
                    'url_boton' => $url_boton
                ]);

        try {
            $send = $mailer->send($email);
        } catch (\Exception $e) {
            $this->setStatusCode(500);
            return $this->respondWithErrors($e->getMessage());
        }

        return $this->respondWithSuccess("Correo Enviado");
    }

    /**
     * @Route("/test", name="test_template", methods={"GET"})
     */
    public function testTemplate(){
        return $this->render('emails/num_expediente.html.twig',[
            'nombre_sociedad' => "Fed producciones",
            'destinatario' => 'tubarofederico@gmail.com',
            'num_expediente' => "asdvasdvasdvasd"
        ]);
    }
}