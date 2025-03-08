import { Migration } from '@mikro-orm/migrations';

export class Migration20250308211255 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_username_unique";');

    this.addSql('alter table "user" add column "email" varchar(255) null, add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;');
    this.addSql('alter table "user" alter column "role" type varchar(255) using ("role"::varchar(255));');
    this.addSql('alter table "user" alter column "role" set default \'user\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "email", drop column "created_at", drop column "updated_at";');

    this.addSql('alter table "user" alter column "role" drop default;');
    this.addSql('alter table "user" alter column "role" type varchar(255) using ("role"::varchar(255));');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

}
