import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersDTO } from './users.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './user.auth.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Get()
  async showAllUsers() {
    const users = await this.usersService.showAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      users,
    };
  }

  @Post("register")
  async registerUser(@Body() data: RegisterUserDTO) {

    const {name, email, password} = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const formData = {name: name, email: email, password: hashedPassword}
    const user = await this.usersService.findByEmail(email);
    
    if(user){
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "User Already exists"
      }
    } else{
      const user = await this.usersService.create(formData);

      const payload = {
        email: user.email
      }

      const token = await this.authService.signPayload(payload);

      return {
        statusCode: HttpStatus.OK,
        message: 'User created successfully',
        token,
        user,
      };
    }
  }

  @Post("login")
  async loginUser(@Body() data: LoginUserDTO) {

    const {email, password} = data;

    console.log(data, "data");

    const user = await (await this.usersService.findByEmail(email));

    console.log("Before Comparing")
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("After Comparing")

    if(passwordMatch){

      const payload = {
        email: user.email
      }

      const token = await this.authService.signPayload(payload);
        return {
          statusCode: HttpStatus.OK,
          token,
          user,
        };
    }
  }

  @Get(':id')
  async readUser(@Param('id') id: number) {
    const data = await this.usersService.read(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data,
    };
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() data: Partial<UsersDTO>) {
    await this.usersService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.usersService.destroy(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }
}
