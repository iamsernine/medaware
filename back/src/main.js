require("reflect-metadata");
const { NestFactory } = require("@nestjs/core");
const { DocumentBuilder, SwaggerModule } = require("@nestjs/swagger");
const { AppModule } = require("./app.module");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });

  const config = new DocumentBuilder()
    .setTitle("MedAware Classify API")
    .setDescription("Medical text category classification via Minimax LLM")
    .setVersion("1.0")
    .addTag("classify")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(
    `Backend listening on http://localhost:${port}, Swagger at http://localhost:${port}/api-docs`,
  );
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
