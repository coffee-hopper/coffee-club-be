import {
  Entity,
  PrimaryKey,
  Property,
  // OneToMany,
  // Collection,
  Unique,
} from '@mikro-orm/core';
// import { Rating } from './rating.entity';
// import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  username!: string;

  @Property({ nullable: true })
  password?: string;

  @Property({ nullable: true })
  googleId?: string;

  @Property({ nullable: true })
  googleEmail?: string;

  @Property()
  role!: string;

  // @OneToMany(() => Rating, (rating) => rating.user)
  // ratings = new Collection<Rating>(this);

  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments = new Collection<Comment>(this);
}
