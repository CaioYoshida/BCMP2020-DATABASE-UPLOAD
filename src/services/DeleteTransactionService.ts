import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepositoy from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepositoy);

    const userMatched = await transactionsRepository.findOne(id);

    if (!userMatched) {
      throw new AppError('Transaction not found', 401);
    }

    await transactionsRepository.remove(userMatched);
  }
}

export default DeleteTransactionService;
