import { Migration } from '@mikro-orm/migrations';

export class Migration20250717112601 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "product" add column "image_name" varchar(255) not null;`);
    this.addSql(`alter table "product" alter column "category" type varchar(255) using ("category"::varchar(255));`);
    this.addSql(`alter table "product" alter column "category" set default 'coffee';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "product" drop column "image_name";`);

    this.addSql(`alter table "product" alter column "category" type varchar(255) using ("category"::varchar(255));`);
    this.addSql(`alter table "product" alter column "category" set default 'drink';`);
  }

}
