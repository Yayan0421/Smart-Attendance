import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
};

async function checkAttendance() {
  console.log('Fetching attendance records from Supabase...\n');

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/attendance?select=*`,
      { method: 'GET', headers }
    );

    if (response.ok) {
      const records = await response.json();
      console.log(`✅ Found ${records.length} attendance record(s):\n`);
      records.forEach((record, index) => {
        console.log(`[${index + 1}] User ID: ${record.user_id}`);
        console.log(`    Time In: ${record.time_in}`);
        console.log(`    Status: ${record.status}`);
        console.log(`    Event ID: ${record.event_id}`);
        console.log('');
      });
      
      if (records.length > 0) {
        console.log('✅ Supabase persistence verified!');
      }
    } else {
      console.error('Failed to fetch records:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAttendance();
