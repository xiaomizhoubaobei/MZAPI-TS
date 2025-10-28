# Code of Conduct

## Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to make participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Project Specific Guidelines

Given that this project is a multi-cloud provider TypeScript SDK, we especially require contributors to adhere to the following guidelines:

1. **Cloud Service Authentication Information Security**:
   - It is strictly forbidden to include real SecretId, SecretKey, or other authentication credentials from any cloud provider in code, documentation, or any commits
   - If authentication information is needed in test code, environment variables or dedicated configuration files must be used, and these files must be ensured not to be committed to the version control system

2. **Code Quality Requirements**:
   - All TypeScript code must provide complete type definitions
   - Follow the existing code style and structure in the project
   - Ensure ESLint and Prettier checks pass before committing

3. **Documentation Guidelines**:
   - Chinese documentation must be provided for any new APIs or features
   - Example code should be clear and complete, helping users quickly understand and use the features

4. **Testing Guidelines**:
   - New features should include corresponding test cases
   - Test cases that reproduce the issue should be provided when fixing bugs

## Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful.

## Scope

This Code of Conduct applies within project spaces and in public spaces when an individual is representing the project or its community. Examples of representing a project or community include using an official project e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at [tongzhi@x.mizhoubaobei.top]. All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances. The project team is obligated to maintain confidentiality with regard to the reporter of an incident.

Project maintainers who do not follow or enforce the Code of Conduct in good faith may face temporary or permanent repercussions as determined by other members of the project's leadership.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4, available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

[homepage]: https://www.contributor-covenant.org

For answers to common questions about this code of conduct, see https://www.contributor-covenant.org/faq