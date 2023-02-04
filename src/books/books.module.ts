import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Controller
import { BooksController } from './books.controller';
// Service
import { BooksService } from './books.service';
// Entity
import { Books } from './books.entity';

import { AuthService } from 'src/users/user.auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersEntity } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, Books])],
  controllers: [BooksController],
  providers: [BooksService, AuthService, UsersService],
})
export class BooksModule {}
