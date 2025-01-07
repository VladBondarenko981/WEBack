import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcryptjs";
import { User } from "src/users/users.model";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        "Пользователь с таким email существует",
        HttpStatus.BAD_REQUEST
      );
    }
    const candidateUser = await this.userService.getUserByUsername(
      userDto.username
    );
    if (candidateUser) {
      throw new HttpException(
        "Пользователь с таким username существует",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    console.log(this.generateToken(user));
    return this.generateToken(user);
  }

  async generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      username: user.username,
      favoriteCities: user.favouriteCities,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: "Неккоретній эмейил или пароль",
    });
  }

  async changePassword(email: string, password: string, newPassword: string) {
    console.log(email, password, newPassword);
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        message: "Пользователь с таким email не найден",
      });
    }
    const passwordEquals = await bcrypt.compare(password, user.password);
    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: "Неверный старый пароль",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 5);
    user.password = hashPassword;
    await user.save();
    const token = this.generateToken(user);
    return token;
  }
}
