#!/usr/bin/env bash
 
composer install -n
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
 
exec "$@"