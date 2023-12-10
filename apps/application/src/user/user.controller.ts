import { Body, Controller, Get, Put } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserGateway } from './user.gateway';

@Controller('user')
export class UserController {
  user: User = {
    id: 1,
    name: 'John Doe',
  };

  constructor(private readonly userGateway: UserGateway) {}

  @Get()
  getUser() {
    return this.user;
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    this.user.name = updateUserDto.name;
    this.userGateway.userChanged();
    return this.user;
  }
}
