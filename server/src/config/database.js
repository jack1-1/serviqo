
// instaed of using pool evertime to query we are creating utility
const pool = require('./db.js');

 async function checkDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    throw error;
  }
};
const query = async (text, params) => {
    try {
        return await pool.query(text, params);
    } catch (error) {
        console.error('❌ Database query failed:', error.message);
        throw error;
    }
}

module.exports = { checkDatabaseConnection,query };// when we eexport function  we use {}