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

//verify current user state
const verifyState =async(userId)=>{
const result = await query(`SELECT
        u.id AS user_id,
        CONCAT(u.first_name, ' ', u.last_name) AS name,
        u.email,
        u.phone,
        r.id AS role_id,
        r.name AS role_name,
        p.name AS permission_name
    FROM users u
    LEFT JOIN user_roles ur
        ON u.id = ur.user_id
    LEFT JOIN roles r
        ON ur.role_id = r.id
    LEFT JOIN role_permissions rp
        ON r.id = rp.role_id
    LEFT JOIN permissions p
        ON rp.permission_id = p.id
    WHERE u.id = $1
    ORDER BY r.id, p.id;
`, [userId]);
return result.rows;
}

module.exports = { findUserByemail, createUser, verifyState };