enum DESCRIPTION_EVENT {
  UPDATE_ACCOUNT_AMOUNT = 'เปลี่ยนแปลงเงินในบัญชี',
  INIT_ACCOUNT = 'ยอดเงินเริ่มต้นในบัญชี',
  DEFAULT_INCOME = 'รายรับ',
  DEFAULT_OUTCOME = 'รายจ่าย',
  MONEY_TRANSFER = 'โอนเงินไปยัง',
  RECIEVE_TRANSFER = 'รับโอนจาก',
}

enum ACCOUNT_EVENT {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

export default {
  DESCRIPTION_EVENT,
  ACCOUNT_EVENT,
}
