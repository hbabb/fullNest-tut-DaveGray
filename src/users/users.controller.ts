import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // localhost:3000/users (domain/route)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET: /users or /user?role=value (this is query param)
  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    return this.usersService.findAll(role);
  }

  @Get(':id') // GET: /users/:id
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id, 10));
  }
  /*
  All following methods will be appended to the :id route. If you need additional static routes, place them above the dynamic routes - @Get(':id')
  */

  @Post() // POST: /users
  create(
    @Body()
    user: {
      name: string;
      email: string;
      role: 'INTERN' | 'ENGINEER' | 'ADMIN';
    },
  ) {
    return this.usersService.create(user);
  }

  @Patch(':id') // PATCH: /users/:id
  update(
    @Param('id') id: string,
    @Body()
    userUpdate: {
      name?: string;
      email?: string;
      role?: 'INTERN' | 'ENGINEER' | 'ADMIN';
    },
  ) {
    return this.usersService.update(parseInt(id, 10), userUpdate);
  }

  @Delete(':id') // DELETE: /users/:id
  delete(@Param('id') id: string) {
    return this.usersService.delete(parseInt(id, 10));
  }
}
