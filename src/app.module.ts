import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { CityModule } from "./city/city.module";
import { AuthModule } from "./auth/auth.module";
import { User } from "./users/users.model";
import { City } from "./city/city.model";
import { UserCities } from "./city/user-cities.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, City, UserCities],
      autoLoadModels: true,
    }),
    UsersModule,
    CityModule,
    AuthModule,
  ],
})
export class AppModule {}

//
