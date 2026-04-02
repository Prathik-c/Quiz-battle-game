FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean install -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/*.jar"]