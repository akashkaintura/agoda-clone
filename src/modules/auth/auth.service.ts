import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../../common/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const payload = { username: loginDto.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
