const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
      },
      amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);
