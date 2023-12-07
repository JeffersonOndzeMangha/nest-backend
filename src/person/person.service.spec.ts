import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { DB, DBProvider } from '../database';
import { Person } from '../database/types';
import { v4 as uuid4 } from 'uuid';

describe('PersonService', () => {
  let personService: PersonService;
  let database: jest.Mocked<DB>;

  beforeEach(async () => {
    const dbProvider = DBProvider('people');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        dbProvider,
      ],
    }).compile();

    personService = module.get<PersonService>(PersonService);
    database = module.get<jest.Mocked<DB>>(DB);
  });

  it('should be defined', () => {
    expect(personService).toBeDefined();
  });

  describe('createPerson', () => {
    it('should create a person', async () => {
      const personData:Person = {
        id: uuid4(),
        document: '123456789',
        name: 'John Doe'+Math.random(),
        birthDate: new Date('1997-03-25').toLocaleDateString(),
        email: 'jeffersonondzemangha@gmail.com',
        accounts: []
      };
      const expectedResult = personData;
      const result = await personService.createPerson(personData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('listPeople', () => {
    it('should list all people when no id is provided', async () => {
      const expectedResult = database.data;

      const result = await personService.listPeople(null);
      expect(result).toEqual(expectedResult);
    });

    it('should find a person when an id is provided', async () => {
      const id = Object.keys(database.data)[0];
      const expectedResult = database.data[id];

      const result = await personService.listPeople(id);
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

      const result = await personService.updatePerson(id, personData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deletePerson', () => {
    it('should delete a person', async () => {
      const id = Object.keys(database.data)[0];

      const result = await personService.deletePerson(id);
      expect(result).toEqual(id);
    });
  });
});
