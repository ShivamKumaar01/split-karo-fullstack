import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          console.log("JWT from cookie:", req?.cookies?.token);
          return req?.cookies?.token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
       passReqToCallback: true, 
    });
  }

  async validate(req: Request, payload: any) {
    console.log('Inside validate method ');
    console.log('Payload:', payload);
    return { userId: payload.sub, email: payload.useremail };
  }
}