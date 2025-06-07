import React, { createContext, useContext, useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addFunds: (amount: number) => Promise<boolean>;
  deductFunds: (amount: number, description: string) => Promise<boolean>;
  refreshBalance: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load wallet data from localStorage
    const storedBalance = localStorage.getItem('walletBalance');
    const storedTransactions = localStorage.getItem('walletTransactions');
    
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const addFunds = async (amount: number): Promise<boolean> => {
    try {
      // Simulate payment processing - replace with actual Paystack integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBalance = balance + amount;
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'credit',
        amount,
        description: 'Wallet funding',
        date: new Date().toISOString(),
        status: 'completed'
      };
      
      setBalance(newBalance);
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      
      localStorage.setItem('walletBalance', newBalance.toString());
      localStorage.setItem('walletTransactions', JSON.stringify(updatedTransactions));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const deductFunds = async (amount: number, description: string): Promise<boolean> => {
    if (balance < amount) {
      return false;
    }
    
    try {
      const newBalance = balance - amount;
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'debit',
        amount,
        description,
        date: new Date().toISOString(),
        status: 'completed'
      };
      
      setBalance(newBalance);
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      
      localStorage.setItem('walletBalance', newBalance.toString());
      localStorage.setItem('walletTransactions', JSON.stringify(updatedTransactions));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const refreshBalance = () => {
    const storedBalance = localStorage.getItem('walletBalance');
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addFunds, deductFunds, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};