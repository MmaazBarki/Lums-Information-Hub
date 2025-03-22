import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: String,
}, { timestamps: true });

export const Company = mongoose.model('Company', CompanySchema);