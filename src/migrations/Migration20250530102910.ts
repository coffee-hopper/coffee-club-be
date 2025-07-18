import { Migration } from '@mikro-orm/migrations';

export class Migration20250530102910 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "product" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "product" alter column "description" drop not null;`);

    this.addSql(`alter table "user" add column "google_picture" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "product" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "product" alter column "description" set not null;`);

    this.addSql(`alter table "user" drop column "google_picture";`);
  }

}
