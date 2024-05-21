import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { PostgreSqlOptions } from '@mikro-orm/postgresql/PostgreSqlMikroORM';
import { Migrator } from '@mikro-orm/migrations'; // or `@mikro-orm/migrations-mongodb`

const mikroOrmConfig: PostgreSqlOptions = {
  extensions: [Migrator],
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

export default defineConfig(mikroOrmConfig);
