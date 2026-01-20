export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  refId: string;
  leader: string;
  joined: string; // ISO date string
  isVerified: boolean;
  proJobActive: boolean;
  referredBy: number | null; // ID of the user who referred this user
  verificationDate: string | null; // ISO date string
  isAdmin?: boolean;
  isBlocked?: boolean;
  isWithdrawalBlocked?: boolean;
  withdrawalBlockReason?: string;
  wallets: {
    proJob: number;
    referral: number;
    gmail: number;
    server: number;
    salary: number;
    jobBalance: number;
  };
}

export interface ProofConfig {
  type: 'image' | 'text';
  label: string;
}

export interface SubmittedProof {
  type: 'image' | 'text';
  label: string;
  value: string; // base64 for image, text for text
}

export interface Job {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  likes: string;
  views: string;
  reward: number;
  proofsConfig: ProofConfig[];
  taskUrl?: string;
  rules?: string;
}

export interface Transaction {
  id: number;
  userId: number;
  userName:string;
  type: 'deposit' | 'withdrawal' | 'job-reward' | 'referral-bonus';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string; // ISO date string
  details?: string;
  transactionId?: string; // For deposits
  withdrawalNumber?: string; // For withdrawals
  paymentMethod?: 'bkash' | 'nagad' | 'rocket'; // For withdrawals
  rejectionReason?: string;
}

export interface JobSubmission {
  id: number;
  userId: number;
  userName: string;
  jobId: number;
  jobTitle: string;
  proofs: SubmittedProof[];
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string; // ISO date string
}

export interface AppSettings {
  paymentNumbers: {
    bkash: string;
    nagad: string;
    rocket: string;
  };
  telegramLinks: {
    group: string;
    channel: string;
  };
  verificationFee: number;
  referralBonus: number;
}

export interface Notice {
    id: number;
    title: string;
    content: string;
    date: string; // ISO date string
    isActive: boolean;
}

export interface Notification {
  id: number;
  message: string;
  type: 'deposit' | 'submission' | 'signup';
  link: string;
  isRead: boolean;
  date: string; // ISO date string
}
