import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const mikroOrmConfig: Options = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'cafe-rating',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  debug: true,
  driver: PostgreSqlDriver,
  //   highlighter: new SqlHighlighter(),
};

export default mikroOrmConfig;
