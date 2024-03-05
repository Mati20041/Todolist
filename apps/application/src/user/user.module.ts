import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserGateway } from './user.gateway';

@Module({
  controllers: [UserController],
  providers: [UserGateway],
})
export class UserModule {}
