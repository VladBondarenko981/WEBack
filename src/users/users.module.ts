import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./users.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserCities } from "src/city/user-cities.model";
import { City } from "src/city/city.model";
import { CityModule } from "src/city/city.module";
import { AuthService } from "src/auth/auth.service";

@Module({
  controllers: [UsersController],
  imports: [
    SequelizeModule.forFeature([User, City, UserCities]),
    UserCities,
    CityModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
