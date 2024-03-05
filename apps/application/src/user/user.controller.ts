import { Body, Controller, Get, Put } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  user: User = {
    id: 1,
    name: 'John Doe',
    age: 32,
  };

  @Get()
  getUser() {
    return this.user;
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    this.user.name = updateUserDto.name;
    return this.user;
  }
}
