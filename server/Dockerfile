FROM node:9.11

# UPDATE LOCAL DATETIME
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Europe/Paris /etc/localtime

# UPDATE & UPGRADE SERVER
RUN echo "deb http://ftp.fr.debian.org/debian jessie-backports main" >> /etc/apt/sources.list
RUN echo "deb http://ftp.fr.debian.org/debian jessie main non-free" >> /etc/apt/sources.list
RUN apt-get update && apt-get -y upgrade

# INSTALL CRONTAB
RUN apt-get install cron -y
ADD crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab

# make pam_loginuid.so optional for cron
# see https://github.com/docker/docker/issues/5663#issuecomment-42550548
RUN sed --regexp-extended --in-place \
    's/^session\s+required\s+pam_loginuid.so$/session optional pam_loginuid.so/' \
    /etc/pam.d/cron
