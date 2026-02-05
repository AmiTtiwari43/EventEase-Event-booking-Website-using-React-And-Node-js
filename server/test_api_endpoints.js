
const http = require('http');

// Helper to make requests
function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          // data might be empty string if status 204 etc
          const parsed = data ? JSON.parse(data) : {};
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
            console.error("Failed to parse JSON:", data);
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting API Tests ---');

  // 1. Test Public Service List
  try {
    console.log('Testing GET /api/services...');
    const servicesRes = await makeRequest('GET', '/api/services');
    if (servicesRes.statusCode === 200) {
        console.log(`PASS: Fetched ${servicesRes.body.length} services.`);
    } else {
        console.error(`FAIL: GET /api/services returned ${servicesRes.statusCode}`);
    }
  } catch (e) { console.error("FAIL: GET /api/services error:", e.message); }

  // 2. Login
  let token = null;
  try {
    console.log('Testing POST /api/auth/login...');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: 'demo@eventease.com',
      password: 'password123'
    });
    
    if (loginRes.statusCode === 201 || loginRes.statusCode === 200) {
        token = loginRes.body.token;
        if (token) {
             console.log('PASS: Login successful, token received.');
        } else {
             console.error('FAIL: Login successful but no token in body:', loginRes.body);
        }
    } else {
        console.error(`FAIL: Login returned ${loginRes.statusCode}`, loginRes.body);
    }
  } catch (e) { console.error("FAIL: Login error:", e.message); }

  // 3. Authenticated Request (if token)
  if (token) {
       try {
        // Just checking a protected route if we know one, maybe Partner routes or just User profile?
        // Let's check user profile /api/auth/me usually exists or /api/users/profile
        // Based on routes I saw: app.use('/api/auth', require('./routes/auth'));
        // auth.js only had register and login.
        // let's try /api/services/admin/all which requires auth + admin. Demo user is customer.
        // lets try /api/bookings? which might be protected.
        // Actually, let's just stick to the fact we have a token.
        console.log("Token obtained, skipping specific auth route check as I don't want to guess a private GET route without reading more files.");
       } catch (e) {}
  }

  console.log('--- Tests Finished ---');
}

runTests();
