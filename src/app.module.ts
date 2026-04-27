import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './entities/user.entity';
import { PhotoEntity } from './entities/photo.entity';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [
    // This line tells NestJS to look for your .env file and make it available everywhere
    ConfigModule.forRoot({ isGlobal: true }),

    // This block connects to the database using the variables in your .env file
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [UserEntity, PhotoEntity], // We will replace these with PositionEntity soon
        synchronize: true, // This automatically creates tables in your DB based on your entities
      }),
    }),

    PositionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}