import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { IncomingMessage, ServerResponse } from 'http';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { RoutesModule } from 'src/routes';
import { ServicesModule } from 'src/services';
import { AppController } from './app.controller';
import { AppFilter } from './app.filter';
import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';
import configs from './configs';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        // the ClsMiddleware is mounted below
        generateId: true,
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 30000, // milliseconds, max apigateway timeout
      max: 10000, // max items in cache
    }),
    ServicesModule,
    RoutesModule,
    ConfigModule.forRoot({
      load: [configs],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AppFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // middleware are mounted in order
    // ClsMiddleware has to be mounted first
    consumer.apply(ClsMiddleware).exclude('/docs/(.*)').forRoutes('(.*)');

    consumer
      .apply((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        // @ts-ignore
        if (req.query?.token !== 'Secure_2023') {
          throw new UnauthorizedException();
        }
        return next();
      })
      .forRoutes('/docs', '/docs-json');
  }
}
