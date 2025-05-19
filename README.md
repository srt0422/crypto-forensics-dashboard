# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d50093ba-9203-4b1f-ac1e-1977bd7bd33c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d50093ba-9203-4b1f-ac1e-1977bd7bd33c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d50093ba-9203-4b1f-ac1e-1977bd7bd33c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Crypto Forensics Dashboard

A comprehensive dashboard for blockchain transaction analysis and forensics.

## PDF Export Functionality

The dashboard includes robust PDF export capabilities:

### Features

- Export any single page to PDF
- Export the entire dashboard as a comprehensive report
- Individual exports for specific dashboard sections:
  - Summary Dashboard
  - Network Analytics
  - Inbound Transactions
  - Outbound Transactions
  - Address Attribution
  - Fund Source Hierarchy

### How to Use

1. Click the "Export PDF" button in the top-right corner of any dashboard page
2. Select your desired export option from the dropdown menu
3. Wait for the PDF to generate (this may take a few moments, especially when exporting all pages)
4. The PDF will automatically download when ready

### Technical Implementation

The PDF export functionality uses:
- html2canvas: For capturing DOM elements as images
- jsPDF: For creating PDF documents
- React Router: For navigating between pages during export

## Development

### Prerequisites

- Node.js 14.x or later
- npm 6.x or later

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
dashboard_app/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   │   └── ui/       # UI components (buttons, cards, etc.)
│   ├── data/         # Mock data and data models
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   │   └── pdfExport.ts # PDF export utilities
│   └── pages/        # Dashboard pages
```
