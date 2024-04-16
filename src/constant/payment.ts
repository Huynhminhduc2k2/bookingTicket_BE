const paymentMethod = {
    ATM: "atm",
    E_WALLET: "e_wallet",
};

const paymentStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
    EXPIRED: 'EXPIRED',
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