import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./users.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { CityService } from "src/city/city.service";
import { City } from "src/city/city.model";
import { AuthService } from "src/auth/auth.service";
import { throws } from "assert";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private cityService: CityService
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async addFavoriteCity({
    userId,
    cityName,
  }: {
    userId: number;
    cityName: string;
  }) {
    let city = await this.cityService.getCityByName(cityName);
    if (!city) {
      city = await this.cityService.createCity({ name: cityName });
    }
    const user = await this.userRepository.findByPk(userId, {
      include: { all: true },
    });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    await user.$add("favouriteCities", city);

    return {
      message: "City added to favorites",
      favouriteCities: user.favouriteCities,
    };
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findByPk(userId, {
      include: { all: true },
    });
    return user;
  }

  async getAllUser() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      include: { all: true },
    });
    return user;
  }

  async changeUsername(oldUsername: string, newUsername: string) {
    const user = await this.getUserByUsername(oldUsername);
    if (!user) {
      throw new Error(`User with username ${oldUsername} not found`);
    }
    user.username = newUsername;
    await user.save();
    return user;
  }

  async changeEmail(oldEmail: string, newEmail: string) {
    const user = await this.getUserByEmail(oldEmail);
    if (!user) {
      throw new Error(`User with email ${oldEmail} not found`);
    }
    user.email = newEmail;
    await user.save();
    return user;
  }
}
