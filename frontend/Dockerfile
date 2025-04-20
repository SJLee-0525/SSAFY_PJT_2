# nginx.Dockerfile (정적 전용)
FROM nginx:stable-alpine

USER root

RUN mkdir -p /usr/share/nginx/master/html
RUN mkdir -p /usr/share/nginx/release/html
RUN mkdir -p /var/www/images

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./images /var/www/images

ENV TZ=Asia/Seoul
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo "Asia/Seoul" > /etc/timezone

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]