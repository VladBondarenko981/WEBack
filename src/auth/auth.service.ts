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
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Проверка формата email
      if (!emailRegex.test(userDto.email)) {
        throw new HttpException(
          "Incorrect email format",
          HttpStatus.BAD_REQUEST
        );
      }

      // Валидация пароля
      if (userDto.password.length < 6) {
        throw new HttpException(
          "Password must be at least 6 characters long",
          HttpStatus.BAD_REQUEST
        );
      }

      const user = await this.validateUser(userDto);

      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      return this.generateToken(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          "Error while trying to log in",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async registration(userDto: CreateUserDto) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDto.email)) {
      throw new HttpException("Incorrect email format", HttpStatus.BAD_REQUEST);
    }
    if (userDto.password.length < 6) {
      throw new HttpException(
        "Password must be at least 6 characters long",
        HttpStatus.BAD_REQUEST
      );
    }
    if (userDto.username.length < 3) {
      throw new HttpException(
        "Username must be at least 3 characters long",
        HttpStatus.BAD_REQUEST
      );
    }
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        "A user with this email exists",
        HttpStatus.BAD_REQUEST
      );
    }
    const candidateUser = await this.userService.getUserByUsername(
      userDto.username
    );
    if (candidateUser) {
      throw new HttpException(
        "A user with this username exists",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
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
      message: "Incorrect email or password",
    });
  }

  async changePassword(email: string, password: string, newPassword: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        message: "User with this email not found",
      });
    }
    const passwordEquals = await bcrypt.compare(password, user.password);
    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: "Incorrect old password",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 5);
    user.password = hashPassword;
    await user.save();
    const token = this.generateToken(user);
    return token;
  }
}
