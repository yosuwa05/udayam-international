import { config } from "dotenv";
import { app } from "./setup";
import { APP_CONSTANTS } from "constant";


config();

const PORT = APP_CONSTANTS.PORT || 3000;
const HOST = "localhost"


// app.get('/health', async ({ set }) => {
//   try {
//     set.status = 200;
//     return { status: "OK" };
//   } catch (error: any) {
//     set.status = 500;
//     return { status: "Error", error: error.message };
//   }
// })

app.listen({ port: PORT, hostname: HOST, idleTimeout: 120 }, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
  console.log(`Checkout the docs at http://${HOST}:${PORT}/docs`);
});

