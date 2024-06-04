import { EntityRepository } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends EntityRepository<User> {}
