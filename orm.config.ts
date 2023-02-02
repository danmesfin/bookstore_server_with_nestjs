import { DataSourceOptions, createConnection, Connection } from 'typeorm';

const config: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'bookstore',
  synchronize: false,
  logging: true,
  entities: ['dist/**/*.entity.js'],
};
// const connection = createConnection({ type: 'mysql', 
//      url: 'localhost:8888/firstDB' 
// })
export default config;
