import * as bcrypt from 'bcryptjs';

export function hashCode() {
    function hash(password) {
        return bcrypt.hashSync(password, 10);
    }

    function verifyCode(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    }

    return { hash, verifyCode };
}

