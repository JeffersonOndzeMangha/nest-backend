import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Entity, RequestBody } from './types';
import { singularize } from '../utils/helper-functions';

@Injectable()
export class DB<T extends Entity> {
  public data: { [key: string]: T } = {};

  constructor(private readonly name: string) {
    this.read();
  }

  private read() {
    try {
      this.data = JSON.parse(
        fs.readFileSync(`src/database/${this.name}.json`, 'utf8') ?? '{}'
      );
    } catch (error) {
      this.data = {};
    }
  }

  private write() {
    fs.writeFileSync(
      `src/database/${this.name}.json`,
      JSON.stringify(this.data)
    );
  }

  async find(): Promise<Array<T>> {
    return Object.values(this.data ?? {});
  }

  async findOne(id: string): Promise<T> {
    const found = this.data[id];
    if (!found) {
      throw new NotFoundException(`${singularize(this.name)} not found`);
    }
    return found;
  }

  async create(newData: RequestBody<T>): Promise<T> {
    const id = uuidv4();
    this.data[id] = {...newData, id} as T;
    this.write();
    return this.data[id];
  }

  async update(id: string, newData: RequestBody<T>): Promise<T> {
    if (!this.data[id]) {
      throw new NotFoundException(`${singularize(this.name)} not found`);
    }
    this.data[id] = { ...this.data[id], ...newData };
    this.write();
    return this.data[id];
  }

  async delete(id: string): Promise<string> {
    if (!this.data[id]) {
      throw new NotFoundException(`${singularize(this.name)} not found`);
    }
    delete this.data[id];
    this.write();
    return id;
  }

  async deleteAll(): Promise<{ [key: string]: T } | {}> {
    this.data = {};
    this.write();
    return this.data;
  }
}

export const DBProvider = (name: string) => ({
    provide: DB,
    useValue: new DB(name),
});

