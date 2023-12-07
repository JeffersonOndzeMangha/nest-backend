import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleConroller } from './people.controller';

@Module({
  providers: [PeopleService],
  controllers: [PeopleConroller]
})
export class PeopleModule {}
