import { ApiProperty } from "@nestjs/swagger";
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import { UserCities } from "./user-cities.model";
import { User } from "src/users/users.model";

interface CityCreationAttrs {
  name: string;
}

@Table({ tableName: "city" })
export class City extends Model<City, CityCreationAttrs> {
  @ApiProperty({ example: "1", description: "Айдишник" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Kiev", description: "Название города" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @BelongsToMany(() => User, () => UserCities)
  users: User[];
}
