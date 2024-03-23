const transactions = require('./transaction.json');
class TransactionAnalyzer {
  listOfTransactions = [];
  /**
     * @param {Array} Массив транзакций
  */
  constructor(transactions = []) {
    this.listOfTransactions = transactions;
  }

  /**
    // Добавляет транзакцию в конец массива
     * @param {Object} добавляемая транзакция
  */
  addTransaction(transaction) {
    transaction.string = function () {
      return JSON.stringify(this)
    };
    this.listOfTransactions.push(transaction);
  }

  /**
     // Возвращает массив транзакций
     @returns {Array} Массив всех транзакций
  */
  getAllTransaction() {
    return this.listOfTransactions;
  }

  /**
     // Добавляем новую транзакцию в список.
     * @returns {Array} Массив уникальных типов транзакций
   */
  getUniqueTransactionType() {
    const uniqTransactions = new Set(this.listOfTransactions.map(obj => obj.transaction_type));
    return uniqTransactions;
  }

  /**
    * Рассчитывает общую сумму всех транзакций.
    * @returns {number} Общая сумма всех транзакций.
  */
  calculateTotalAmount() {
    let totalAmount = 0;
    this.listOfTransactions.forEach(transaction => {
      totalAmount += transaction.transaction_amount;
    });
    return totalAmount;
  }

  /**
    * Вычисляет общую сумму транзакций за указанный год, месяц и день.
    * @param {number} [year] Год транзакции.
    * @param {number} [month] Месяц транзакции (от 1 до 12).
    * @param {number} [day] День транзакции (от 1 до 31).
    * @returns {number} Общая сумма транзакций за указанную дату
  */
  calculateTotalAmountByDate(year, month, day) {
    let totalAmount = 0.0;
    this.listOfTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.transaction_date);
      if (transactionDate.getFullYear() === year && month === (transactionDate.getMonth() + 1) && day === transactionDate.getDate()) {
        totalAmount += transaction.transaction_amount;
      }
    });
    return totalAmount;
  }

  /**
    * Возвращает транзакции введенного типа
    * @param {string} [type] Тип транзакции.
    * @returns {Array} Отфильтрованные трпнзакции
  */
  getTransactionByType(type) {
    const filteredTransactions = this.listOfTransactions.filter(transaction => transaction.transaction_type === type)
    return filteredTransactions;
  }

  /**
    * Возвращает транзакции между введенными датами
    * @param {string} [startDate] Дата начала фильтра(включительно)
    * @param {string} [endDate] Дата конца фильтра(включительно)
    * @returns {Array} Отфильтрованные транзакции
  */
  getTransactionsInDateRange(startDate, endDate) {
    const filteredTransactions = this.listOfTransactions.filter(
      transaction => transaction.transaction_date >= startDate && transaction.transaction_date <= endDate
    );
    return filteredTransactions;
  }

  /**
    * Возвращает транзакции между введенными датами
    * @param {string} [merchantName] Имя продавца
    * @returns {Array} Отфильтрованные транзакции
  */
  getTransactionsByMerchant(merchantName) {
    const filteredTransactions = this.listOfTransactions.filter(transaction => transaction.merchant_name === merchantName);
    return filteredTransactions;
  }

  /**
    * Возвращает среднее сумму по транзакциям
    * @returns {number} Среднее значение транзакций
  */
  calculateAverageTransactionAmount() {
    const transactionCount = this.listOfTransactions.length;
    const totalAmount = this.calculateTotalAmount();
    return totalAmount / transactionCount;
  }

  /**
    * Возвращает транзакции с суммой в заданном диапазоне от minAmount до maxAmount
    * @param {number} [minAmount] Максимальная сумма транзакции
    * @param {number} [maxAmount] Мминимальная сумма транзакции
    * @returns {Array} транзакции с суммой в заданном диапазоне
  */
  getTransactionsByAmountRange(minAmount, maxAmount) {
    const filteredTransactions = this.listOfTransactions.filter(
      transaction => transaction.transaction_amount > minAmount && transaction.transaction_amount < maxAmount
    );
    return filteredTransactions;
  }

  /**
    * Возвращает общую сумму дебетовых транзакций
    * @returns {number} сумма дебитовых транзакций
  */
  calculateTotalDebitAmount() {
    const debitTransactions = this.getTransactionByType('debit');
    let totalAmount = 0;
    debitTransactions.forEach(transaction => {
      totalAmount += transaction.transaction_amount;
    });
    return totalAmount;
  }

  /**
    * Возвращает самый прибыльный месяц
    * @returns {string} Самый прибыльный месяц
  */
  findMostTransactionsMonth() {
    let currentAmount;
    const mostTransactionsMonth = {
      monthNumber: 0,
      monthAmount: 0
    }
    for (let i = 1; i <= 12; i++) {
      currentAmount = 0.0;
      this.listOfTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        if (i === ((transactionDate.getMonth() + 1))) {
          currentAmount += transaction.transaction_amount;
        }
      });
      if (mostTransactionsMonth.monthAmount < currentAmount) {
        mostTransactionsMonth.monthAmount = currentAmount;
        mostTransactionsMonth.monthNumber = i;
      }
    }
    return mostTransactionsMonth.monthNumber;
  }

  /**
    * Возвращает самый прибыльный дебитовый месяц
    * @returns {string} свмый прибыльный дебитовый месяц 
  */
  findMostDebitTransactionMonth() {
    let currentAmount;
    const mostTransactionsMonth = {
      monthNumber: 0,
      monthAmount: 0
    }
    for (let i = 1; i <= 12; i++) {
      currentAmount = 0.0;
      const debitTransactions = this.getTransactionByType('debit');
      debitTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        if (i === ((transactionDate.getMonth() + 1))) {
          currentAmount += transaction.transaction_amount;
        }
      });
      if (mostTransactionsMonth.monthAmount < currentAmount) {
        mostTransactionsMonth.monthAmount = currentAmount;
        mostTransactionsMonth.monthNumber = i;
      }
    }
    return mostTransactionsMonth.monthNumber;
  }


  /**
    * Возвращает каких транзакций больше всего
    * @returns {string} тип самой частовстречаемой транзакции
  */
  mostTransactionTypes() {
    const debitCount = this.getTransactionByType('debit');
    const creditCount = this.getTransactionByType('credit');
    if (debitCount > creditCount) {
      return 'debit';
    } else if (creditCount > debitCount) {
      return 'credit';
    }
    return 'equal';
  }

  /**
    * Возвращает массив транзакций до указанной даты
    * @param {string} [date] Дата до которой будут взяты транзакции
    * @returns {Array} отфильтрованный массив транзакций(не включительно)
  */
  getTransactionsBeforeDate(date) {
    const filteredTransactions = this.listOfTransactions.filter(
      transaction => transaction.transaction_date < date
    );
    return filteredTransactions;
  }

  /**
    * Возвращает транзакцию с заданным id
    * @param {number} [id] id искомой транзакции
    * @returns {Object} отранзакция
  */
  findTransactionById(id) {
    this.listOfTransactions.forEach(transaction => {
      if (transaction.transaction_id === id) {
        return transaction
      }
    });
  }

  /**
    * Возвращает новый массив, содержащий только описания транзакций
    * @returns {Array} массив описаний транзакций
  */
  mapTransactionDescriptions() {
    const transactionsDesctiption = this.listOfTransactions.map(transaction => transaction.transaction_description);
    return transactionsDesctiption;
  }
};
//Заполнение данных в класс из json
let transAnalyzer = new TransactionAnalyzer()
transactions.forEach(transaction => {
  transAnalyzer.addTransaction(transaction);
});

//Получение всех транзакций
console.log(transAnalyzer.getAllTransaction());
//Вывод суммы всех транзакций
console.log(transAnalyzer.calculateTotalAmount());
//Получиение всех уникальных типов транзакций
console.log(transAnalyzer.getUniqueTransactionType());
//Расчет средней суммы транзакции
console.log(transAnalyzer.calculateAverageTransactionAmount());
//Расчет суммы дебитовых транзакций
console.log(transAnalyzer.calculateTotalDebitAmount());
//Расчет самого прибыльного месяца
console.log(transAnalyzer.findMostTransactionsMonth());
//Расчет самого прибыльного  дебитого месяца
console.log(transAnalyzer.findMostDebitTransactionMonth());
//Нахождение самого частовстречаемого типа транзакций
console.log(transAnalyzer.mostTransactionTypes());
//Получение транзакции до определенной даты
console.log(transAnalyzer.getTransactionsBeforeDate('2019-02-02'));
//Получене транзакции по id
console.log(transAnalyzer.findTransactionById(123));
//Порлучение транзакций по продавцу
console.log(transAnalyzer.getTransactionsByMerchant('HomeDecorShop789'));
//Получение транзакций по типу
console.log(transAnalyzer.getTransactionByType('credit'));
//Получение транзакций между датами
console.log(transAnalyzer.getTransactionsInDateRange('2019-02-02', '2019-04-03'));
//Получение транзакций с определенной суммой ограниченной с двух сторон
console.log(transAnalyzer.getTransactionsByAmountRange(100, 500));
//Пооучение транакций в определенную дату
console.log(transAnalyzer.calculateTotalAmountByDate('2019-02-11'));


