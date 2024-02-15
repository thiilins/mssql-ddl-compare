import inquirer from "inquirer";
import chalk from "chalk";
import listSchemas from "./functions/listSchemas.js";
import extractTableDetails from "./functions/extractTableDetails.js";
import compareTableDetails from "./functions/compareTableDetails.js";
import config from "./config.js";

const { origin, destiny } = config;

async function runDetailedComparison() {
  try {
    const schemas = await listSchemas(origin);

    const answers = await inquirer.prompt([{
      type: 'list',
      name: 'schema',
      message: 'Qual schema você quer comparar?',
      choices: schemas,
    }]);
    const { schema } = answers;

    console.log(chalk.blueBright(`Extracting table details from Database 1 for schema ${schema}...`));
    const details1 = await extractTableDetails(origin, schema);
    console.log(chalk.blueBright(`Extracting table details from Database 2 for schema ${schema}...`));
    const details2 = await extractTableDetails(destiny, schema);

    console.log(chalk.blueBright('Comparing table details...'));
    const differences = compareTableDetails(details1, details2);

    if (differences && differences.length > 0) {
      console.log(chalk.yellow('Divergent tables/infos found:'));
      differences.forEach(dif => {
        console.log(chalk.cyan(`Table: ${dif.table}`));

        if (dif.columnDifferences && dif.columnDifferences.length > 0) {
          console.log(chalk.yellow('Divergent columns found!'));
          dif.columnDifferences.forEach(column => {
            console.log(chalk.white(`Column: ${column.column}`) + chalk.red(` Reason: ${column.reason}`));
          });
        } else {
          console.log(chalk.green('No divergences columns found between the databases for the selected schema.'));
        }

        if (dif.indexDifferences && dif.indexDifferences.length > 0) {
          console.log(chalk.yellow('Divergent indexes found!'));
          dif.indexDifferences.forEach(index => {
            console.log(chalk.white(`Index: ${index.index}`) + chalk.red(` Reason: ${index.reason}`));
          });
        } else {
          console.log(chalk.green('No divergences indexes found between the databases for the selected schema.'));
        }

        if (dif.keyDifferences && dif.keyDifferences.length > 0) {
          console.log(chalk.yellow('Divergent keys found!'));
          dif.keyDifferences.forEach(key => {
            console.log(chalk.white(`Key: ${key.key}`) + chalk.red(` Reason: ${key.reason}`));
          });
        } else {
          console.log(chalk.green('No divergences keys found between the databases for the selected schema.'));
        }
      });
    } else {
      console.log(chalk.green('No divergences found between the databases for the selected schema.'));
    }
  } catch (err) {
    console.error(chalk.red('Error during detailed comparison:'), err);
  }
}

runDetailedComparison();
