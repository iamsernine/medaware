const { Injectable, NestMiddleware } = require('@nestjs/common');

@Injectable()
class LoggingMiddleware {
  use(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        [new Date().toISOString(), req.method, req.originalUrl, res.statusCode, `${duration}ms`].join(' ')
      );
    });
    next();
  }
}

module.exports = { LoggingMiddleware };
