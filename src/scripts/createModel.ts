import { execSync } from "child_process";

// This parsing logic is PROVEN to work by your debug-args.ts output.
function getArgumentValue(flag: string): string | null {
  const argIndex = process.argv.indexOf(flag);
  if (argIndex === -1 || argIndex + 1 >= process.argv.length) {
    return null;
  }
  return process.argv[argIndex + 1];
}

function main(): void {
  const modelName = getArgumentValue("--name");
  const attributes = getArgumentValue("--attributes");

  // This check should now pass.
  if (!modelName || !attributes) {
    console.error(
      "This error should not appear. If it does, the file did not save correctly."
    );
    process.exit(1);
  }

  // Add quotes around attributes for safety with the shell.
  const command = `npx sequelize-cli model:generate --name ${modelName} --attributes "${attributes}" --migrations-path src/migrations --models-path src/models`;

  console.log(`🚀 Executing command:\n${command}\n`);

  try {
    execSync(command, { stdio: "inherit" });
    console.log(`✅ Model '${modelName}' created successfully!`);
  } catch (error) {
    console.error(
      `🔥 Failed to create model '${modelName}'. Please check the error output above.`
    );
    process.exit(1);
  }
}

main();
