export class BookDto {
  readonly title: string;
  readonly genre: string;
  readonly description: string;
  readonly author: string;
  readonly publisher: string;
  readonly pages: string;
  readonly price: string;
  img_url: string;
  readonly year: string;
  readonly status: string;
}

/*
CREATE TABLE books (
      ID int NOT NULL AUTO_INCREMENT,
      title varchar(255),
      genre varchar(255),
      description varchar(255),
      author varchar(255),
      publisher varchar(255),
      pages varchar(255),
      img_url varchar(255),
      year varchar(255),
      status varchar(255),
      price varchar(255),
      PRIMARY KEY (ID)
 );


{
    "title": "Self to Lose, Self to Find",
    "genre": "Spiritual",
    "description": "About losing one's self to find ourselves in Christ",
    "author": "Jimmy",
    "publisher": "Made with Love",
    "pages": "200",
    "img_url": null
    "year": "1239"
    "status": true
}


*/
