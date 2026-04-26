import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

async function setupDefaultEvent() {
  console.log('Creating default event...');

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/events`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'RFID Attendance',
          date: new Date().toISOString().split('T')[0],
          login_time: '08:00:00',
          logout_time: '17:00:00',
          fine_amount: 0,
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      const event = Array.isArray(result) ? result[0] : result;
      console.log('✅ Event created:', event);
      return event;
    } else {
      const error = await response.json();
      console.error('❌ Failed to create event:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setupDefaultEvent();
