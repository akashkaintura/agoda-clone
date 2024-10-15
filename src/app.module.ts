import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import awsConfig from './config/aws.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [awsConfig, jwtConfig],
    }),
    AuthModule,
    UsersModule,
    PropertiesModule,
    BookingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
