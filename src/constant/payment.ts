const paymentMethod = {
    CREDIT_CARD: "credit_card",
    DEBIT_CARD: "debit_card",
    ATM: "atm",
    E_WALLET: "e_wallet",
};

const paymentStatus = {
    // Payment is created but not yet paid
    PENDING: "pending",
    // Payment is paid
    PAID: "paid",
    // Payment is refunded
    REFUNDED: "refunded",
    // Payment is failed
    FAILED: "failed",
    // Payment is cancelled
    CANCELLED: "cancelled",
    // Payment is expired
    EXPIRED: "expired",
    // Payment is refunded
    REFUND: {
        REQUESTED: "refund_requested",
        FAILED: "refund_failed",
        CANCELLED: "refund_cancelled",
        EXPIRED: "refund_expired",
        COMPLETED: "refund_completed",
        PARTIAL: "refund_partial",
        PROCESSING: "refund_processing",
        WAITING: "refund_waiting",
        REJECTED: "refund_rejected",
        ACCEPTED: "refund_accepted",
    }
};

const paymentGateway = {
    PAYPAL: "paypal",
    MOMO: "momo",
    ZALO_PAY: "zalo_pay",
    SHOPEE_PAY: "shopee_pay",
    VN_PAY: "vn_pay",
    FUTA_PAY: "futa_pay",
    ATM_DOMESTIC: "atm_domestic",
    ATM_INTERNATIONAL: "atm_international",
};

export { paymentMethod, paymentStatus, paymentGateway };