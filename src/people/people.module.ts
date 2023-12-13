import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';

/**
 * The `PeopleModule` encapsulates all the functionality related to managing people.
 * It provides services and controllers for creating, retrieving, updating, deleting people and more...
 */
@Module({
  providers: [PeopleService],
  controllers: [PeopleController]
})
export class PeopleModule {}
