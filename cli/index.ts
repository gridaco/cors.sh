#!/usr/bin/env node

import cli from "./bin";

process.on("SIGINT", () => {
  process.exit(0); // now the "exit" event will fire
});

// if main
if (require.main === module) {
  cli();
}
