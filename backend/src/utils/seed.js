require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Lead = require('../models/Lead');

const sampleEmployees = [
  {
    name: 'Alice Johnson',
    email: 'counselor.alice@edtech.com',
    password: 'Password123!',
  },
  {
    name: 'Bob Smith',
    email: 'counselor.bob@edtech.com',
    password: 'Password123!',
  },
];

const sampleLeads = [
  {
    name: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    phone: '+1 555-234-5678',
    courseInterest: 'Full Stack Web Development',
    city: 'San Francisco',
    message: 'Looking for a comprehensive MERN stack bootcamp with job placement support.',
    status: 'NEW',
    assignedTo: null,
  },
  {
    name: 'Liam Chen',
    email: 'liam.chen@example.com',
    phone: '+1 555-345-6789',
    courseInterest: 'Data Science & Machine Learning',
    city: 'New York',
    message: 'Interested in weekend batches covering Python, PyTorch, and deep learning.',
    status: 'NEW',
    assignedTo: null,
  },
  {
    name: 'Amara Okafor',
    email: 'amara.okafor@example.com',
    phone: '+1 555-456-7890',
    courseInterest: 'Cloud Computing & DevOps',
    city: 'Chicago',
    message: 'Seeking AWS and Kubernetes certification training.',
    status: 'NEW',
    assignedTo: null,
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 555-567-8901',
    courseInterest: 'UI/UX Design Masterclass',
    city: 'Austin',
    message: 'Switching careers from graphic design to product design.',
    status: 'NEW',
    assignedTo: null,
  },
  {
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '+91 98765 43210',
    courseInterest: 'Cybersecurity Analyst',
    city: 'Bengaluru',
    message: 'Need info about ethical hacking and SOC analyst modules.',
    status: 'NEW',
    assignedTo: null,
  },
  {
    name: 'Marcus Bell',
    email: 'marcus.bell@example.com',
    phone: '+1 555-678-9012',
    courseInterest: 'Full Stack Web Development',
    city: 'Seattle',
    message: 'Does the program offer 1-on-1 mentorship?',
    status: 'NEW',
    assignedTo: null,
  },
  {
    name: 'Chloe Dubois',
    email: 'chloe.dubois@example.com',
    phone: '+33 6 12 34 56 78',
    courseInterest: 'Data Science & Machine Learning',
    city: 'Paris',
    message: 'Can I attend European timezone sessions?',
    status: 'NEW',
    assignedTo: null,
  },
  {
    name: 'Daniel Kim',
    email: 'daniel.kim@example.com',
    phone: '+1 555-789-0123',
    courseInterest: 'Cloud Computing & DevOps',
    city: 'Toronto',
    message: 'Looking for fast-track program with Terraform & Docker.',
    status: 'NEW',
    assignedTo: null,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crm_leads';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing data
    await Employee.deleteMany({});
    await Lead.deleteMany({});
    console.log('[Seed] Cleared existing employees and leads');

    // Create sample counselors
    const createdEmployees = [];
    for (const emp of sampleEmployees) {
      const created = await Employee.create(emp);
      createdEmployees.push(created);
    }
    console.log(`[Seed] Created ${createdEmployees.length} counselors:`);
    createdEmployees.forEach((e) => console.log(`  - ${e.name} (${e.email})`));

    const alice = createdEmployees[0];
    const bob = createdEmployees[1];

    // Create unassigned leads
    await Lead.insertMany(sampleLeads);

    // Create a couple of pre-assigned leads for testing private views
    await Lead.create({
      name: 'Oliver Queen',
      email: 'oliver.queen@example.com',
      phone: '+1 555-111-2222',
      courseInterest: 'Full Stack Web Development',
      city: 'Star City',
      message: 'Already enrolled and paid deposit.',
      status: 'CONVERTED',
      assignedTo: alice._id,
    });

    await Lead.create({
      name: 'Barry Allen',
      email: 'barry.allen@example.com',
      phone: '+1 555-222-3333',
      courseInterest: 'Cloud Computing & DevOps',
      city: 'Central City',
      message: 'Contacted yesterday regarding batch timings.',
      status: 'CONTACTED',
      assignedTo: alice._id,
    });

    await Lead.create({
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      phone: '+1 555-333-4444',
      courseInterest: 'UI/UX Design Masterclass',
      city: 'Themyscira',
      message: 'Awaiting syllabus pdf.',
      status: 'NEW',
      assignedTo: bob._id,
    });

    const totalLeads = await Lead.countDocuments();
    const unclaimedLeads = await Lead.countDocuments({ assignedTo: null });
    console.log(`[Seed] Seeded ${totalLeads} total leads (${unclaimedLeads} unclaimed).`);
    console.log('[Seed] Seeding completed successfully!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
