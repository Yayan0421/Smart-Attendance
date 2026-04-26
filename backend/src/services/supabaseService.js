/**
 * Supabase Service - REST API Client
 * Uses Service Role Key for full read/write access
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// Cache for default event ID
let defaultEventId = null;

/**
 * Get or create default event
 */
const getOrCreateDefaultEvent = async () => {
  // Return cached event ID if available
  if (defaultEventId) {
    return defaultEventId;
  }

  try {
    // Try to get any existing event
    const getResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/events?select=id&limit=1`,
      { method: 'GET', headers }
    );

    if (getResponse.ok) {
      const events = await getResponse.json();
      if (Array.isArray(events) && events.length > 0) {
        defaultEventId = events[0].id;
        console.log('✅ Using existing event:', defaultEventId);
        return defaultEventId;
      }
    }

    // If no events exist, throw error as we shouldn't auto-create
    throw new Error('No events found in database');
  } catch (error) {
    console.error('Error getting default event:', error.message);
    throw error;
  }
};

/**
 * Query Supabase REST API
 */
export const query = async (table, options = {}) => {
  const {
    select = '*',
    filters = {},
    limit = null,
  } = options;

  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;

  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    url += `&${key}=eq.${value}`;
  });

  if (limit) url += `&limit=${limit}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Query failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Insert into Supabase
 */
export const insert = async (table, data) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Insert failed: ${error.message}`);
  }

  return response.json();
};

/**
 * Update in Supabase
 */
export const update = async (table, data, filter = {}) => {
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  
  Object.entries(filter).forEach(([key, value]) => {
    url += `?${key}=eq.${value}`;
  });

  const response = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Update failed: ${error.message}`);
  }

  return response.json();
};

/**
 * Find user by RFID UID
 */
export const findUserByUID = async (uid) => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/users?rfid_uid=eq.${uid}&select=*`,
    { method: 'GET', headers }
  );

  if (!response.ok) {
    throw new Error('Query failed');
  }

  const data = await response.json();
  return data.length > 0 ? data[0] : null;
};

/**
 * Check if user has attendance today
 */
export const findTodayAttendance = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/attendance?user_id=eq.${userId}&created_at=gte.${todayISO}&select=*`,
    { method: 'GET', headers }
  );

  if (!response.ok) {
    throw new Error('Query failed');
  }

  const data = await response.json();
  return data.length > 0 ? data[0] : null;
};

/**
 * Create attendance record in Supabase
 */
export const createAttendance = async (userId) => {
  try {
    const eventId = await getOrCreateDefaultEvent();
    const now = new Date().toISOString();

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/attendance`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_id: userId,
          event_id: eventId,
          time_in: now,
          status: 'Present',
          fine: 0,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create attendance: ${error.message}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Test Supabase connection
 */
export const testConnection = async () => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/users?select=count`,
      { method: 'GET', headers }
    );

    if (response.ok) {
      console.log('✅ Supabase connection successful (using Service Role Key)');
      return true;
    } else {
      console.error('❌ Supabase connection failed:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
};

export default {
  query,
  insert,
  update,
  findUserByUID,
  findTodayAttendance,
  createAttendance,
  testConnection,
};
