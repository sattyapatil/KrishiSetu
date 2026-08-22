module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@krishisetu/*/src/*'],
            message: 'Deep imports into @krishisetu package internals are prohibited. Import from public package entry point only.',
          },
        ],
      },
    ],
    'no-restricted-properties': [
      'error',
      {
        object: 'process',
        property: 'env',
        message: 'Direct process.env access outside @krishisetu/config is prohibited.',
      },
    ],
  },
};

