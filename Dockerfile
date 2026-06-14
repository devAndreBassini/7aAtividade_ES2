# Estágio 1: Compilação com Maven e Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Estágio 2: Execução com uma imagem Java leve
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/saude-1.0-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]