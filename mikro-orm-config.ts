import { Options } from '@mikro-orm/core';

const mikroOrmConfig: Options = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: 'cafe-rating',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5449,
  debug: true,
  //   highlighter: new SqlHighlighter(),
};

export default mikroOrmConfig;
