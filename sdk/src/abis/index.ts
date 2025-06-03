// Contract ABIs extracted from MonacoMarkets compiled contracts
import CLOB_ABI from './CLOB.json';
import Book_ABI from './Book.json';
import State_ABI from './State.json';
import Vault_ABI from './Vault.json';
import SymphonyAdapter_ABI from './SymphonyAdapter.json';

export {
  CLOB_ABI,
  Book_ABI,
  State_ABI,
  Vault_ABI,
  SymphonyAdapter_ABI,
};

// Type definitions for the ABIs
export type CLOBAbi = typeof CLOB_ABI;
export type BookAbi = typeof Book_ABI;
export type StateAbi = typeof State_ABI;
export type VaultAbi = typeof Vault_ABI;
export type SymphonyAdapterAbi = typeof SymphonyAdapter_ABI; 