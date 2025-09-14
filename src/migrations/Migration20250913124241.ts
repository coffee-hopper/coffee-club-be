import { Migration } from '@mikro-orm/migrations';

export class Migration20250913124241 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "notifications" ("id" serial primary key, "user_id" int not null, "type" varchar(255) not null, "code" varchar(255) not null, "title" varchar(255) not null, "body" varchar(255) null, "metadata" jsonb null, "is_read" boolean not null default false, "read_at" timestamptz null, "created_at" timestamptz not null, "dedupe_key" varchar(255) null);`);
    this.addSql(`alter table "notifications" add constraint "notifications_dedupe_key_unique" unique ("dedupe_key");`);
    this.addSql(`create index "notifications_user_id_is_read_index" on "notifications" ("user_id", "is_read");`);
    this.addSql(`create index "notifications_user_id_created_at_index" on "notifications" ("user_id", "created_at");`);

    this.addSql(`alter table "notifications" add constraint "notifications_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "notifications" cascade;`);
  }

}
