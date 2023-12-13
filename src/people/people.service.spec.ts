import { Test, TestingModule } from '@nestjs/testing';
import { DB, DBProvider } from '../database';
import { Person } from '../database/types';
import { v4 as uuid4 } from 'uuid';
import { PeopleService } from './people.service';

describe('PeopleService', () => {
  let peopleService: PeopleService;
  let database: DB<Person>;

  beforeEach(async () => {
    const dbProvider = DBProvider('people');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        dbProvider,
      ],
    }).compile();

    peopleService = module.get<PeopleService>(PeopleService);
    database = peopleService.database;
  });

  it('should be defined', () => {
    expect(PeopleService).toBeDefined();
  });

  describe('createPerson', () => {
    it('should create a person', async () => {
      const personData = {
        document: '123456789',
        name: 'John Doe'+Math.random(),
        birthDate: new Date('1997-03-25').toLocaleDateString(),
        email: 'jeffersonondzemangha@gmail.com',
        accounts: []
      };
      
      const result = await peopleService.createPerson(personData);
      expect(result.id).toBeDefined();
    });
  });

  describe('listPeople', () => {
    it('should list all people when no id is provided', async () => {
      const expectedResult = Object.values(database.data);

      const result = await peopleService.listPeople();
      expect(result).toEqual(expectedResult);
    });

    it('should find a person when an id is provided', async () => {
      const id = Object.keys(database.data)[0];
      const expectedResult = database.data[id];

      const result = await peopleService.getPerson(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updatePerson', () => {
    it('should update a person', async () => {
      const id = Object.keys(database.data)[0];
      const personData = {
        name: 'John Doe'+Math.random(),
      };
      const expectedResult = {
        ...database.data[id],
        ...personData,
      };

      const result = await peopleService.updatePerson(id, personData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deletePerson', () => {
    it('should delete a person', async () => {
      const id = Object.keys(database.data)[0];

      const result = await peopleService.deletePerson(id);
      expect(result).toEqual(id);
    });
  });
});
