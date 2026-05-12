require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('./models/Client');
const Place = require('./models/Place');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_panel_db';

const clients = [
  { name: 'Arjun Sharma', email: 'arjun@techcorp.in', phone: '9876543210', company: 'TechCorp India', city: 'Mumbai', state: 'Maharashtra', status: 'active' },
  { name: 'Priya Patel', email: 'priya@designhub.com', phone: '9845123456', company: 'Design Hub', city: 'Ahmedabad', state: 'Gujarat', status: 'active' },
  { name: 'Rajesh Kumar', email: 'rajesh@buildfast.io', phone: '9812345678', company: 'BuildFast Solutions', city: 'Bengaluru', state: 'Karnataka', status: 'active' },
  { name: 'Sneha Reddy', email: 'sneha@nexustech.com', phone: '9823456789', company: 'Nexus Technologies', city: 'Hyderabad', state: 'Telangana', status: 'inactive' },
  { name: 'Vikram Singh', email: 'vikram@cloudventures.in', phone: '9834567890', company: 'Cloud Ventures', city: 'Delhi', state: 'Delhi', status: 'active' },
  { name: 'Anjali Nair', email: 'anjali@freshstartup.com', phone: '9867891234', company: 'FreshStartup', city: 'Kochi', state: 'Kerala', status: 'active' },
  { name: 'Deepak Verma', email: 'deepak@infosolutions.net', phone: '9891234567', company: 'InfoSolutions', city: 'Pune', state: 'Maharashtra', status: 'inactive' },
  { name: 'Meera Iyer', email: 'meera@webwizards.co', phone: '9856789012', company: 'Web Wizards', city: 'Chennai', state: 'Tamil Nadu', status: 'active' },
];

const placeCategories = ['restaurant', 'hotel', 'park', 'shop', 'hospital', 'school', 'office', 'other'];

const placeData = [
  { name: 'The Grand Bistro', description: 'Fine dining restaurant in the heart of Mumbai', category: 'restaurant', address: '12 Marine Drive', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '022-12345678', status: 'active' },
  { name: 'Sunrise Hotel', description: 'Luxury hotel with rooftop pool', category: 'hotel', address: '45 MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', phone: '080-98765432', status: 'active' },
  { name: 'Cubbon Park', description: 'Beautiful green park in central Bengaluru', category: 'park', address: 'Cubbon Park', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', phone: '', status: 'active' },
  { name: 'City Mall', description: 'Premium shopping destination', category: 'shop', address: '100 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002', phone: '044-56789012', status: 'active' },
  { name: 'Apollo Hospital', description: 'Multi-specialty hospital', category: 'hospital', address: '21 Greams Lane', city: 'Chennai', state: 'Tamil Nadu', pincode: '600006', phone: '044-28296000', status: 'active' },
  { name: 'Delhi Public School', description: 'Premier educational institution', category: 'school', address: '5 Sector 8', city: 'Delhi', state: 'Delhi', pincode: '110075', phone: '011-29547932', status: 'active' },
  { name: 'Tech Park Tower', description: 'IT office hub', category: 'office', address: '89 HITEC City', city: 'Hyderabad', state: 'Telangana', pincode: '500081', phone: '040-23456789', status: 'inactive' },
  { name: 'Spice Garden Restaurant', description: 'Authentic South Indian cuisine', category: 'restaurant', address: '7 MG Road', city: 'Kochi', state: 'Kerala', pincode: '682001', phone: '0484-2345678', status: 'active' },
  { name: 'Majestic Inn', description: 'Budget-friendly hotel near station', category: 'hotel', address: '33 Station Road', city: 'Pune', state: 'Maharashtra', pincode: '411001', phone: '020-12345678', status: 'active' },
  { name: 'Riverfront Park', description: 'Scenic riverside walking trail', category: 'park', address: 'Sabarmati Riverfront', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', phone: '', status: 'active' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Client.deleteMany();
    await Place.deleteMany();
    console.log('🗑️  Cleared existing data');

    const createdClients = await Client.insertMany(clients);
    console.log(`✅ Seeded ${createdClients.length} clients`);

    const placesWithClients = placeData.map((place, i) => ({
      ...place,
      client: createdClients[i % createdClients.length]._id,
    }));

    const createdPlaces = await Place.insertMany(placesWithClients);
    console.log(`✅ Seeded ${createdPlaces.length} places`);

    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
