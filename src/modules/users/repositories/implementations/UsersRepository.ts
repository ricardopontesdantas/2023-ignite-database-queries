import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return await this.repository.findOne({id: user_id}, {
      relations: ["games"]
    }) as User;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository
      .query("SELECT id, first_name, last_name, email from USERS ORDER BY first_name;");
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository
      .query(
        "SELECT id, first_name, last_name, email FROM users WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2)",
        [first_name, last_name]
      );
  }
}
