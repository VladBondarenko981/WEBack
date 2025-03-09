import { Body, Controller, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Post, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { CityService } from "src/city/city.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    private userService: UsersService,
    private cityService: CityService
  ) {}

  @ApiOperation({ summary: "Creating a user" })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: "Add city to user's favorites" })
  @ApiResponse({ status: 200, description: "City added to favorites" })
  @Post("addFavoriteCity")
  addFavorite(@Body() body: { userId: number; cityName: string }) {
    return this.userService.addFavoriteCity({
      userId: body.userId,
      cityName: body.cityName,
    });
  }

  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll() {
    return this.userService.getAllUser();
  }

  @ApiOperation({ summary: "Change username" })
  @Post("changeUsername")
  async changeUsername(
    @Body() body: { oldUsername: string; newUsername: string }
  ) {
    return await this.userService.changeUsername(
      body.oldUsername,
      body.newUsername
    );
  }

  @ApiOperation({ summary: "Change user email" })
  @Post("changeEmail")
  async changeEmail(@Body() body: { oldEmail: string; newEmail: string }) {
    return await this.userService.changeEmail(body.oldEmail, body.newEmail);
  }
}
