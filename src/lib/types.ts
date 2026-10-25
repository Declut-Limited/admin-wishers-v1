// Records exactly as api-wishers returns them: _id, never id.

export type Admin = { _id: string; name: string; email: string; lastLoginAt?: string };

export type AccountStatus = "active" | "suspended" | "deactivated";

export type Owner = { _id: string; name: string; email: string; image?: string };

export type User = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
    emailVerified: boolean;
    accountStatus: AccountStatus;
    inviteCode: string;
    referralsCount: number;
    referredBy?: Owner;
    createdAt: string;
    deletedAt?: string;
};

export type Wallet = {
    allTimeBalance: number;
    pendingBalance: number;
    settledBalance: number;
    contributedEarning: number;
    referralEarnings: number;
};

export type BankAccount = { bankName: string; accountNumber: string; maskedAccountNumber: string; accountName: string; active: boolean; subaccountCode?: string };

export type Wishlist = {
    _id: string;
    owner: Owner | string;
    title: string;
    description?: string;
    image?: string;
    slug: string;
    link: string;
    totalWishItems: number;
    totalGoalAmount: number;
    totalAmountReceived: number;
    totalContributors: number;
    isCompleted: boolean;
    visitCount: number;
    createdAt: string;
};

export type WishItem = {
    _id: string;
    title: string;
    images: string[];
    goalAmount: number;
    amountReceived: number;
    contributorCount: number;
    isCompleted: boolean;
    createdAt: string;
};

export type Transaction = {
    _id: string;
    owner: Owner | null;
    type: "contribution" | "referral_earning";
    status: "pending" | "success" | "failed";
    amount: number;
    giftAmount?: number;
    charges: number;
    reference?: string;
    settlementStatus: "pending" | "settled";
    paidAt?: string;
    description?: string;
    createdAt: string;
};

export type Stats = {
    users: { total: number; verified: number; suspended: number; newThisWeek: number };
    wishlists: { total: number; completed: number; wishItems: number };
    contributions: { count: number; volume: number; paidToWishers: number; paidToReferrers: number; revenue: number; processingFees: number };
    thisMonth: { count: number; volume: number; revenue: number };
    recentUsers: User[];
    recentTransactions: Transaction[];
};

export type Settings = {
    wishlistCreationLimit: number;
    wishItemCreationLimit: number;
    maxWishItemImages: number;
    minGoalAmount: number;
    maxGoalAmount: number;
    maxGoalAmountDigits: number;
    minContributionAmount: number;
    wisherSharePercentage: number;
    referrerSharePercentage: number;
    shouldDisplayConfetti: boolean;
    updatedAt?: string;
};

export type Page<T> = { results: T[]; total: number; page: number; limit: number; hasMore?: boolean };
