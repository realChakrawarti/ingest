# Contributing

We appreciate your interest in contributing to Ingest! This guide outlines the process for setting up your development environment, making contributions, and submitting pull requests.

<hr >

### The project follows [FSD](https://feature-sliced.design/) (Feature-Sliced Design) architecture.

Learn more about it in this [blog post](https://dev.to/m_midas/feature-sliced-design-the-best-frontend-architecture-4noj) by [Yan Levin](https://github.com/midas-png).

<hr>

## Table of Contents

- [Ways to contribute](#ways-to-contribute)
- [Issue worflow](#issue-workflow)
- [Setup project locally](#setup-the-project-locally)
  - [Technology Stack](#technology-stack)
  - [Install dependencies](#install-dependencies)
  - [Setup environment variables](#environment-variables)
    - [Create a YouTube API key](#create-a-youtube-data-api-v3-key-free)
  - [Run the project](#run-the-project)
- [Commit messages](#commit-messages)
  - [Examples](#here-are-few-examples-how-a-commit-message-should-look-like)
- [Raise pull request](#raise-a-pull-request)

## Ways to Contribute

There are several ways you can contribute to the project:

- Fix outstanding issues with the existing code.
- Submit issues related to bugs or desired new features.
- Implement new features.

## Issue Workflow

Create tickets for bugs, feature requests, or any other questions you might have https://github.com/realChakrawarti/ingest/issues/new. This helps us track and manage contributions effectively.

You can find the issue tracker here: https://github.com/users/realChakrawarti/projects/5

## Setup the project locally

### Technology Stack

This project uses the following technologies:

- Next.js v14: https://nextjs.org/docs/getting-started/installation
- Firebase (Auth & Firestore)
  - Firebase docs: https://firebase.google.com/docs
  - Firebase local emulator: https://firebase.google.com/docs/emulator-suite/install_and_configure
- Youtube Data V3 API: https://developers.google.com/youtube/v3/docs
- TypeScript: https://www.typescriptlang.org/
- TailwindCSS: https://tailwindcss.com/
- shadcn/ui: https://ui.shadcn.com/
- v0: https://v0.dev/
- IndexedDB API Wrapper (dexie.js): https://dexie.org/
- Cloudflare KV: https://developers.cloudflare.com/api/resources/kv/

### Install Dependencies

Before you begin contributing, make sure you have the necessary dependencies installed. You can install them by running the following command in your terminal:

- Make sure you have [git](https://git-scm.com/downloads) installed.
- Make sure you have [pnpm](https://pnpm.io/installation) installed.
- Make sure you have [make](https://winget.run/pkg/GnuWin32/Make) installed.
- Fork the [repository](https://github.com/realChakrawarti/ingest) by
  clicking on the **[Fork](https://github.com/realChakrawarti/ingest/fork)** button on the repository's page. This creates a copy of the code under your GitHub user account.

  ```bash
  git clone git@github.com:<your github handle>/ingest.git

  cd ingest

  git remote add upstream https://github.com/realChakrawarti/ingest.git
  ```

  **Refer:** https://graphite.dev/guides/upstream-remote on how to sync your forked repository with original repository.

- Create a new branch to hold your development changes:

  🚨 **Do not** work directly on the `dev` & `main` branch!

  First checkout to `dev` branch

  ```bash
  git checkout dev
  ```

  Create your new development branch from `dev` branch

  ```bash
  git checkout -b a-descriptive-name-for-your-changes
  ```

- Install all the project dependencies

  ```bash
  make setup
  ```

### Environment Variables

The project relies on the environment variables. Make a copy of `.env.example` file in the root directory and rename it to `.env.local`.

#### Create a YouTube Data API v3 key (free):

https://console.cloud.google.com/apis/api/youtube.googleapis.com

- CREATE PROJECT -> Enable API -> Create Credentials -> Check Public Data -> Submit.
- Once the API Key is visible copy that and paste it in `.env.local`

🚨 **Please note:** Do not commit your environment variable `.env(*)` file to the version control. If you are using `.env.local` as mentioned above, rest assured that it is already included in `.gitignore` file.

### Run the Project

The project includes various scripts for development tasks. You can run them using the following commands:

#### Firebase emulation without seed data

```bash
make dev
```

#### Firebase emulation with seed data (Recommended for first-time setup)

```bash
make dev-seed
```

## Commit Messages

We use pre-commit hooks to ensure code style and quality. Please ensure your commits pass the linting checks before raising a pull request.

We encourage you to use clear and concise commit messages that follow the [conventional commits](https://commitlint.js.org/) specification. This makes it easier to track and understand changes.

### Here are few examples how a commit message should look like

**fix - Bug fixes, resolving issues, correcting errors.**

```bash
fix(api): resolve issue with incorrect status codes
fix(tests): resolve failing unit tests
fix: correct typo in error message
```

**feat - New features, functionalities, or enhancements.**

```bash
feat(api): add endpoint for retrieving user profiles
feat(model): add support for new data format
feat: add new user registration flow
```

**improve - Improvements to existing code, performance, or user experience.**

```bash
improve(perf): optimize image loading performance
improve(ui): enhance user experience with better navigation
improve(docs): update documentation with latest changes
improve: enhance user interface readability
```

**chore - Tasks that don't directly add features or fix bugs (e.g., build system updates, linting, documentation).**

```bash
chore(deps): update project dependencies
chore(build): configure CI/CD pipeline
chore(cleanup): remove unused files and directories
chore: update project dependencies
```

## Raise a Pull Request

Please keep your pull requests focused on a single change or a small set of related changes. This makes it easier for us to review and integrate your contributions.

Please remember to write good commit messages to clearly communicate the changes you made! [Refer here](#commit-messages).

To keep your copy of the code up to date with the original repository, rebase your branch on upstream/branch before you open a pull request.

```bash
git fetch upstream
git rebase upstream/dev
```

Push your changes to your branch

```bash
git push -u origin a-descriptive-name-for-your-changes
```

If you've already opened a pull request, you'll need to force push with the `--force` or `-f` flag. Otherwise, if the pull request hasn't been opened yet, you can just push your changes normally.

To create a pull request, go to your fork on GitHub. You’ll often find a “Compare & pull request” button visible on your fork’s main page if recent changes are detected. Click this button. You’ll be prompted to choose the branch in the original repository that you want to compare with your changes. Select `dev` and click on "Create pull request". If you don't find, "Compare & pull request" button, switch to your branch, and click on "Contribute".

**We appreciate your contributions to YTCatalog**
