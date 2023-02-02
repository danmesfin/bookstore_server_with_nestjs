import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
// import { Exclude, Expose } from "class-transformer";
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  // @BeforeInsert()
  // hashPassword() {
  //   this.password = crypto.createHmac('sha256', this.password).digest('hex');
  // }
  @Column()
  password: string;
}
