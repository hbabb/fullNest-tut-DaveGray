import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockDatabase = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@test.com', role: 'ENGINEER' },
    { id: 2, name: 'Bob', email: 'bob@test.com', role: 'ADMIN' },
    { id: 3, name: 'John', email: 'john@test.com', role: 'INTERN' },
  ],
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest.fn().mockImplementation((role?: string) => {
        return role
          ? mockDatabase.users.filter((user) => user.role === role)
          : mockDatabase.users;
      }),
      findOne: jest.fn().mockImplementation((id) => {
        return mockDatabase.users.find((user) => user.id === id);
      }),
      create: jest.fn().mockImplementation((user) => {
        const newUser = { ...user, id: mockDatabase.users.length + 1 };
        mockDatabase.users.push(newUser);
        return newUser;
      }),
      update: jest.fn().mockImplementation((id, userUpdate) => {
        const userIndex = mockDatabase.users.findIndex(
          (user) => user.id === id,
        );
        if (userIndex !== -1) {
          mockDatabase.users[userIndex] = {
            ...mockDatabase.users[userIndex],
            ...userUpdate,
          };
          return mockDatabase.users[userIndex];
        }
        return null;
      }),
      delete: jest.fn().mockImplementation((id) => {
        const userIndex = mockDatabase.users.findIndex(
          (user) => user.id === id,
        );
        if (userIndex !== -1) {
          mockDatabase.users.splice(userIndex, 1);
          return { success: true };
        }
        return { success: false };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll and return all users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(mockDatabase.users);
    expect(service.findAll).toHaveBeenCalledWith(undefined);
  });

  it('should call findOne and return a user', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockDatabase.users[0]);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call create and return the new user', async () => {
    const newUser = {
      name: 'Dave',
      email: 'dave@example.com',
      role: 'INTERN' as const,
    };
    const result = await controller.create(newUser);
    expect(result).toEqual({ ...newUser, id: 4 });
    expect(service.create).toHaveBeenCalledWith(newUser);
  });

  it('should call update and return the updated user', async () => {
    const updatedUser = { name: 'Updated Bob', role: 'ENGINEER' as const };
    const result = await controller.update(2, updatedUser);
    expect(result).toEqual({
      id: 2,
      name: 'Updated Bob',
      email: 'bob@test.com',
      role: 'ENGINEER',
    });
    expect(service.update).toHaveBeenCalledWith(2, updatedUser);
  });

  it('should call delete and return success', async () => {
    const result = await controller.delete(3);
    expect(result).toEqual({ success: true });
    expect(service.delete).toHaveBeenCalledWith(3);
  });
});
