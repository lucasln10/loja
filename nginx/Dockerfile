FROM nginx:alpine

# Copia o arquivo de configuração nginx.conf para dentro do container
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
