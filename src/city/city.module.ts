import { Module } from "@nestjs/common";
import { CityController } from "./city.controller";
import { CityService } from "./city.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserCities } from "./user-cities.model";
import { City } from "./city.model";
import { User } from "src/users/users.model";

@Module({
  controllers: [CityController],
  providers: [CityService],
  imports: [SequelizeModule.forFeature([City, User, UserCities])],
  exports: [CityService],
})
export class CityModule {}
