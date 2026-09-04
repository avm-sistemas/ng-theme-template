# Estágio 1: build Angular
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: nginx serve os arquivos estáticos
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Remove config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o build Angular
COPY --from=builder /app/dist/ng-theme-template/browser .

# Copia config de produção (substituída pelo volume no compose se necessário)
COPY nginx/nginx.dev.conf /etc/nginx/conf.d/default.conf

# Diretório para o ACME challenge do Certbot
RUN mkdir -p /var/www/certbot

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
