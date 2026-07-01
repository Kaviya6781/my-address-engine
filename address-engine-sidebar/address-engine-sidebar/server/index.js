const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // support large JSON payloads

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// GET imports history
app.get('/api/imports', async (req, res) => {
  try {
    const imports = await prisma.import.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(imports);
  } catch (error) {
    console.error('Failed to retrieve imports:', error);
    res.status(500).json({ error: 'Failed to retrieve imports history: ' + error.message });
  }
});

// GET addresses list
app.get('/api/addresses', async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(addresses);
  } catch (error) {
    console.error('Failed to retrieve addresses:', error);
    res.status(500).json({ error: 'Failed to retrieve addresses: ' + error.message });
  }
});

// POST import batch
app.post('/api/import', async (req, res) => {
  const { filename, records } = req.body;
  
  if (!filename || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Invalid payload: filename and records (array) are required' });
  }

  console.log(`Received import request for file: "${filename}" with ${records.length} records`);

  let importRecord = null;
  try {
    // 1. Create the import tracking record in 'processing' state
    importRecord = await prisma.import.create({
      data: {
        filename,
        recordCount: records.length,
        status: 'processing'
      }
    });

    // 2. Map JSON data fields into structured address schema format
    const addressData = records.map(r => {
      const name = r.name || r.businessName || r.company || null;
      const street = r.street || r.addressLine1 || r.address || r.streetAddress || '';
      const city = r.city || r.locality || '';
      const state = r.state || r.province || r.region || null;
      const postalCode = String(r.postalCode || r.zip || r.zipCode || r.pincode || '');
      const country = r.country || r.countryCode || 'India'; // Default fallback if not provided
      const phone = r.phone || r.telephone || r.mobile || null;
      const email = r.email || null;
      
      // Auto-compile a rawAddress string if it doesn't exist
      const rawAddress = r.rawAddress || r.fullAddress || 
        `${street ? street + ', ' : ''}${city ? city + ', ' : ''}${state ? state + ' ' : ''}${postalCode}`.trim();

      return {
        name,
        street,
        city,
        state,
        postalCode,
        country,
        phone,
        email,
        rawAddress,
        importId: importRecord.id
      };
    });

    // 3. Batch insert records
    if (addressData.length > 0) {
      await prisma.address.createMany({
        data: addressData
      });
    }

    // 4. Update the import status to 'completed'
    const finalImport = await prisma.import.update({
      where: { id: importRecord.id },
      data: { status: 'completed' }
    });

    res.json({
      success: true,
      import: finalImport,
      importedCount: addressData.length
    });
  } catch (error) {
    console.error('Batch import failed:', error);
    
    if (importRecord) {
      try {
        await prisma.import.update({
          where: { id: importRecord.id },
          data: { 
            status: 'failed',
            error: error.message || 'Unknown database error'
          }
        });
      } catch (dbError) {
        console.error('Failed to log import error status in DB:', dbError);
      }
    }
    
    res.status(500).json({ error: 'Import failed: ' + error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AddressEngine Importer API' });
});

app.listen(PORT, () => {
  console.log(`🚀 AddressEngine Importer API server running on port ${PORT}`);
});
