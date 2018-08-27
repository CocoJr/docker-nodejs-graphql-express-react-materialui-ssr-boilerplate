### Package

 - node 9.11 (hostname: client & server & mobile)
 - mysql 5.7 (hostname: db)

### Installation

1. Create and customise our `.env` files using `.env.dist` template
2. Copy the `server/crontab.dist` to `server/crontab` and add your own crontab
2. Start the project with `docker-compose up --build[ -d]`

### Information

This is a complete boilerplate using react + graphql with nodejs and apollo to create your own website.
This boilerplate include complete user management and administration.
It's compatible with server side rendering, using express, and optimized for SEO using Helmet.
Don't hesite to fork this project and to submit your PR if you want to contribute to this boilerplate.

### Production

Don't forget to use a reverse proxy in your production server, and use with certbot-auto to secure your projects with HTTPS.

### Recommandation

Separate your volumes and your docker when you use this boilerplate. Use different git repository and submodule.
