import 'reflect-metadata';
import { container } from 'tsyringe';


const mockUserRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};


container.register('UserRepository', {
  useValue: mockUserRepository,
});
