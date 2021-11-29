FROM php:7.4-apache

RUN a2enmod rewrite

RUN apt-get update && \
    apt-get install -y libssl-dev zlib1g-dev curl git wget unzip netcat libxml2-dev libpq-dev libzip-dev \
    libfreetype6-dev \
    libpng-dev \
    libjpeg62-turbo-dev --no-install-recommends && \
    pecl install apcu && \
    docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) zip opcache intl pdo_pgsql pgsql gd && \
    docker-php-ext-enable apcu pdo_pgsql sodium && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN wget https://getcomposer.org/download/2.0.9/composer.phar \
    && mv composer.phar /usr/bin/composer && chmod +x /usr/bin/composer


WORKDIR /var/www 

# … cut for readability

COPY docker/apache.conf /etc/apache2/sites-enabled/000-default.conf
COPY --chown=33:33 . /var/www/html/

# … cut for readability

RUN chmod +x /var/www/html/docker/entrypoint.sh

CMD ["apache2-foreground"]

ENTRYPOINT ["/var/www/html/docker/entrypoint.sh"]