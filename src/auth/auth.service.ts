import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { LoginUserOutput } from './dto/login-user.output';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserInput: RegisterUserInput): Promise<boolean> {
    const user = await this.usersService.getOneByEmail(registerUserInput.email);
    if (user) {
      throw new Error('Email in use');
    }
    const hash = await bcrypt.hash(registerUserInput.password, 10);

    await this.usersService.newUser({
      ...registerUserInput,
      password: hash,
    });
    return true;
  }

  async validateUser(email: string, password: string): Promise<string | null> {
    const user = await this.usersService.getOneByEmail(email);
    if (!user) {
      return null;
    }

    if (await bcrypt.compare(password, user?.password)) {
      return user.email;
    }

    return null;
  }

  async login(loginUserInput: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.usersService.getOneByEmail(loginUserInput.email);
    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
      }),
    };
  }
}
