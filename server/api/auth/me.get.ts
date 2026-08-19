export default defineEventHandler(async event => {
    const user = await sessionUser(event);
    return {
        user: user ? {
            id: user.id,
            email: user.email,
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            role: user.role,
            mustChangePassword: Boolean(user.must_change_password),
            createdAt: user.created_at
        } : null
    };
});
