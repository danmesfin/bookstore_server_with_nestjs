export class BookDto {
  readonly title: string;
  readonly genre: string;
  readonly description: string;
  readonly author: string;
  readonly publisher: string;
  readonly pages: string;
  readonly img_url: string;
}

/*
CREATE TABLE books (
    ID int NOT NULL,
      title varchar(255),
  genre varchar(255),
   description varchar(255),
  author varchar(255),
   publisher varchar(255),
  pages varchar(255),
  img_url varchar(255),
    PRIMARY KEY (ID)
);
*/
