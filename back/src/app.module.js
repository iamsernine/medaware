const { Module, NestModule, MiddlewareConsumer } = require('@nestjs/common');
const { APP_GUARD } = require('@nestjs/core');
const { ThrottlerModule, ThrottlerGuard } = require('@nestjs/throttler');
const { ClassifyModule } = require('./classify/classify.module');
const { LoggingMiddleware } = require('./logging.middleware');

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    ClassifyModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
class AppModule {
  configure(consumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}

module.exports = { AppModule };
