const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://digital-phonebook-backend.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/phonebook.db' 
  : path.join(__dirname, 'phonebook.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    console.log('Database path:', dbPath);
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phone TEXT NOT NULL,
      isFavorite BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Start with empty database - no sample data
    console.log('Database initialized with empty table');
  });
}

// Routes

// Get all contacts
app.get('/api/contacts', (req, res) => {
  const { filter, search } = req.query;
  let query = 'SELECT * FROM contacts';
  let params = [];

  if (filter === 'favorites') {
    query += ' WHERE isFavorite = 1';
  }

  if (search) {
    const searchCondition = filter === 'favorites' ? ' AND' : ' WHERE';
    query += `${searchCondition} (firstName LIKE ? OR lastName LIKE ? OR phone LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY isFavorite DESC, firstName ASC, lastName ASC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get contact by ID
app.get('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM contacts WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.json(row);
  });
});

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

// Create new contact
app.post('/api/contacts', (req, res) => {
  const { firstName, lastName, phone, isFavorite = false } = req.body;
  
  if (!firstName || !lastName || !phone) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Validate Israeli phone number
  const phoneValidation = validateIsraeliPhone(phone);
  if (!phoneValidation.isValid) {
    res.status(400).json({ error: 'Invalid Israeli phone number. Please enter a valid Israeli phone number (e.g., 050-1234567)' });
    return;
  }

  const formattedPhone = formatPhoneNumber(phone);
  
  db.run(
    'INSERT INTO contacts (firstName, lastName, phone, isFavorite) VALUES (?, ?, ?, ?)',
    [firstName, lastName, formattedPhone, isFavorite ? 1 : 0],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.status(201).json({
        id: this.lastID,
        firstName,
        lastName,
        phone: formattedPhone,
        isFavorite: Boolean(isFavorite)
      });
    }
  );
});

// Update contact
app.put('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, isFavorite } = req.body;
  
  if (!firstName || !lastName || !phone) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Validate Israeli phone number
  const phoneValidation = validateIsraeliPhone(phone);
  if (!phoneValidation.isValid) {
    res.status(400).json({ error: 'Invalid Israeli phone number. Please enter a valid Israeli phone number (e.g., 050-1234567)' });
    return;
  }

  const formattedPhone = formatPhoneNumber(phone);
  
  db.run(
    'UPDATE contacts SET firstName = ?, lastName = ?, phone = ?, isFavorite = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [firstName, lastName, formattedPhone, isFavorite ? 1 : 0, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Contact not found' });
        return;
      }
      
      res.json({
        id: parseInt(id),
        firstName,
        lastName,
        phone: formattedPhone,
        isFavorite: Boolean(isFavorite)
      });
    }
  );
});

// Toggle favorite status
app.patch('/api/contacts/:id/favorite', (req, res) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE contacts SET isFavorite = NOT isFavorite, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Contact not found' });
        return;
      }
      
      // Get updated contact
      db.get('SELECT * FROM contacts WHERE id = ?', [id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({
          ...row,
          isFavorite: Boolean(row.isFavorite)
        });
      });
    }
  );
});

// Delete contact
app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM contacts WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.json({ message: 'Contact deleted successfully' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
