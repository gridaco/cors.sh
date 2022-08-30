import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { checkForUpdate } from "./update";

export default async function cli() {
  await checkForUpdate();
  yargs(hideBin(process.argv))
    .option("cwd", {
      type: "string",
      default: process.cwd(),
      requiresArg: false,
    })
    .option("dry-run", {
      type: "boolean",
      default: false,
      requiresArg: false,
    })
    .global(["cwd", "dry-run"])
    .command(
      "init",
      "init grida project",
      () => {},
      ({ cwd }) => {
        // init(cwd);
      }
    )
    .demandCommand(1)
    .parse();
}
