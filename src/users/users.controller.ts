import { Body, Controller, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Post, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { CityService } from "src/city/city.service";

@ApiTags("Пользователи")
@Controller("users")
export class UsersController {
  constructor(
    private userService: UsersService,
    private cityService: CityService
  ) {}

  @ApiOperation({ summary: "Создание пользователя" })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: "Добавить город в избранное для пользователя" })
  @ApiResponse({ status: 200, description: "Город добавлен в избранное" })
  @Post("addFavoriteCity")
  addFavorite(@Body() body: { userId: number; cityName: string }) {
    console.log(body.userId, body.cityName);
    return this.userService.addFavoriteCity({
      userId: body.userId,
      cityName: body.cityName,
    });
  }

  @ApiOperation({ summary: "Получить всех пользователей" })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll() {
    return this.userService.getAllUser();
  }

  @ApiOperation({ summary: "Сменить юзернейм пользователя" })
  @Post("changeUsername")
  async changeUsername(
    @Body() body: { oldUsername: string; newUsername: string }
  ) {
    return await this.userService.changeUsername(
      body.oldUsername,
      body.newUsername
    );
  }

  @ApiOperation({ summary: "Сменить емеил пользователя" })
  @Post("changeEmail")
  async changeEmail(@Body() body: { oldEmail: string; newEmail: string }) {
    return await this.userService.changeEmail(body.oldEmail, body.newEmail);
  }
}
