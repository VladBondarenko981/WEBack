import { ApiProperty } from "@nestjs/swagger";
import { Table, Column, Model, DataType } from "sequelize-typescript";
import { BelongsToMany } from "sequelize-typescript";
import { City } from "src/city/city.model";
import { UserCities } from "src/city/user-cities.model";

interface UserCreationAttrs {
  email: string;
  password: string;
  username: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: "1", description: "Айдишник" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "vlkrrr", description: "Имя пользователя" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  username: string;

  @ApiProperty({ example: "Vlad", description: "Пример пользователя" })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ example: "ergerRG", description: "Пример пароля" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @BelongsToMany(() => City, () => UserCities)
  favouriteCities: City[];
}
