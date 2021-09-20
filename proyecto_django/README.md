# Pasos para correr el proyecto django

1. Tener `Docker` instalado (junto con `docker compose`). En windows, `Docker Desktop` trae ambos, en linux fijarse [en este link](https://docs.docker.com/engine/install/).
2. Tener docker corriendo en la maquina
3. Abrir una terminal en la carpeta del proyecto de django, y correr el comando `docker-compose up --build`. Las siguientes veces, no sera necesario el flag `--build` a menos que se haya agregado alguna dependencia nueva. 
3. PD, este comando dejara el proyecto corriendo en la terminal, por lo que se debe dejar abierta. Si se quiere correr en `background`, agregar el flag `-d` al comando.
4. La primera vez que se levante el proyecto, habra que correr los siguientes comandos para realizar las migraciones a la base de datos:
      * `docker exec -ti django_DSSD python manage.py makemigrations`
      * `docker exec -ti django_DSSD python manage.py migrate`

IMPORTANTE: Cada vez que se agreguen modelos nuevos, o se cambien los existentes, estos comandos deben ser corridos para realizar las migraciones.

A este punto, la app deberia estar corriendo en `localhost:8000`, y se puede ver desde el navegador.

ADICIONALMENTE, el comando `docker exec -ti django_DSSD manage.py collectstatic` debe ser usado para generar los estaticos de la interfaz admin de django, si se quiere usar.