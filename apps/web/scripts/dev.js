import detectPort from "detect-port";
import { spawn } from "child_process";

const DEFAULT_PORT = 3000;

async function startDev() {
  const port = await detectPort(DEFAULT_PORT);

  if (port !== DEFAULT_PORT) {
    console.log(`Port ${DEFAULT_PORT} is in use, using port ${port} instead`);
  }

  const next = spawn("npx", ["next", "dev", "--port", port.toString()], {
    stdio: "inherit",
    shell: true,
  });

  next.on("close", (code) => {
    process.exit(code);
  });
}

startDev();
