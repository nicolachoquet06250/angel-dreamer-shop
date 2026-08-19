export default defineEventHandler(async event => {
    const user = await sessionUser(event);
    return {email: user?.email || "", allowed: user?.role === "admin"};
});
