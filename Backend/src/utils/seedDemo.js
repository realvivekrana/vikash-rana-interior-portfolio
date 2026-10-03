import 'dotenv/config';
import mongoose from 'mongoose';
import Hero from '../models/Hero.js';
import About from '../models/About.js';
import Service from '../models/Service.js';
import Settings from '../models/Settings.js';

// Sirf KHALI collections mein starter content daalta hai. Jo pehle se hai usse chhedta nahi.
const services = [
  ['Residential Interiors', 'Complete home interior design, from layout planning to final styling.', 'FaHome'],
  ['Modular Kitchen', 'Smart, functional kitchens designed around the way you cook.', 'FaUtensils'],
  ['Living Room Design', 'Welcoming living spaces with furniture, lighting and decor that fit you.', 'FaCouch'],
  ['Bedroom Design', 'Calm, comfortable bedrooms with custom wardrobes and storage.', 'FaBed'],
  ['Office & Commercial', 'Productive workspaces and retail interiors that reflect your brand.', 'FaBuilding'],
  ['Turnkey Execution', 'Design, material, carpentry and finishing, all handled under one roof.', 'FaTools'],
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  if (!(await Hero.findOne())) {
    await Hero.create({});
    console.log('Hero created');
  }
  if (!(await About.findOne())) {
    await About.create({
      name: 'Vikash Rana',
      title: 'Interior Designer',
      bio: 'Update this text from the admin panel (About section) with your own story.',
      stats: [
        { label: 'Projects Done', value: '50+' },
        { label: 'Years Experience', value: '5+' },
        { label: 'Happy Clients', value: '40+' },
      ],
    });
    console.log('About created');
  }
  if (!(await Settings.findOne())) {
    await Settings.create({});
    console.log('Settings created');
  }
  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany(
      services.map(([title, description, icon], i) => ({ title, description, icon, order: i }))
    );
    console.log(`${services.length} services created`);
  }

  console.log('Demo seed done. Ab admin panel se apna asli content daalo.');
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});