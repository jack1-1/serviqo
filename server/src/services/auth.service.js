const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const userRepository = require('../repositories/user.repository');

//register/signup //
const registerUser = async ({
    firstName,
    lastName,
    email,
    password,
    phone
}) => {
    const isExistinguser = await userRepository.findUserByemail(email);
    if (isExistinguser) {
        throw new Error("User already exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({
        firstName,
        lastName,
        email,
        hashPassword,
        phone
    });
    return user;
}

// login//
const login = async (email, password) => {
    const user = await userRepository.findUserByemail(email);
    if (!user) {
        throw new Error('Invalid credentials,user not found');
    }
    if (!user.is_active) {
        throw new Error('User account is inactive');
    }
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
        throw new Error('Invalid email or password');
    }
    // create token and pass in login response
    const token = generateToken({
        userId: user.id
    });

    return {
        token,
        user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone
        }
    };

};

// validate user state //
const validateUser = async ( userId ) => {
    const rows = await userRepository.verifyState(userId);

    if (!rows.length) {
        return null;
    }

    return buildAuthContext(rows);
    // design response json //
    
}
// design response
const buildAuthContext = (rows) => {
        if (!rows.length) {
            return null;
        }

        const firstRow = rows[0];

        const rolesMap = new Map();
        const permissionsSet = new Set();

        for (const row of rows) {

            // Build unique roles
            if (row.role_id !== null) {
                rolesMap.set(row.role_id, {
                    id: row.role_id,
                    name: row.role_name
                });
            }

            // Build unique permissions
            if (row.permission_name !== null) {
                permissionsSet.add(row.permission_name);
            }
        }

        return {
            user: {
                id: Number(firstRow.user_id),
                name: firstRow.name,
                email: firstRow.email,
                phone: firstRow.phone
            },

            roles: Array.from(rolesMap.values()),

            permissions: Array.from(permissionsSet)
        };
    };

module.exports = {
    registerUser, login, validateUser
};