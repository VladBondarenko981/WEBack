import { ApiProperty } from "@nestjs/swagger";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "src/users/users.model";
import { City } from "./city.model";

@Table({ tableName: "user_cities", createdAt: false, updatedAt: false })
export class UserCities extends Model<UserCities> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => City)
  @Column({
    type: DataType.INTEGER,
  })
  cityId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;
}
