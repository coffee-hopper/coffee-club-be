import { Migration } from '@mikro-orm/migrations';

export class Migration20250322123625 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "product" ("id" serial primary key, "name" varchar(255) not null, "category" varchar(255) not null default 'drink', "description" varchar(255) not null, "price" int not null, "stock_quantity" int not null, "loyalty_multiplier" int not null default 1, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "order" ("id" serial primary key, "user_id" int not null, "total_amount" int not null, "status" varchar(255) not null default 'pending', "created_at" timestamptz not null);`);

    this.addSql(`create table "payment" ("id" serial primary key, "order_id" int not null, "iyzico_transaction_id" varchar(255) not null, "amount" int not null, "payment_method" varchar(255) not null, "status" varchar(255) not null, "paid_at" timestamptz not null);`);
    this.addSql(`alter table "payment" add constraint "payment_order_id_unique" unique ("order_id");`);

    this.addSql(`create table "order_item" ("id" serial primary key, "order_id" int not null, "product_id" int not null, "quantity" int not null, "price" int not null);`);

    this.addSql(`create table "invoice" ("id" serial primary key, "order_id" int not null, "billing_address" varchar(255) not null, "total_amount" int not null, "invoice_date" timestamptz not null);`);
    this.addSql(`alter table "invoice" add constraint "invoice_order_id_unique" unique ("order_id");`);

    this.addSql(`create table "loyalty" ("id" serial primary key, "user_id" int not null, "product_id" int not null, "points" int not null default 1, "earned_at" timestamptz not null, "note" varchar(255) null);`);

    this.addSql(`alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "payment" add constraint "payment_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);

    this.addSql(`alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
    this.addSql(`alter table "order_item" add constraint "order_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "invoice" add constraint "invoice_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);

    this.addSql(`alter table "loyalty" add constraint "loyalty_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "loyalty" add constraint "loyalty_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "order_item" drop constraint "order_item_product_id_foreign";`);

    this.addSql(`alter table "loyalty" drop constraint "loyalty_product_id_foreign";`);

    this.addSql(`alter table "payment" drop constraint "payment_order_id_foreign";`);

    this.addSql(`alter table "order_item" drop constraint "order_item_order_id_foreign";`);

    this.addSql(`alter table "invoice" drop constraint "invoice_order_id_foreign";`);

    this.addSql(`drop table if exists "product" cascade;`);

    this.addSql(`drop table if exists "order" cascade;`);

    this.addSql(`drop table if exists "payment" cascade;`);

    this.addSql(`drop table if exists "order_item" cascade;`);

    this.addSql(`drop table if exists "invoice" cascade;`);

    this.addSql(`drop table if exists "loyalty" cascade;`);
  }

}
