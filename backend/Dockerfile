# Usando imagem oficial do OpenJDK 21
FROM eclipse-temurin:21-jdk-alpine

# Define diretório do app
WORKDIR /app

# Copia o JAR do backend para o container
COPY target/lojacrysleao-api-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta que o backend escuta (exemplo 8080)
EXPOSE 8080

# Comando para rodar o backend
ENTRYPOINT ["java", "-jar", "app.jar"]
