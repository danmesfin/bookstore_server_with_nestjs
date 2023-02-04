import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Request,
  HttpStatus,
  HttpException,
  UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";

import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
// Service
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';
// DTO
import { BookDto } from './dto/book.dto';
import { BookIdDto } from './dto/book-id.dto';
import { AuthService } from 'src/users/user.auth.service';
import { UsersService } from 'src/users/users.service';

export const multerConfig = {
  dest: './public/images',
};

let fileName="";

export const multerOptions = {
  limits: {
    fileSize: 100023,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },

  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      fileName = `${uuid()}${extname(file.originalname)}`
      cb(null, fileName);
    },
  }),
};

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
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(
    @Request() req: any,
    @Body() book: BookDto,
    @UploadedFile() file
  ): Promise<BookDto | any> {
    const header = req.headers.authorization;
    console.log(file);
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
        book.img_url = fileName;
        console.log(book)
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

    if (!header) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Not Authorized',
      };
    }

    const token = header.split(' ')[1];

    const authorizedUser = await this.authService.decodeJwt(token);

    if (authorizedUser?.email) {
      const user = await await this.usersService.findByEmail(
        authorizedUser.email,
      );

      if (user) {
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

    if (!header) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Not Authorized',
      };
    }

    const token = header.split(' ')[1];

    const authorizedUser = await this.authService.decodeJwt(token);

    if (authorizedUser?.email) {
      const user = await await this.usersService.findByEmail(
        authorizedUser.email,
      );

      if (user) {
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