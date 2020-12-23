import csv from 'csvtojson';
import path from 'path';

import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const transactionService = new CreateTransactionService();

    const transactions = await csv().fromFile(
      path.join(uploadConfig.directory, filename),
    );

    for (let i = 0; i < transactions.length; i++) {
      await Promise.resolve(transactionService.execute(transactions[i]));
    }

    return transactions;
  }
}

export default ImportTransactionsService;
