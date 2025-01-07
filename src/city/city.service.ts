import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { City } from "./city.model";
import { CreateCityDto } from "./dto/create-city.dto";

@Injectable()
export class CityService {
  constructor(@InjectModel(City) private cityRepository: typeof City) {}

  async getCityByName(name: string): Promise<City> {
    return this.cityRepository.findOne({ where: { name } });
  }

  async createCity(dto: CreateCityDto): Promise<City> {
    return this.cityRepository.create(dto);
  }

  async getAllCities() {
    const cities = await this.cityRepository.findAll();
    return cities;
  }
}
