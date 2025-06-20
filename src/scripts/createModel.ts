import { execSync } from "child_process";

// This parsing logic is proven to work.
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

  // --- ADJUSTED ERROR HANDLING ---
  // We'll collect any errors into an array.
  const errorMessages: string[] = [];

  if (!modelName) {
    errorMessages.push("The --name argument is missing. (e.g., --name User)");
  }

  if (!attributes) {
    errorMessages.push(
      'The --attributes argument is missing. (e.g., --attributes "firstName:string")'
    );
  }

  // If there are any errors in the array, we print them and exit.
  if (errorMessages.length > 0) {
    // ANSI escape codes for colors
    const red = "\x1b[31m";
    const yellow = "\x1b[93m";
    const cyan = "\x1b[36m";
    const reset = "\x1b[0m";

    console.error(`\n${red}❌ Error: Missing required arguments.${reset}\n`);
    errorMessages.forEach((msg) => {
      console.error(`  - ${yellow}${msg}${reset}`);
    });

    console.error(`\n${cyan}Usage Example:${reset}`);
    console.error(
      `  npm run create:model -- --name Product --attributes "name:string,price:integer"\n`
    );

    process.exit(1);
  }
  // --- END OF ADJUSTED ERROR HANDLING ---

  // The '!' tells TypeScript we are certain modelName and attributes are not null here.
  const command = `npx sequelize-cli model:generate --name ${modelName!} --attributes "${attributes!}" --migrations-path src/migrations --models-path src/models`;

  console.log(`🚀 Executing command:\n${command}\n`);

  try {
    execSync(command, { stdio: "inherit" });
    console.log(`✅ Model '${modelName!}' created successfully!`);
  } catch (error) {
    console.error(
      `🔥 Failed to create model '${modelName!}'. Please check the error output above.`
    );
    process.exit(1);
  }
}

main();
