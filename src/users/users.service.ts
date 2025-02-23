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

  // Создание пользователя и добавление городов
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
    // 1. Проверяем, существует ли город с таким названием
    let city = await this.cityService.getCityByName(cityName);
    // 2. Если города нет в базе, создаем новый
    if (!city) {
      city = await this.cityService.createCity({ name: cityName });
    }
    // 3. Находим пользователя по ID
    const user = await this.userRepository.findByPk(userId, {
      include: { all: true },
    });
    if (!user) {
      throw new Error(`Пользователь с ID ${userId} не найден`);
    }
    // 4. Добавляем город в список избранных
    await user.$add("favouriteCities", city);
    // Возвращаем обновленного пользователя с городами
    return {
      message: "Город добавлен в избранное",
      favouriteCities: user.favouriteCities,
    };
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findByPk(userId, {
      include: { all: true },
    });
    console.log("User found:", user);
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
      throw new Error(`Пользователь с юзернеймом ${oldUsername} не найден`);
    }
    user.username = newUsername;
    await user.save();
    return user;
  }

  async changeEmail(oldEmail: string, newEmail: string) {
    const user = await this.getUserByEmail(oldEmail);
    if (!user) {
      throw new Error(`Пользователь с емеилом ${oldEmail} не найден`);
    }
    user.email = newEmail;
    await user.save();
    return user;
  }
}
