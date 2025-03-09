import { Controller } from "@nestjs/common";
import { CityService } from "./city.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { City } from "./city.model";
import { CreateCityDto } from "./dto/create-city.dto";
import { Post, Body, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Cities")
@Controller("city")
export class CityController {
  constructor(private cityService: CityService) {}

  @ApiOperation({ summary: "Get all selected cities" })
  @ApiResponse({ status: 200, type: [City] })
  @Get()
  getAll() {
    return this.cityService.getAllCities();
  }
}
