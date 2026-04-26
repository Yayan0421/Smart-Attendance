const testRFID = async () => {
  try {
    console.log('🧪 Testing RFID Scan Endpoint...\n');

    // Test 1: Unknown UID (should fail)
    console.log('Test 1: Unknown UID');
    try {
      const res1 = await fetch('http://localhost:5000/rfid-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: 'UNKNOWN123' })
      });
      const data = await res1.json();
      console.log('Response:', data);
    } catch (err) {
      console.log('Expected error:', err.message);
    }

    console.log('\n---\n');

    // Test 2: Create test user first
    console.log('Test 2: Creating test user in database...');
    const db = await import('./src/config/database.js');
    const User = (await import('./src/models/User.js')).default;
    
    const sequelize = db.default;
    await sequelize.sync({ force: false });
    
    let user = await User.findOne({ where: { rfid_uid: 'A1B2C3D4' } });
    if (!user) {
      user = await User.create({
        surname: 'Dela Cruz',
        firstname: 'Juan',
        email: 'juan@example.com',
        rfid_uid: 'A1B2C3D4',
        role: 'staff'
      });
      console.log('✅ User created:', user.dataValues.firstname, user.dataValues.surname);
    } else {
      console.log('✅ User already exists:', user.dataValues.firstname, user.dataValues.surname);
    }

    console.log('\n---\n');

    // Test 3: Scan with valid UID (TIME IN)
    console.log('Test 3: First RFID scan (TIME IN)');
    const res2 = await fetch('http://localhost:5000/rfid-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: 'A1B2C3D4' })
    });
    const data2 = await res2.json();
    console.log('✅ Response:', JSON.stringify(data2, null, 2));

    console.log('\n---\n');

    // Test 4: Scan again same day (TIME OUT)
    console.log('Test 4: Second RFID scan (TIME OUT)');
    const res3 = await fetch('http://localhost:5000/rfid-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: 'A1B2C3D4' })
    });
    const data3 = await res3.json();
    console.log('✅ Response:', JSON.stringify(data3, null, 2));

    console.log('\n---\n');

    // Test 5: Check database logs
    console.log('Test 5: Checking logs endpoint');
    const res4 = await fetch('http://localhost:5000/logs');
    const data4 = await res4.json();
    console.log('✅ Logs:', JSON.stringify(data4, null, 2));

    console.log('\n---\n');

    // Test 6: Check attendance in database
    console.log('Test 6: Checking attendance records in database');
    const Attendance = (await import('./src/models/Attendance.js')).default;
    const attendance = await Attendance.findAll();
    console.log(`✅ Total attendance records: ${attendance.length}`);
    attendance.forEach((a, i) => {
      console.log(`  Record ${i + 1}:`, {
        user_id: a.user_id,
        time_in: a.time_in,
        status: a.status
      });
    });

    console.log('\n✅ All tests completed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testRFID();
