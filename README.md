# TechRadar

TechRadar is a dynamic, interactive visualization tool designed to help organizations track and manage their technology stack. It provides a clear, visual representation of various technologies, categorized into quadrants and rings, allowing teams to quickly assess and communicate the status of different tools, techniques, platforms, and frameworks within their ecosystem.

## Features

- Interactive radar chart visualization
- CRUD operations for technology "blips"
- Filtering and search functionality
- Overview page with distribution charts
- Responsive design for various screen sizes

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/vstoms/techradar.git
   cd techradar
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project credentials.

## Running the Project Locally

To start the development server:

```
npm run dev
```

This will start the Vite development server. Open your browser and navigate to `http://localhost:5173` to view the application.

## Usage

1. **Viewing the Radar**: The main page displays the TechRadar visualization. You can zoom and pan the radar for a better view.

2. **Adding a Blip**: Click the "Add New Blip" button to open a form where you can input details for a new technology.

3. **Editing/Deleting Blips**: In the list view, use the edit and delete icons next to each blip to modify or remove entries.

4. **Filtering**: Use the search bar and dropdown filters to narrow down the displayed blips.

5. **Overview**: Switch to the Overview page to see distribution charts and a tabular view of all blips.

## Dependencies

This project relies on the following main dependencies:

- React
- Vite
- D3.js
- Chart.js
- React Chart.js 2
- Supabase
- Tailwind CSS

For a full list of dependencies, refer to the `package.json` file.

## Configuration

The project uses Vite as its build tool and development server. Configuration for Vite can be found in `vite.config.ts`.

Tailwind CSS is used for styling, with its configuration in `tailwind.config.js`.

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed (`npm install`)
2. Check that your `.env` file is set up correctly with valid Supabase credentials
3. Clear your browser cache and restart the development server
4. Check the browser console for any error messages

If problems persist, please open an issue on the GitHub repository.

## Contributing

Contributions to TechRadar are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to the existing style and that you've tested your changes thoroughly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
