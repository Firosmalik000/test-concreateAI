const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
