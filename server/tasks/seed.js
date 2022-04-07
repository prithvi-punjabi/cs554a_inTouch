const dbConnection = require("../config/mongoConnection");

async function main() {
  const db = await dbConnection();
  try {
    await db.dropDatabase();

    console.log("Seed completed!");
  } catch (e) {
    console.log(e);
  } finally {
    await db.s.client.close();
  }
}

main();
