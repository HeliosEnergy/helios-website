import fs from 'fs';
import path from 'path';

// List of files to consolidate (as provided by user)
const filesToInclude = [
  // Main Map Components
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/Map/DeckGLMap.jsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/Map/SimpleDeckGLMap.jsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/Map/InfoPanel.jsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/Map/LayerControls.jsx',
  // Data Processing Components
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/PowerPlantProcessor.js',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/CableProcessor.js',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/TerrestrialProcessor.js',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/testData.js',
  // Utility Files
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/utils/dataUtils.js',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/utils/colorUtils.js',
  // UI Components
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/UI/Legend.jsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/UI/FilterPanel.jsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/UI/StatsDashboard.jsx',
  // Page Components
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/pages/map/MapPage.tsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/pages/map/MapLeafletPage.tsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/pages/map/MapCanadaPage.tsx',
  // Styling Files
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/styles/map.css',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/pages/map/Map.scss',
  // Test Files
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/PowerPlantProcessor.test.js',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/CableProcessor.test.js',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/utils/dataUtils.test.js',
  // Configuration Files
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/tailwind.config.js',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/postcss.config.js',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/vite.config.ts',
  // Entry Points
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/main.tsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/App.tsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/routes.tsx',
  '/Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/index.css'
];

// Function to get appropriate language identifier for code blocks
function getLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.js':
    case '.jsx':
      return 'javascript';
    case '.ts':
    case '.tsx':
      return 'typescript';
    case '.css':
      return 'css';
    case '.scss':
      return 'scss';
    case '.json':
      return 'json';
    case '.md':
      return 'markdown';
    case '.html':
      return 'html';
    default:
      return 'plaintext';
  }
}

// Function to process a file and add its content to the markdown
function processFile(filePath, markdownContent) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return markdownContent + `\n\n## ${filePath}\n\n*File not found*\n`;
    }

    // Skip CSV files
    if (path.extname(filePath).toLowerCase() === '.csv') {
      return markdownContent + `\n\n## ${filePath}\n\n*CSV file skipped*\n`;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const language = getLanguage(filePath);
    
    return markdownContent + `\n\n## ${filePath}\n\n\`\`\`${language}\n${content}\n\`\`\``;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return markdownContent + `\n\n## ${filePath}\n\n*Error reading file: ${error.message}*\n`;
  }
}

// Main function to consolidate files
function consolidateFiles() {
  let markdownContent = '# Project Files Consolidation\n\nThis document contains the content of all specified project files.\n';
  
  // Process each file in the list
  filesToInclude.forEach(filePath => {
    markdownContent = processFile(filePath, markdownContent);
  });

  // Write to output file
  const outputPath = path.join(process.cwd(), 'project_files_consolidation.md');
  fs.writeFileSync(outputPath, markdownContent);
  console.log(`Consolidation complete. Output written to ${outputPath}`);
}

// Run the consolidation
consolidateFiles();