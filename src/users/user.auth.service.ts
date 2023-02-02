import {Injectable} from '@nestjs/common';
import {sign} from 'jsonwebtoken';
import { UsersService } from './users.service';

export class AuthService{
    constructor(private usersService: UsersService) {}

    async signPayload(payload: any) {
        let token = sign(payload, 'secretKey', { expiresIn: '30' });
        return token;
    }
    async validateUser(payload: any) {
        return await this.usersService.findByEmail(payload);
    }
}