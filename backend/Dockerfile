FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean install -DskipTests
EXPOSE 8080
CMD ["sh", "-c", "java -jar target/*.jar --spring.datasource.url=$SPRING_DATASOURCE_URL --spring.datasource.username=$SPRING_DATASOURCE_USERNAME --spring.datasource.password=$SPRING_DATASOURCE_PASSWORD --spring.jpa.hibernate.ddl-auto=update"]