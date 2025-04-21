//#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directory containing the files to check relative to the git root
const EXAMPLES_DIR = 'examples';

// Function to mask sensitive values
function maskValue(value) {
  if (!value) {
    return '*****';
  }
  const length = value.length;
  if (length <= 5) {
    return '*****';
  }
  const suffix = value.slice(-5);
  return '*****' + suffix;
}

// Get the root directory of the Git repository
let gitRoot;
try {
  gitRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
} catch (error) {
  console.error('Error: Failed to determine git repository root.');
  process.exit(1);
}

const examplesPath = path.join(gitRoot, EXAMPLES_DIR);

// Find staged TypeScript files in the examples directory
let stagedTsFilesOutput;
try {
  // Use forward slashes for git commands even on Windows
  const examplesPattern1 = `${EXAMPLES_DIR}/**/*.ts`;
  const examplesPattern2 = `${EXAMPLES_DIR}/*.ts`;
  stagedTsFilesOutput = execSync(`git diff --cached --name-only --diff-filter=ACM -- "${examplesPattern1}" "${examplesPattern2}"`, {
    encoding: 'utf8',
    cwd: gitRoot // Run git command from the repo root
  });
} catch (error) {
  // If diff command fails (e.g., no commits yet), exit cleanly
  if (error.status === 128) {
      console.log("No initial commit found or other git diff error, skipping pre-commit check.");
      process.exit(0);
  }
  console.error('Error executing git diff:', error.stderr || error.message);
  process.exit(1);
}

const stagedTsFiles = stagedTsFilesOutput.trim().split('\n').filter(Boolean);

if (stagedTsFiles.length === 0) {
  // No relevant files staged, exit successfully
  process.exit(0);
}

let foundSecrets = false;

// Process each staged file
stagedTsFiles.forEach(relativeFilePath => {
  // Construct absolute path
  const absoluteFilePath = path.resolve(gitRoot, relativeFilePath);

  if (!fs.existsSync(absoluteFilePath)) {
    console.warn(`Warning: Staged file not found: ${absoluteFilePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(absoluteFilePath, 'utf8');
    let modified = false;

    const clientIdRegex = /(clientId\s*[:=]\s*)(["'])([^"']*)(["'])/g;
    const clientSecretRegex = /(clientSecret\s*[:=]\s*)(["'])([^"']*)(["'])/g;

    content = content.replace(clientIdRegex, (match, prefix, quote, originalValue, suffix) => {
      const maskedValue = maskValue(originalValue);
      if (originalValue && originalValue !== maskedValue) {
        console.error(`Masked clientId in ${relativeFilePath}`);
        modified = true;
        foundSecrets = true;
        return `${prefix}${quote}${maskedValue}${suffix}`;
      }
      return match; // Return original match if no masking needed or value is empty
    });

    content = content.replace(clientSecretRegex, (match, prefix, quote, originalValue, suffix) => {
      const maskedValue = maskValue(originalValue);
      if (originalValue && originalValue !== maskedValue) {
        console.error(`Masked clientSecret in ${relativeFilePath}`);
        modified = true;
        foundSecrets = true;
        return `${prefix}${quote}${maskedValue}${suffix}`;
      }
      return match; // Return original match if no masking needed or value is empty
    });

    if (modified) {
      fs.writeFileSync(absoluteFilePath, content, 'utf8');
      // Re-stage the modified file
      execSync(`git add "${absoluteFilePath}"`, { cwd: gitRoot });
    }
  } catch (error) {
    console.error(`Error processing file ${relativeFilePath}:`, error);
    // Decide if we should exit(1) here or allow commit to proceed
    // For now, log error and continue, but don't block commit for processing errors
  }
});

if (foundSecrets) {
  console.log("clientId/clientSecret values masked and re-staged.");
}

// Exit with 0 to allow the commit, mirroring the original script's behavior
process.exit(0);