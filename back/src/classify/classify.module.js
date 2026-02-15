const { Module } = require('@nestjs/common');
const { ClassifyController } = require('./classify.controller');
const { ClassifyService } = require('./classify.service');
const { MinimaxClientService } = require('./minimax-client.service');
const { PromptBuilderService } = require('./prompt-builder.service');

@Module({
  controllers: [ClassifyController],
  providers: [
    PromptBuilderService,
    {
      provide: MinimaxClientService,
      useFactory: (promptBuilder) => new MinimaxClientService(promptBuilder),
      inject: [PromptBuilderService],
    },
    {
      provide: ClassifyService,
      useFactory: (minimaxClient) => new ClassifyService(minimaxClient),
      inject: [MinimaxClientService],
    },
  ],
})
class ClassifyModule {}

module.exports = { ClassifyModule };
