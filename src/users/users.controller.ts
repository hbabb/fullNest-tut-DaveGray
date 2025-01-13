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

@Controller('users') // localhost:3000/users (domain/route)
export class UsersController {
  /**
   * GET: /users
   * GET:/users/:id
   * POST: /users
   * PATCH: /users/:id
   * DELETE: /users/:id
   */

  @Get() // GET: /users or /user?role=value (this is query param)
  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    return []; // TODO: refactor to return all users
  }

  @Get(':id') // GET: /users/:id
  findOne(@Param('id') id: string) {
    return { id };
  }
  /*
  All following methods will be appended to the :id route. If you need additional static routes, place them above the dynamic routes - @Get(':id')
  */

  @Post() // POST: /users
  create(@Body() user: {}) {
    return user;
  }

  @Patch(':id') // PATCH: /users/:id
  update(@Param('id') id: string, @Body() userUpdate: {}) {
    return { id, ...userUpdate };
  }

  @Delete(':id') // DELETE: /users/:id
  delete(@Param('id') id: string) {
    return { id };
  }
}
