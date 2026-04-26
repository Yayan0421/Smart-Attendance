const testSupabase = async () => {
  try {
    console.log('🧪 Testing Supabase Connection...\n');

    const SUPABASE_URL = 'https://dxjsmxnfgapfpmtajefm.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4anNteG5mZ2FwZnBtdGFqZWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDc2MTEsImV4cCI6MjA5MjQyMzYxMX0.CkpB6B6BemPjEhMv3V11ecWGYFQ4h95IFdxdSka50bo';

    // Test 1: Basic connection test
    console.log('Test 1: Checking Supabase REST API connection...');
    const healthCheck = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    });

    if (healthCheck.ok) {
      console.log('✅ Supabase REST API is reachable');
    } else {
      console.log('⚠️  API Response:', healthCheck.status);
    }

    console.log('\n---\n');

    // Test 2: Check if we can query users table
    console.log('Test 2: Querying users table from Supabase...');
    const usersQuery = await fetch(
      `${SUPABASE_URL}/rest/v1/users?select=*`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const usersData = await usersQuery.json();
    console.log(`✅ Users count: ${Array.isArray(usersData) ? usersData.length : 'error'}`);
    if (Array.isArray(usersData)) {
      console.log('Users:', JSON.stringify(usersData.slice(0, 2), null, 2));
    }

    console.log('\n---\n');

    // Test 3: Try to insert a test user
    console.log('Test 3: Inserting test user into Supabase...');
    const insertUser = await fetch(
      `${SUPABASE_URL}/rest/v1/users`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          surname: 'Test',
          firstname: 'Supabase',
          email: `test-${Date.now()}@supabase.com`,
          rfid_uid: `TEST${Date.now()}`,
          role: 'staff'
        })
      }
    );

    const insertResult = await insertUser.json();
    if (insertUser.ok) {
      console.log('✅ User inserted successfully');
      console.log('Response:', JSON.stringify(insertResult, null, 2));
    } else {
      console.log('❌ Insert failed:', insertResult);
    }

    console.log('\n---\n');

    // Test 4: Query attendance table
    console.log('Test 4: Querying attendance table from Supabase...');
    const attendanceQuery = await fetch(
      `${SUPABASE_URL}/rest/v1/attendance?select=*`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const attendanceData = await attendanceQuery.json();
    console.log(`✅ Attendance records: ${Array.isArray(attendanceData) ? attendanceData.length : 'error'}`);

    console.log('\n---\n');

    console.log('✅ Supabase Connection Test Complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testSupabase();
