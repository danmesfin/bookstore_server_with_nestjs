import {Injectable} from '@nestjs/common';
import {sign} from 'jsonwebtoken';
import { UsersService } from './users.service';
import jwt_decode from "jwt-decode";

export class AuthService{
    constructor(private usersService: UsersService) {}

    async signPayload(payload: any) {
        let token = sign(payload, 'secretKey', { expiresIn: '30' });
        return token;
    }
    async validateUser(payload: any) {
        return await this.usersService.findByEmail(payload);
    }

    async decodeJwt(token: any) {
        const decoded: any = jwt_decode(token);

        return decoded;

        console.log(decoded, "JWT TOKEN DECODE");
        // return awai
    }
}