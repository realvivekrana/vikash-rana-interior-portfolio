import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first');
    process.exit(1);
  }

  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log('Admin already exists:', email);
  } else {
    await Admin.create({ name: 'Vikash Rana', email, password });
    console.log('Admin created:', email);
  }
  process.exit(0);
};

run();