# FROM php:7.4-apache
# COPY . /var/www/html/
# WORKDIR /var/www/html/
# # RUN apt-get update
# # RUN apt-get install --no-install-recommends -y libpq-dev \
# #     zlib1g-dev \
# #     libzip-dev \
# #     unzip 
# # RUN apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql zip
# # RUN php composer.phar install

# RUN apt-get update && \
#     apt-get install -y --no-install-recommends libssl-dev zlib1g-dev curl git unzip netcat libxml2-dev libpq-dev libzip-dev && \
#     pecl install apcu && \
#     docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql && \
#     docker-php-ext-install -j$(nproc) zip opcache intl pdo_pgsql pgsql && \
#     docker-php-ext-enable apcu pdo_pgsql sodium && \
#     apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# RUN wget https://getcomposer.org/download/2.0.9/composer.phar \ 
#     && mv composer.phar /usr/bin/composer && chmod +x /usr/bin/composer

# EXPOSE 80

# FROM php:7.4-apache

# # Arguments defined in docker-compose.yml
# # ARG user
 
# RUN a2enmod rewrite
 
# RUN apt-get update && \
#     apt-get install -y libssl-dev zlib1g-dev curl git unzip netcat libxml2-dev libpq-dev libzip-dev --no-install-recommends && \
#     # wget && \
#     pecl install apcu && \
#     docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql && \
#     docker-php-ext-install -j$(nproc) zip opcache intl pdo_pgsql pgsql && \
#     docker-php-ext-enable apcu pdo_pgsql sodium && \
#     apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# # RUN wget https://getcomposer.org/download/2.0.9/composer.phar \
# #     && mv composer.phar /usr/bin/composer && chmod +x /usr/bin/composer
 
# # COPY docker/apache.conf /etc/apache2/sites-enabled/000-default.conf


# # Create system user to run Composer and Artisan Commands
# # RUN useradd -G www-data,root -d /home/$user $user
# # RUN mkdir -p /home/$user/.composer && \
# #     chown -R $user:$user /home/$user && \
# #     chgrp -R www-data /var


# WORKDIR /var/www

# CMD ["apache2-foreground"]
# # Set the user
# # USER $user


#tercer prueba
FROM php:7.4-apache
 
RUN a2enmod rewrite

RUN apt-get update && \
    apt-get install -y libssl-dev zlib1g-dev curl git wget unzip netcat libxml2-dev libpq-dev libzip-dev --no-install-recommends && \
    # wget && \
    pecl install apcu && \
    docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql && \
    docker-php-ext-install -j$(nproc) zip opcache intl pdo_pgsql pgsql && \
    docker-php-ext-enable apcu pdo_pgsql sodium && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
 
# RUN apt-get update \
#   && apt-get install -y libzip-dev git wget --no-install-recommends \
#   && apt-get clean \
#   && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
 
# RUN docker-php-ext-install pdo mysqli pdo_mysql zip;
 
RUN wget https://getcomposer.org/download/2.0.9/composer.phar \
    && mv composer.phar /usr/bin/composer && chmod +x /usr/bin/composer
 

WORKDIR /var/www 

# … cut for readability
 
COPY docker/apache.conf /etc/apache2/sites-enabled/000-default.conf
COPY docker/entrypoint.sh /entrypoint.sh
COPY . /var/www
 
# … cut for readability
 
RUN chmod +x /entrypoint.sh
 
CMD ["apache2-foreground"]
 
ENTRYPOINT ["/entrypoint.sh"]