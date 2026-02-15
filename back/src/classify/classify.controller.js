const {
  Controller,
  Post,
  UnprocessableEntityException,
} = require("@nestjs/common");
const {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} = require("@nestjs/swagger");
const { Throttle } = require("@nestjs/throttler");
const {
  assignMetadata,
} = require("@nestjs/common/decorators/http/route-params.decorator");
const {
  RouteParamtypes,
} = require("@nestjs/common/enums/route-paramtypes.enum");
const { ROUTE_ARGS_METADATA } = require("@nestjs/common/constants");
const { ClassifyService } = require("./classify.service");
const { validateBody } = require("./dto/classify-category.dto");

@ApiTags("classify")
@Controller("classify")
@Throttle({ default: { ttl: 60000, limit: 30 } })
class ClassifyController {
  @Post("category")
  @ApiOperation({ summary: "Classify medical text into a category" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["text"],
      properties: {
        text: {
          type: "string",
          description: "Medical/health text to classify",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Classification result",
    schema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: [
            "cardiology",
            "neurology",
            "dermatology",
            "orthopedics",
            "gastro",
            "ophthalmology",
            "pediatrics",
            "psychiatry",
            "general",
          ],
        },
        confidence: { type: "number", minimum: 0, maximum: 1 },
      },
    },
  })
  @ApiResponse({ status: 422, description: "Validation error" })
  async category(body) {
    const { error, value } = validateBody(body || {});
    if (error) {
      throw new UnprocessableEntityException({
        message: error,
        statusCode: 422,
      });
    }
    const result = this.classifyService.classifyCategory(value.text);
    return result;
  }
}

// Manually set route param metadata so Nest injects body and req (avoids Babel param decorator bug)
let routeArgs = {};
routeArgs = assignMetadata(routeArgs, RouteParamtypes.BODY, 0);
routeArgs = assignMetadata(routeArgs, RouteParamtypes.REQUEST, 1);
Reflect.defineMetadata(
  ROUTE_ARGS_METADATA,
  routeArgs,
  ClassifyController,
  "category",
);

module.exports = { ClassifyController };
