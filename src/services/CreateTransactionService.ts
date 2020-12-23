import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    // verifying if user has sufficient funds
    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('insufficient funds', 400);
    }

    // verifying if category is already created
    const categoryAlreadyExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryAlreadyExists) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      const { id } = await categoriesRepository.save(newCategory);

      const transaction = transactionsRepository.create({
        title,
        value: typeof value === 'string' ? parseInt(value, 10) : value,
        type,
        category_id: id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryAlreadyExists.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
