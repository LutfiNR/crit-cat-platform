# CRIT-CAT Platform

## Overview
CRIT-CAT is a platform designed to measure learning outcomes using Item Response Theory (IRT) with double-tier multiple-choice diagnostic assessment items. This repository contains the core implementation and documentation.

## Features
- **Student Role**: Complete authentication, personal dashboard, adaptive CAT test interface with two-tier questions, timer, anti-cheating detection (tab switching, window minimization), and detailed result review with per-question analysis
- **Teacher Role**: Separate authentication, centralized dashboard with three main tabs for question bank management (CRUD operations with IRT parameters), test assembly and publishing, and comprehensive result analytics with student submission tracking and cascading deletion
- **Technical Stack**: Built with Next.js 14 (App Router), React, Material-UI for responsive UI, MongoDB Atlas for NoSQL database, NextAuth.js for secure authentication, and RESTful API architecture

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
git clone https://github.com/LutfiNR/crit-cat-platform.git
cd crit-cat-platform
npm install
```

### Usage
```bash
npm run dev
```

## Project Structure
```
crit-cat-platform/
├── src/
├── tests/
├── docs/
└── README.md
```

## Contributing
Contributions are welcome! Please read our contributing guidelines.

## Support
For issues and questions, please open a GitHub issue.