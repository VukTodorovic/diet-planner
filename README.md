# Diet Planner

A premium, frontend-only web application for creating, managing, and exporting personalized diet plans. Built with React, TypeScript, and Vanilla CSS.

## Features

- **Plan Management**: Create and manage multiple diet plans with automatic creation dates.
- **Multiple Options**: Support for multiple variations (e.g., Option 1, Option 2) within a single diet plan.
- **Meal Planning**: Add unlimited meals to each option.
- **Food Database**: Integrated database of common foods with calorie information.
- **Smart Calculations**: Real-time calorie calculation for individual items, meals, options, and the entire plan.
- **Notes System**: Add detailed notes at the Plan, Option, and Meal levels.
- **PDF Export**: Generate professional PDF reports with your custom logo, including all options, notes, and calorie breakdowns.
- **Data Persistence**: All data is automatically saved to your browser's Local Storage.
- **Premium UI**: A fully responsive, dark-themed interface with glassmorphism effects and smooth transitions.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Variables, Flexbox, Grid, Media Queries)
- **Icons**: Lucide React
- **PDF Generation**: jsPDF, jspdf-autotable
- **Utilities**: uuid (ID generation)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Usage

1. **Dashboard**: View your existing plans or create a new one.
2. **Plan Editor**:
    - **Rename Plan**: Click the plan name to edit it.
    - **Add Options**: Use the "+ Option" button to create variations.
    - **Add Meals**: Click "Add Meal" to start building your menu.
    - **Add Foods**: Select foods from the dropdown menu.
    - **Adjust Quantities**: Enter amounts (e.g., `1.5` for 150g or 1.5 pieces).
    - **Add Notes**: Use the text fields to add instructions or details.
3. **Export**: Click the "Export PDF" button to download your plan.

## Project Structure

```
src/
├── assets/         # Static assets (logo, etc.)
├── components/     # Reusable UI components
├── data/           # Hardcoded food data
├── pages/          # Page components (Dashboard, PlanEditor)
├── types/          # TypeScript definitions
├── utils/          # Helper functions (storage, calculations)
├── App.tsx         # Main application component
└── index.css       # Global styles and theme variables
```

## License

This project is licensed under the MIT License.
