const {query}=require('../config/database');
const findUserByemail = async (email) => {
    const result = await query(
        `SELECT
        id,
        first_name,
        last_name,
        email,
        password_hash,
        phone,
        is_active,
        last_login_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
        [email]
    )
    return result.rows[0];
}

const createUser=async({
  firstName,
  lastName,
  email,
  hashPassword,
  phone
})=>{
const result= await query(
    `
    INSERT INTO users
      (first_name, last_name, email, password_hash, phone, is_active)
    VALUES
      ($1, $2, $3, $4, $5, true)
    RETURNING
      id,
      first_name,
      last_name,
      email,
      phone,
      is_active,
      created_at
    `,
    [
      firstName,
      lastName,
      email,
      hashPassword,
      phone
    ]
);
return result.rows[0];
}
module.exports = { findUserByemail, createUser }