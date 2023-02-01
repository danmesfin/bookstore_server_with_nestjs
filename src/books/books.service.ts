// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity
import { Books } from './books.entity';
// DTO
import { BookDto } from './dto/book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books)
    private readonly bookRepository: Repository<Books>,
  ) {}

  async findAll(): Promise<Books[]> {
    try {
      return await this.bookRepository.find({});
    } catch (err) {
      return err;
    }
  }

  async findById(id: string): Promise<Books> {
    try {
      return await this.bookRepository.findOne({ where: { id: id } });
    } catch (err) {
      return err;
    }
  }

  async insert(book: BookDto): Promise<Books> {
    const newBook = new Books();

    Object.keys(book).forEach((key) => {
      newBook[key] = book[key];
    });

    try {
      return await this.bookRepository.save(newBook);
    } catch (err) {
      return err;
    }
  }

  async update(oldBook: Books, updated_values: BookDto): Promise<Books> {
    const updatedBook = oldBook;

    Object.keys(updated_values).forEach((key) => {
      updatedBook[key] = updated_values[key];
    });

    try {
      return await this.bookRepository.save(updatedBook);
    } catch (err) {
      return err;
    }
  }

  async delete(id: string) {
    try {
      return await this.bookRepository.delete({ id });
    } catch (err) {
      return err;
    }
  }
}
