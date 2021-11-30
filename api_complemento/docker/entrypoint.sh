#!/usr/bin/env bash

cd html
composer install -n
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
 
exec "$@"