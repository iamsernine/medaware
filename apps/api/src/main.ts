import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())

  const config = new DocumentBuilder()
    .setTitle('MedAware API')
    .setDescription('Reddit-style medical Q&A MVP')
    .setVersion('0.1.0')
    .addTag('users')
    .addTag('questions')
    .addTag('answers')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
