# LaunchPage Builder

A modern drag-and-drop website builder with themes, inline editing, autosave, and multiple publishing options.

## Features

- **Drag & Drop Builder**: Create pages by dragging blocks into place
- **Inline Editing**: Edit text directly on the page
- **Theme Selection**: Choose from multiple themes to change your site's appearance
- **Autosave**: Never lose your work with automatic saving
- **Version History**: Browse and restore previous versions of your pages
- **Multiple Publishing Options**: Download HTML, WordPress export, and more
- **Team Collaboration**: Invite team members with different roles and permissions
- **User-friendly Dashboard**: Manage all your pages and settings in one place

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Option 1: Install from npm

```bash
npm install launchpage-builder
```

### Option 2: Install from zip

1. Download the `launchpage-builder.zip` file
2. Extract the contents to your desired location
3. Navigate to the extracted directory
4. Install dependencies:

```bash
npm install
```

## Usage

### Starting the application

```bash
npm start
```

This will start the application on http://localhost:3000

### Development mode

```bash
npm run dev
```

This will start the application with hot-reloading enabled, watching for CSS changes.

### Building for production

```bash
npm run build
```

This will build optimized CSS and prepare the application for deployment.

## Directory Structure

```
launchpage-builder/
├── frontend/
│   ├── public/           # Static assets and HTML files
│   │   ├── dist/         # Compiled CSS
│   │   ├── shared/       # Shared JavaScript files
│   │   └── ...           # HTML pages
│   └── src/              # Source files
│       └── styles.css    # Tailwind CSS source
├── package.json          # Project configuration
└── README.md             # This file
```

## Pages Overview

- **Dashboard**: Main overview of your pages and recent activity
- **Pages**: List of your created pages with management options
- **Templates**: Pre-built templates you can use to start a new page
- **Feature Demo**: Demonstrations of all available features
- **Team Settings**: Manage your team profile and API settings
- **Team Members**: Invite and manage team members and their roles
- **Billing**: Manage your subscription plan and payment details
- **Page Builder**: Drag-and-drop interface to build and customize pages

## Demo Mode

The application includes a mock API for demonstration purposes. In a real deployment, you would connect to your actual backend services.

## License

MIT 