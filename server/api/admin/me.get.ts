export default defineEventHandler(async event => {
    const user = await sessionUser(event);
    const allowed = ["admin", "demo"].includes(String(user?.role || ""));
    return {email: user?.email || "", role: user?.role || "", allowed, readOnly: user?.role === "demo"};
});
