import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'daniel',
  password: '1234',
  database: 'bookstore',
  synchronize: false,
  logging: true,
  entities: ['src//*.entity.ts', 'dist//*entity.ts'],
};
export default config;
