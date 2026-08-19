export default defineEventHandler(async event => {
    try {
        await bootstrapDefaultAdmin(event)
    } catch (error) {
        console.error("Initialisation de l'administrateur impossible", error)
    }
});
