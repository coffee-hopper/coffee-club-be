import { MikroORM } from '@mikro-orm/postgresql';
import config from '../mikro-orm.config';

// You already ran 20250717112601 (your logs show "Applied").
// Baseline the 3 July 18 migrations so MikroORM won't re-run them.
const NAMES = [
  'Migration20250718080400',
  'Migration20250718081436',
  'Migration20250718083241',
];

async function main() {
  const orm = await MikroORM.init(config as any);
  const conn = orm.em.getConnection();

  // 1) Ensure table exists (harmless if it already does)
  await conn.execute(`
    create table if not exists "mikro_orm_migrations" (
      "id" serial primary key,
      "name" varchar(255) not null,
      "executed_at" timestamptz not null default now()
    );
  `);

  // 2) Ensure "name" is unique — add an index if missing
  await conn.execute(`
    do $$
    begin
      if not exists (
        select 1 from pg_indexes 
        where schemaname = 'public' and indexname = 'mikro_orm_migrations_name_key'
      ) then
        create unique index "mikro_orm_migrations_name_key" 
          on "mikro_orm_migrations" ("name");
      end if;
    end
    $$;
  `);

  // 3) Insert rows if they don't exist (no ON CONFLICT required)
  for (const name of NAMES) {
    await conn.execute(
      `
      insert into "mikro_orm_migrations" ("name","executed_at")
      select ?, now()
      where not exists (
        select 1 from "mikro_orm_migrations" m where m."name" = ?
      );
      `,
      [name, name],
    );
  }

  await orm.close(true);
  console.log('✅ Baselined migrations:', NAMES);
}

main().catch((err) => {
  console.error('❌ Baseline failed:', err);
  process.exit(1);
});
