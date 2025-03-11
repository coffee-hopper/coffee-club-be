import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { OTP } from 'src/entities/otp.entity';

@Injectable()
export class OTPRepository extends EntityRepository<OTP> {}
