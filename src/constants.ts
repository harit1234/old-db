export const constants = {
    PAGINATION_PAGE_SIZE: 10,
    CHECK_API_STATUS_DEALAY: 5000,
    TIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',
    INT_MIN: '-2147483648',
    MONETARY_FORMATTING: {  // 0 means default case
        '0': {
          '0': 4,
          'PnL': 4,
          'Fees': 4,
          'Value': 4
        },
        'BTC': {
          '0': 8,
          'PnL': 8,
          'Fees': 8,
          'Value': 8
        },
      },
};
