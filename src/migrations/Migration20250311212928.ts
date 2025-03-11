import { Migration } from '@mikro-orm/migrations';

export class Migration20250311212928 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "otp" ("id" serial primary key, "phone" varchar(255) not null, "expires_at" timestamptz not null, "is_used" boolean not null default false, "created_at" timestamptz not null);');

    this.addSql('alter table "user" add column "phone" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "otp" cascade;');

    this.addSql('alter table "user" drop column "phone";');
  }

}
