import { Migration } from '@mikro-orm/migrations';

export class Migration20250718081436 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "invoice" drop constraint "invoice_payment_id_foreign";`);

    this.addSql(`alter table "invoice" alter column "payment_id" type int using ("payment_id"::int);`);
    this.addSql(`alter table "invoice" alter column "payment_id" drop not null;`);
    this.addSql(`alter table "invoice" add constraint "invoice_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "invoice" drop constraint "invoice_payment_id_foreign";`);

    this.addSql(`alter table "invoice" alter column "payment_id" type int using ("payment_id"::int);`);
    this.addSql(`alter table "invoice" alter column "payment_id" set not null;`);
    this.addSql(`alter table "invoice" add constraint "invoice_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade;`);
  }

}
