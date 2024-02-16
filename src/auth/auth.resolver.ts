import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegisterUserInput } from './dto/register-user.input';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guard/gql-auth.guard';
import { LoginUserOutput } from './dto/login-user.output';
import { LoginUserInput } from './dto/login-user.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Boolean)
  register(@Args('registerUserInput') registerUserInput: RegisterUserInput) {
    return this.authService.registerUser(registerUserInput);
  }

  @Query(() => LoginUserOutput)
  @UseGuards(GqlAuthGuard)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.login(loginUserInput);
  }
}
