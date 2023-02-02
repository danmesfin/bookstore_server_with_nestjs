import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
// Service
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';
// DTO
import { BookDto } from './dto/book.dto';
import { BookIdDto } from './dto/book-id.dto';
import { AuthService } from 'src/users/user.auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get()
  async findAll(@Request() req): Promise<BookIdDto[]> {
    return (await this.booksService.findAll()) as BookIdDto[];
  }

  @Get(':id')
  async findOneById(@Param() params): Promise<BookIdDto> {
    return await this.booksService.findById(params.id);
  }

  @Post()
  async create(
    @Request() req: any,
    @Body() book: BookDto,
  ): Promise<BookDto | any> {
    const header = req.headers.authorization;

    if (!header) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Not Authorized User',
      };
    }

    const token = header.split(' ')[1];

    const authorizedUser = await this.authService.decodeJwt(token);

    if (authorizedUser?.email) {
      const user = await await this.usersService.findByEmail(
        authorizedUser.email,
      );

      if (user) {
        return (await this.booksService.insert(book)) as BookDto;
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User Not Authorized to add Book',
        };
      }
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Not Authorized',
      };
    }
  }

  @Put(':id')
  async update(
    @Request() req: any,
    @Body() updatedBook: BookDto,
    @Param() params,
  ): Promise<BookIdDto | any> {

    const header = req.headers.authorization;

    if(!header){
      return{
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Not Authorized"
      }
    }

    const token = header.split(" ")[1];

    const authorizedUser = await this.authService.decodeJwt(token);

    if(authorizedUser?.email){
      const user = await await this.usersService.findByEmail(
        authorizedUser.email,
      );

      if(user){
        const oldBook = await this.booksService.findById(params.id);
        return await this.booksService.update(oldBook, updatedBook);
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User Not Authorized to add Book',
        };
      }
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Not Authorized',
      };
    }
  }

  @Delete(':id')
  async delete(@Param() params, @Request() req: any) {

    const header = req.headers.authorization;

    if(!header){
      return{
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Not Authorized"
      }
    }

    const token = header.split(" ")[1];

    const authorizedUser = await this.authService.decodeJwt(token);

    if(authorizedUser?.email){
      const user = await await this.usersService.findByEmail(
        authorizedUser.email,
      );

      if(user){
        return await this.booksService.delete(params.id);
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User Not Authorized to add Book',
        };
      }
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Not Authorized',
      };
    }

    return await this.booksService.delete(params.id);
  }
}
