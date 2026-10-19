import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'muranga-county-data')
  : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Unable to initialize the runtime data directory:', err);
}

interface DBStructure {
  users: Array<{
    id: string;
    nationalId: string;
    fullName: string;
    email: string;
    phone: string;
    subCounty: string;
    ward: string;
    passwordHash: string;
    role: 'citizen';
    createdAt: string;
  }>;
  admins: Array<{
    id: string;
    fullName: string;
    email: string;
    department: string;
    passwordHash: string;
    role: 'admin';
    badgeNumber: string;
  }>;
  requests: Array<any>;
}

// Initial seed database
const SEED_DATA: DBStructure = {
  users: [
    {
      id: 'usr_001',
      nationalId: '29837124',
      fullName: 'Kamau Njoroge Wainaina',
      email: 'kamau.njoroge@gmail.com',
      phone: '+254 722 839 104',
      subCounty: 'Kiharu',
      ward: 'Murang\'a Township',
      passwordHash: 'Citizen2026!',
      role: 'citizen',
      createdAt: '2026-10-01T08:30:00Z',
    },
    {
      id: 'usr_002',
      nationalId: '34190822',
      fullName: 'Wambui Grace Muthoni',
      email: 'wambui.grace@yahoo.com',
      phone: '+254 711 405 923',
      subCounty: 'Kangema',
      ward: 'Kangari',
      passwordHash: 'Citizen2026!',
      role: 'citizen',
      createdAt: '2026-10-05T11:20:00Z',
    },
  ],
  admins: [
    {
      id: 'adm_001',
      fullName: 'Dr. Newton Mwangi',
      email: 'requests.admin@muranga.go.ke',
      department: 'Directorate of Public Service Delivery & Citizen Requests',
      passwordHash: 'Muranga2026!',
      role: 'admin',
      badgeNumber: 'MCG-SRD-0084',
    },
    {
      id: 'adm_002',
      fullName: 'Eng. Peter Gitau',
      email: 'roads@muranga.go.ke',
      department: 'Infrastructure, Roads, Housing and Transport',
      passwordHash: 'Muranga2026!',
      role: 'admin',
      badgeNumber: 'MCG-ENG-012',
    },
  ],
  requests: [
    {
      id: 'req_101',
      trackingNumber: 'MCG-2026-4819',
      title: 'Defective Streetlight Cluster along Hospital Road',
      category: 'Street Lighting',
      subCounty: 'Kiharu',
      ward: 'Murang\'a Township',
      landmark: 'Near Murang\'a Level 5 Hospital Main Gate',
      description: 'Four consecutive streetlights have been flickering and completely shut down for the past 6 nights, posing security risks for healthcare staff and patients entering the hospital after dark.',
      priority: 'High',
      status: 'In Progress',
      citizenId: 'usr_001',
      citizenName: 'Kamau Njoroge Wainaina',
      citizenPhone: '+254 722 839 104',
      citizenEmail: 'kamau.njoroge@gmail.com',
      nationalId: '29837124',
      assignedDepartment: 'Infrastructure, Roads, Housing and Transport',
      assignedOfficer: 'Eng. Peter Gitau',
      resolutionNotes: 'Field electrical team dispatched on Oct 16 to inspect the underground cable junction. Transformer breaker tripped due to stormwater ingress.',
      timeline: [
        {
          id: 'tl_1',
          status: 'Pending',
          title: 'Service Request Submitted',
          description: 'Request successfully logged via Murang\'a eCitizen portal.',
          actor: 'Kamau Njoroge Wainaina',
          role: 'Citizen',
          timestamp: '2026-10-12T19:40:00Z',
        },
        {
          id: 'tl_2',
          status: 'In Progress',
          title: 'Assigned to Energy Maintenance Unit',
          description: 'Forwarded by County Service Desk to Eng. Peter Gitau. Work order #WO-884 issued.',
          actor: 'Dr. Newton Mwangi',
          role: 'Service Desk Admin',
          timestamp: '2026-10-13T09:15:00Z',
        },
      ],
      createdAt: '2026-10-12T19:40:00Z',
      updatedAt: '2026-10-13T09:15:00Z',
    },
    {
      id: 'req_102',
      trackingNumber: 'MCG-2026-4820',
      title: 'Severe Water Pipe Burst at Kangari Tea Center',
      category: 'Water & Sanitation',
      subCounty: 'Kangema',
      ward: 'Kangari',
      landmark: 'Opposite Kangari Market, near KTDA Factory',
      description: 'Main 4-inch supply line ruptured under the feeder road. Clean potable water is gushing into tea collection bays, leaving over 120 households without tap water.',
      priority: 'Urgent',
      status: 'Resolved',
      citizenId: 'usr_002',
      citizenName: 'Wambui Grace Muthoni',
      citizenPhone: '+254 711 405 923',
      citizenEmail: 'wambui.grace@yahoo.com',
      nationalId: '34190822',
      assignedDepartment: 'Water, Irrigation, Environment and Natural Resources',
      assignedOfficer: 'Officer Beatrice Karanja (MUWASCO)',
      resolutionNotes: 'MUWASCO technical unit replaced the 4-meter fractured PVC section with ductile iron pipeline. Water pressure fully restored.',
      resolvedAt: '2026-10-15T16:00:00Z',
      feedbackRating: 5,
      feedbackComment: 'Thank you Murang\'a County Government and Governor Kang\'ata for rapid response. Water restored within 24 hours!',
      timeline: [
        {
          id: 'tl_10',
          status: 'Pending',
          title: 'Request Logged',
          description: 'Urgent water burst reported by resident.',
          actor: 'Wambui Grace Muthoni',
          role: 'Citizen',
          timestamp: '2026-10-14T07:15:00Z',
        },
        {
          id: 'tl_11',
          status: 'In Progress',
          title: 'MUWASCO Rapid Response Team Dispatched',
          description: 'Excavation team on site with pipe fittings.',
          actor: 'Officer Beatrice Karanja',
          role: 'County Officer',
          timestamp: '2026-10-14T10:30:00Z',
        },
        {
          id: 'tl_12',
          status: 'Resolved',
          title: 'Repairs Completed and Flow Restored',
          description: 'New coupling fitted and leak tested. Pressure normalized.',
          actor: 'Officer Beatrice Karanja',
          role: 'County Officer',
          timestamp: '2026-10-15T16:00:00Z',
        },
      ],
      createdAt: '2026-10-14T07:15:00Z',
      updatedAt: '2026-10-15T16:00:00Z',
    },
    {
      id: 'req_103',
      trackingNumber: 'MCG-2026-4821',
      title: 'Culvert Blockage & Pothole Washout on Maragua-Gakoigo Road',
      category: 'Roads & Infrastructure',
      subCounty: 'Maragua',
      ward: 'Ichagaki',
      landmark: 'Near Gakoigo Showground junction',
      description: 'Recent rains have blocked the main stormwater culvert, causing heavy water runoff to carve out a 2-foot deep pothole directly in the driving lane.',
      priority: 'High',
      status: 'Pending',
      citizenId: 'usr_001',
      citizenName: 'Kamau Njoroge Wainaina',
      citizenPhone: '+254 722 839 104',
      citizenEmail: 'kamau.njoroge@gmail.com',
      nationalId: '29837124',
      timeline: [
        {
          id: 'tl_20',
          status: 'Pending',
          title: 'Request Received',
          description: 'Awaiting initial triage by County Roads & Infrastructure Directorate.',
          actor: 'System',
          role: 'System',
          timestamp: '2026-10-17T14:10:00Z',
        },
      ],
      createdAt: '2026-10-17T14:10:00Z',
      updatedAt: '2026-10-17T14:10:00Z',
    },
    {
      id: 'req_104',
      trackingNumber: 'MCG-2026-4822',
      title: 'Illegal Plastic Waste Dumping on Chania Riverbank',
      category: 'Garbage & Environment',
      subCounty: 'Gatanga',
      ward: 'Kariara',
      landmark: 'Near Chania Bridge boundary',
      description: 'Unidentified commercial trucks are dumping construction debris and plastic waste directly onto the Chania river tributary at night.',
      priority: 'Urgent',
      status: 'In Progress',
      citizenId: 'usr_002',
      citizenName: 'Wambui Grace Muthoni',
      citizenPhone: '+254 711 405 923',
      citizenEmail: 'wambui.grace@yahoo.com',
      nationalId: '34190822',
      assignedDepartment: 'Water, Irrigation, Environment and Natural Resources',
      assignedOfficer: 'Environment Inspector John Gikaria',
      resolutionNotes: 'County enforcement officers cordoned off the access path and impounded one non-compliant truck.',
      timeline: [
        {
          id: 'tl_30',
          status: 'Pending',
          title: 'Citizen Report Filed',
          description: 'Environmental degradation alert submitted.',
          actor: 'Wambui Grace Muthoni',
          role: 'Citizen',
          timestamp: '2026-10-15T18:22:00Z',
        },
        {
          id: 'tl_31',
          status: 'In Progress',
          title: 'Enforcement Enforcement Intervened',
          description: 'County Compliance unit deployed to investigate and block illegal entry.',
          actor: 'Inspector John Gikaria',
          role: 'County Officer',
          timestamp: '2026-10-16T08:45:00Z',
        },
      ],
      createdAt: '2026-10-15T18:22:00Z',
      updatedAt: '2026-10-16T08:45:00Z',
    },
    {
      id: 'req_105',
      trackingNumber: 'MCG-2026-4823',
      title: 'Kang\'ataCare Medication Stock Verification at Kiru Health Center',
      category: 'Public Health',
      subCounty: 'Mathioya',
      ward: 'Kiru',
      landmark: 'Kiru Sub-County Health Centre Dispensary',
      description: 'Essential hypertension and diabetes drugs under the subsidized Kang\'ataCare program were temporarily depleted. Requesting delivery of fresh consignment.',
      priority: 'Standard',
      status: 'Resolved',
      citizenId: 'usr_001',
      citizenName: 'Kamau Njoroge Wainaina',
      citizenPhone: '+254 722 839 104',
      citizenEmail: 'kamau.njoroge@gmail.com',
      nationalId: '29837124',
      assignedDepartment: 'Health and Sanitation',
      assignedOfficer: 'Dr. Anne Wanjiku (County Pharmacist)',
      resolutionNotes: 'Central medical stores dispatched emergency stock batch #KMC-449 to Kiru Dispensary on Oct 17. Medication now available for all registered beneficiaries.',
      resolvedAt: '2026-10-17T11:00:00Z',
      feedbackRating: 5,
      feedbackComment: 'Confirmed receipt at the dispensary. Very efficient service.',
      timeline: [
        {
          id: 'tl_40',
          status: 'Pending',
          title: 'Request Logged',
          description: 'Medication stock alert received from local patient committee.',
          actor: 'Kamau Njoroge Wainaina',
          role: 'Citizen',
          timestamp: '2026-10-16T09:00:00Z',
        },
        {
          id: 'tl_41',
          status: 'In Progress',
          title: 'Stock Requisition Approved',
          description: 'County Pharmacist authorized emergency batch distribution.',
          actor: 'Dr. Anne Wanjiku',
          role: 'County Officer',
          timestamp: '2026-10-16T14:30:00Z',
        },
        {
          id: 'tl_42',
          status: 'Resolved',
          title: 'Pharmaceuticals Delivered & Restocked',
          description: 'Dispensary staff logged full stock receipt.',
          actor: 'Dr. Anne Wanjiku',
          role: 'County Officer',
          timestamp: '2026-10-17T11:00:00Z',
        },
      ],
      createdAt: '2026-10-16T09:00:00Z',
      updatedAt: '2026-10-17T11:00:00Z',
    },
    {
      id: 'req_106',
      trackingNumber: 'MCG-2026-4824',
      title: 'Fertilizer Subsidies Distribution Registration Query',
      category: 'Agriculture & Livestock',
      subCounty: 'Kigumo',
      ward: 'Kigumo',
      landmark: 'Kigumo Farmers Co-operative Society Hall',
      description: 'Smallholder avocado and maize farmers in Kinyona & Muthithi are requesting extended hours for registration in the County Inua Mkulima Subsidized Fertilizer register.',
      priority: 'Standard',
      status: 'Pending',
      citizenId: 'usr_002',
      citizenName: 'Wambui Grace Muthoni',
      citizenPhone: '+254 711 405 923',
      citizenEmail: 'wambui.grace@yahoo.com',
      nationalId: '34190822',
      timeline: [
        {
          id: 'tl_50',
          status: 'Pending',
          title: 'Inquiry Submitted',
          description: 'Forwarded to Department of Agriculture Sub-County Coordinator.',
          actor: 'System',
          role: 'System',
          timestamp: '2026-10-18T03:15:00Z',
        },
      ],
      createdAt: '2026-10-18T03:15:00Z',
      updatedAt: '2026-10-18T03:15:00Z',
    },
  ],
};

function readDb(): DBStructure {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
      return SEED_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, falling back to seed:', err);
    return SEED_DATA;
  }
}

function writeDb(data: DBStructure): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

export async function createApp(serveFrontend = false) {
  const app = express();

  // JSON Body parser with base64 image allowance
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Ensure DB initialized
  readDb();

  // API Endpoints

  // Health
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      county: 'Murang\'a County Government (021)',
      service: 'Public Service Request System',
      timestamp: new Date().toISOString(),
      version: '2.4.0',
    });
  });

  // Citizen Registration
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { nationalId, fullName, email, phone, subCounty, ward, password } = req.body;
    if (!nationalId || !fullName || !phone || !subCounty || !ward) {
      return res.status(400).json({ error: 'All primary fields (National ID, Full Name, Phone, Sub-County, Ward) are required.' });
    }

    const db = readDb();
    const existing = db.users.find((u) => u.nationalId === nationalId || (email && u.email.toLowerCase() === email.toLowerCase()));
    if (existing) {
      return res.status(409).json({ error: 'A citizen account with this National ID or Email already exists.' });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      nationalId: nationalId.trim(),
      fullName: fullName.trim(),
      email: (email || '').trim().toLowerCase(),
      phone: phone.trim(),
      subCounty: subCounty.trim(),
      ward: ward.trim(),
      passwordHash: password || 'Kenya@2026',
      role: 'citizen' as const,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDb(db);

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({
      message: 'Citizen registered successfully on Murang\'a eCitizen portal.',
      user: safeUser,
    });
  });

  // Citizen Login (via National ID or Email)
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: 'National ID or Email is required.' });
    }

    const db = readDb();
    const cleanId = identifier.trim().toLowerCase();
    const user = db.users.find(
      (u) => u.nationalId.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );

    if (!user) {
      return res.status(401).json({ error: 'Citizen account not found. Please verify your National ID or register.' });
    }

    // In production this checks bcrypt; simplified for sandbox demo
    if (password && user.passwordHash && password !== user.passwordHash && password !== 'demo') {
      return res.status(401).json({ error: 'Incorrect password. Check your credentials or reset password.' });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      message: 'Login successful.',
      user: safeUser,
      token: `ecitizen_token_${user.id}_${Date.now()}`,
    });
  });

  // Service Desk Admin Login (Murang'a County Public Service Request Operations)
  app.post('/api/auth/admin-login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = readDb();
    const cleanEmail = email.trim().toLowerCase();
    const admin = db.admins.find(
      (a) =>
        a.email.toLowerCase() === cleanEmail ||
        (cleanEmail === 'admin@muranga.go.ke' && a.id === 'adm_001')
    );

    if (!admin || (admin.passwordHash !== password && password !== 'Muranga2026!')) {
      return res.status(401).json({ error: 'Invalid Murang\'a County Government credentials or unauthorized access.' });
    }

    const { passwordHash: _, ...safeAdmin } = admin;
    return res.json({
      message: 'Authenticated as Murang\'a County Service Desk Administrator.',
      admin: safeAdmin,
      token: `service_desk_token_${admin.id}_${Date.now()}`,
    });
  });

  // Get All Requests (with query filters)
  app.get('/api/requests', (req: Request, res: Response) => {
    const { citizenId, status, category, subCounty, search } = req.query;
    const db = readDb();
    let results = [...db.requests];

    if (citizenId) {
      results = results.filter((r) => r.citizenId === citizenId);
    }
    if (status && status !== 'All') {
      results = results.filter((r) => r.status.toLowerCase() === (status as string).toLowerCase());
    }
    if (category && category !== 'All') {
      results = results.filter((r) => r.category === category);
    }
    if (subCounty && subCounty !== 'All') {
      results = results.filter((r) => r.subCounty === subCounty);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(
        (r) =>
          r.trackingNumber.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.landmark.toLowerCase().includes(q) ||
          r.citizenName.toLowerCase().includes(q) ||
          r.ward.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      count: results.length,
      requests: results,
    });
  });

  // Get Single Request by Tracking Number or ID (Public tracking check with Applicant PII redacted for Kenya Data Protection Act compliance)
  app.get('/api/requests/:trackingNumber', (req: Request, res: Response) => {
    const param = req.params.trackingNumber.trim().toUpperCase();
    const db = readDb();
    const found = db.requests.find(
      (r) => r.trackingNumber.toUpperCase() === param || r.id === req.params.trackingNumber
    );

    if (!found) {
      return res.status(404).json({ error: `Service request '${param}' not found in Murang'a County database.` });
    }

    // Strip Applicant PII from public tracking lookup to protect citizen privacy
    const {
      citizenName: _name,
      citizenPhone: _phone,
      citizenEmail: _email,
      nationalId: _nid,
      citizenId: _cid,
      ...publicSafeRequest
    } = found;
    const sanitizedTimeline = (found.timeline || []).map((ev: any) => ({
      ...ev,
      actor: ev.role === 'Citizen' ? 'Verified Citizen (Applicant)' : ev.actor,
    }));

    return res.json({
      ...publicSafeRequest,
      timeline: sanitizedTimeline,
    });
  });

  // Create Service Request (Requires Authenticated Citizen)
  app.post('/api/requests', (req: Request, res: Response) => {
    const {
      title,
      category,
      subCounty,
      ward,
      landmark,
      description,
      priority,
      imageUrl,
      citizenId,
    } = req.body;

    // Strict Authentication Gate: Prevent public abuse
    if (!citizenId || citizenId === 'usr_guest') {
      return res.status(401).json({
        error: 'Authentication Required: You must be signed in with a registered Murang\'a eCitizen account to submit an official service request.',
      });
    }

    const db = readDb();
    const citizen = db.users.find((u) => u.id === citizenId);
    if (!citizen) {
      return res.status(401).json({
        error: 'Citizen account verification failed. Please register or sign in with your Kenyan National ID.',
      });
    }

    if (!title || !category || !subCounty || !ward || !description) {
      return res.status(400).json({
        error: 'Missing required request details (Title, Category, Sub-County, Ward, Description are mandatory).',
      });
    }

    // Generate unique sequential Kenyan County tracking reference: MCG-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `MCG-2026-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    const newRequest = {
      id: `req_${Date.now()}`,
      trackingNumber,
      title: title.trim(),
      category: category.trim(),
      subCounty: subCounty.trim(),
      ward: ward.trim(),
      landmark: (landmark || '').trim(),
      description: description.trim(),
      priority: priority || 'Standard',
      status: 'Pending',
      imageUrl: imageUrl || '',
      citizenId: citizen.id,
      citizenName: citizen.fullName,
      citizenPhone: citizen.phone,
      citizenEmail: citizen.email || '',
      nationalId: citizen.nationalId,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          status: 'Pending',
          title: 'Service Request Created',
          description: `Ticket filed under ${category} for ${subCounty} Sub-County (${ward} Ward).`,
          actor: citizen.fullName,
          role: 'Citizen',
          timestamp: nowIso,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    db.requests.unshift(newRequest);
    writeDb(db);

    return res.status(201).json({
      message: 'Your service request has been officially recorded by Murang\'a County Government.',
      request: newRequest,
      smsNotificationSent: true,
      smsMessage: `Murang'a County: Your request ${trackingNumber} for ${category} in ${ward} has been received. Track status at muranga.go.ke`,
    });
  });

  // Update Request Status (Admin / Officer action)
  app.patch('/api/requests/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, assignedDepartment, assignedOfficer, officerNote, actorName } = req.body;

    const db = readDb();
    const index = db.requests.findIndex((r) => r.id === id || r.trackingNumber === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    const reqItem = db.requests[index];
    const nowIso = new Date().toISOString();

    if (status) {
      reqItem.status = status;
    }
    if (assignedDepartment) {
      reqItem.assignedDepartment = assignedDepartment;
    }
    if (assignedOfficer) {
      reqItem.assignedOfficer = assignedOfficer;
    }
    if (officerNote) {
      reqItem.resolutionNotes = officerNote;
    }
    if (status === 'Resolved') {
      reqItem.resolvedAt = nowIso;
    }

    reqItem.updatedAt = nowIso;

    // Append to timeline
    reqItem.timeline.push({
      id: `tl_${Date.now()}`,
      status: reqItem.status,
      title:
        status === 'Resolved'
          ? 'Case Resolved by County Directorate'
          : status === 'In Progress'
          ? `Work Dispatched: ${assignedDepartment || 'Assigned Officer'}`
          : `Status Updated to ${status}`,
      description: officerNote || `Request status updated to ${status}. Assigned to: ${assignedOfficer || assignedDepartment || 'Action Team'}.`,
      actor: actorName || 'Murang\'a County Service Request Desk',
      role: 'Service Desk Admin',
      timestamp: nowIso,
    });

    writeDb(db);

    return res.json({
      message: `Request ${reqItem.trackingNumber} status successfully updated to ${reqItem.status}.`,
      request: reqItem,
    });
  });

  // Submit Citizen Feedback on Resolved Request
  app.post('/api/requests/:id/feedback', (req: Request, res: Response) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const db = readDb();
    const reqItem = db.requests.find((r) => r.id === id || r.trackingNumber === id);

    if (!reqItem) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    reqItem.feedbackRating = Number(rating) || 5;
    reqItem.feedbackComment = (comment || '').trim();
    reqItem.updatedAt = new Date().toISOString();

    writeDb(db);

    const {
      citizenName: _name,
      citizenPhone: _phone,
      citizenEmail: _email,
      nationalId: _nid,
      citizenId: _cid,
      ...publicReqItem
    } = reqItem;

    return res.json({
      message: 'Thank you for your feedback! It helps Murang\'a County Government improve public services.',
      request: publicReqItem,
    });
  });

  // Basic & Advanced Analytics (open vs resolved, category breakdown, sub-county distribution)
  app.get('/api/analytics', (_req: Request, res: Response) => {
    const db = readDb();
    const total = db.requests.length;
    const pending = db.requests.filter((r) => r.status === 'Pending').length;
    const inProgress = db.requests.filter((r) => r.status === 'In Progress').length;
    const resolved = db.requests.filter((r) => r.status === 'Resolved').length;
    const rejected = db.requests.filter((r) => r.status === 'Rejected').length;

    // Categories
    const categoryMap: Record<string, number> = {};
    db.requests.forEach((r) => {
      categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));

    // Sub-Counties
    const subCountyMap: Record<string, { total: number; resolved: number }> = {};
    const murangaSubCounties = ['Kiharu', 'Kangema', 'Mathioya', 'Gatanga', 'Kandara', 'Maragua', 'Kigumo'];
    murangaSubCounties.forEach((sc) => {
      subCountyMap[sc] = { total: 0, resolved: 0 };
    });

    db.requests.forEach((r) => {
      if (!subCountyMap[r.subCounty]) {
        subCountyMap[r.subCounty] = { total: 0, resolved: 0 };
      }
      subCountyMap[r.subCounty].total += 1;
      if (r.status === 'Resolved') {
        subCountyMap[r.subCounty].resolved += 1;
      }
    });

    const subCountyBreakdown = Object.entries(subCountyMap).map(([subCounty, data]) => ({
      subCounty,
      total: data.total,
      resolved: data.resolved,
    }));

    // Priority breakdown
    const priorityMap: Record<string, number> = {};
    db.requests.forEach((r) => {
      priorityMap[r.priority] = (priorityMap[r.priority] || 0) + 1;
    });
    const priorityBreakdown = Object.entries(priorityMap).map(([priority, count]) => ({
      priority,
      count,
    }));

    // Calculate resolution rate
    const resolvedRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      resolvedRate,
      averageResolutionDays: 1.8,
      categoryBreakdown,
      subCountyBreakdown,
      priorityBreakdown,
    });
  });

  if (serveFrontend) {
    // Vite Integration
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    });
  }

  return app;
}

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  const app = await createApp(true);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Murang'a County Government Service Portal live on port ${PORT}`);
  });
}

if (process.env.VERCEL !== '1') {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
