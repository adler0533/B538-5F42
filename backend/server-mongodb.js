const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://adler0533_db_user:wq33331@cluster0.odnm3ka.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority';
const DB_NAME = 'phonebook';
const COLLECTION_NAME = 'contacts';

let db;
let contactsCollection;

// Connect to MongoDB
async function connectToMongoDB() {
  let retries = 3;
  let client;
  
  while (retries > 0) {
    try {
      client = new MongoClient(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        sslValidate: false,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000
      });
      
      await client.connect();
      console.log('Connected to MongoDB Atlas');
      
      db = client.db(DB_NAME);
      contactsCollection = db.collection(COLLECTION_NAME);
      
      // Create index for better performance
      await contactsCollection.createIndex({ firstName: 1, lastName: 1 });
      await contactsCollection.createIndex({ phone: 1 });
      
      console.log('MongoDB setup complete');
      return; // Success, exit the function
      
    } catch (error) {
      console.error(`MongoDB connection error (${retries} retries left):`, error.message);
      retries--;
      
      if (retries === 0) {
        console.error('Failed to connect to MongoDB after 3 attempts');
        process.exit(1);
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Middleware
app.use(cors({
  origin: ['https://digital-phonebook-backend.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Format phone number with dash
const formatPhoneNumber = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length <= 3) {
    return cleanPhone;
  } else {
    return cleanPhone.slice(0, 3) + '-' + cleanPhone.slice(3);
  }
};

// Israeli phone number validation function
const validateIsraeliPhone = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Israeli mobile numbers: 05X-XXXXXXX (10 digits starting with 05)
  // Israeli landline: 0X-XXXXXXX (9 digits starting with 0, not 05)
  const mobilePattern = /^05[0-9]{8}$/;
  const landlinePattern = /^0[1-9][0-9]{7}$/;
  
  if (mobilePattern.test(cleanPhone)) {
    return { isValid: true, type: 'mobile' };
  } else if (landlinePattern.test(cleanPhone)) {
    return { isValid: true, type: 'landline' };
  } else {
    return { isValid: false, type: 'invalid' };
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: db ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const { filter, search } = req.query;
    let query = {};
    
    // Filter by favorite status
    if (filter === 'favorites') {
      query.isFavorite = true;
    }
    
    // Search by name or phone
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const contacts = await contactsCollection.find(query).sort({ createdAt: -1 }).toArray();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get single contact
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsCollection.findOne({ _id: id });
    
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Create new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { firstName, lastName, phone, isFavorite = false } = req.body;
    
    if (!firstName || !lastName || !phone) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const phoneValidation = validateIsraeliPhone(phone);
    if (!phoneValidation.isValid) {
      res.status(400).json({ error: 'Invalid Israeli phone number. Please enter a valid Israeli phone number (e.g., 050-1234567)' });
      return;
    }
    
    const formattedPhone = formatPhoneNumber(phone);
    const contact = {
      _id: new Date().getTime().toString(), // Simple ID generation
      firstName,
      lastName,
      phone: formattedPhone,
      isFavorite: Boolean(isFavorite),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await contactsCollection.insertOne(contact);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, isFavorite = false } = req.body;
    
    if (!firstName || !lastName || !phone) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const phoneValidation = validateIsraeliPhone(phone);
    if (!phoneValidation.isValid) {
      res.status(400).json({ error: 'Invalid Israeli phone number. Please enter a valid Israeli phone number (e.g., 050-1234567)' });
      return;
    }
    
    const formattedPhone = formatPhoneNumber(phone);
    const updateData = {
      firstName,
      lastName,
      phone: formattedPhone,
      isFavorite: Boolean(isFavorite),
      updatedAt: new Date()
    };
    
    const result = await contactsCollection.updateOne(
      { _id: id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.json({ _id: id, ...updateData });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactsCollection.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Toggle favorite status
app.patch('/api/contacts/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsCollection.findOne({ _id: id });
    
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    const newFavoriteStatus = !contact.isFavorite;
    await contactsCollection.updateOne(
      { _id: id },
      { $set: { isFavorite: newFavoriteStatus, updatedAt: new Date() } }
    );
    
    res.json({ 
      _id: id, 
      isFavorite: newFavoriteStatus,
      message: `Contact ${newFavoriteStatus ? 'added to' : 'removed from'} favorites`
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite status' });
  }
});

// Start server
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`MongoDB connected to database: ${DB_NAME}`);
  });
}

startServer().catch(console.error);
