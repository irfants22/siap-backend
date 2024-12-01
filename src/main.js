import { web } from "./application/web.js";

const PORT = 3000;

web.listen(PORT, () => {
  console.log(`Your application running on http://localhost:${PORT}`);
});
