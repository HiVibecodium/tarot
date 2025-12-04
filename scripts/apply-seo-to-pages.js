#!/usr/bin/env node

/**
 * Script to apply SEO components to all pages
 * Automatically adds SEO imports and components to pages that don't have them
 */

const fs = require('fs');
const path = require('path');

// Map page files to their SEO components
const pageSEOMap = {
  'LoveSpreadPage.jsx': { import: 'LoveSpreadSEO', component: '<LoveSpreadSEO />' },
  'CelticCrossPage.jsx': { import: 'CelticCrossSEO', component: '<CelticCrossSEO />' },
  'YearAheadPage.jsx': { import: 'YearAheadSEO', component: '<YearAheadSEO />' },
  'YearSpreadPage.jsx': { import: 'YearAheadSEO', component: '<YearAheadSEO />' }, // Same as YearAhead
  'CareerPathPage.jsx': { import: 'CareerSEO', component: '<CareerSEO />' },
  'FinanceSpreadPage.jsx': { import: 'FinanceSEO', component: '<FinanceSEO />' },
  'YesNoSpreadPage.jsx': { import: 'YesNoSEO', component: '<YesNoSEO />' },
  'BirthdaySpreadPage.jsx': { import: 'BirthdaySEO', component: '<BirthdaySEO />' },
  'RelationshipSpreadPage.jsx': { import: 'RelationshipSEO', component: '<RelationshipSEO />' },
  'PastPresentFuturePage.jsx': { import: 'DecisionSEO', component: '<DecisionSEO />' }, // Similar spread
  'NatalChartPage.jsx': { import: 'NatalChartSEO', component: '<NatalChartSEO />' },
  'NumerologyPage.jsx': { import: 'NumerologySEO', component: '<NumerologySEO />' },
  'JournalPage.jsx': { import: 'JournalSEO', component: '<JournalSEO />' },
  'MoonCalendarPage.jsx': { import: 'MoonCalendarSEO', component: '<MoonCalendarSEO />' },
  'HistoryPage.jsx': { import: 'HistorySEO', component: '<HistorySEO />' },
  'AnalyticsPage.jsx': { import: 'AnalyticsSEO', component: '<AnalyticsSEO />' },
  'ProfilePage.jsx': { import: 'ProfileSEO', component: '<ProfileSEO />' },
};

const pagesDir = path.join(__dirname, '..', 'src', 'frontend', 'src', 'pages');

function applySEOToPage(filePath, seoInfo) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if SEO is already imported
  if (content.includes(seoInfo.import)) {
    console.log(`✓ ${path.basename(filePath)} already has SEO`);
    return false;
  }

  // Find the last import statement
  const importRegex = /import .+ from .+/g;
  const imports = content.match(importRegex);

  if (!imports || imports.length === 0) {
    console.log(`⚠ ${path.basename(filePath)} - No imports found, skipping`);
    return false;
  }

  const lastImport = imports[imports.length - 1];
  const lastImportIndex = content.lastIndexOf(lastImport);
  const afterLastImport = lastImportIndex + lastImport.length;

  // Add SEO import after the last import
  const seoImport = `\nimport { ${seoInfo.import} } from '../components/SEO'`;
  content = content.slice(0, afterLastImport) + seoImport + content.slice(afterLastImport);

  // Find the main return statement
  const returnMatch = content.match(/return\s*\(/);
  if (!returnMatch) {
    console.log(`⚠ ${path.basename(filePath)} - No return statement found, skipping`);
    return false;
  }

  const returnIndex = returnMatch.index + returnMatch[0].length;

  // Check if already wrapped in fragment
  const afterReturn = content.substring(returnIndex).trim();
  const isWrappedInFragment = afterReturn.startsWith('<>');

  if (isWrappedInFragment) {
    // Already wrapped, just add SEO component after <>
    const fragmentStart = content.indexOf('<>', returnIndex);
    const insertPosition = fragmentStart + 2;

    content = content.slice(0, insertPosition) +
              `\n      ${seoInfo.component}` +
              content.slice(insertPosition);
  } else {
    // Need to wrap in fragment
    // Find the opening tag after return
    const openingTagMatch = content.substring(returnIndex).match(/<(\w+)/);
    if (!openingTagMatch) {
      console.log(`⚠ ${path.basename(filePath)} - Cannot find opening tag`);
      return false;
    }

    const tagName = openingTagMatch[1];

    // Insert fragment and SEO
    content = content.slice(0, returnIndex) +
              `\n    <>\n      ${seoInfo.component}\n      ` +
              content.slice(returnIndex).trimStart();

    // Find the corresponding closing tag and add fragment close
    // This is simplified - looks for the function's closing brace
    const functionEnd = content.lastIndexOf('\n}');
    const beforeFunctionEnd = content.lastIndexOf('\n', functionEnd - 1);

    content = content.slice(0, beforeFunctionEnd) +
              '\n    </>' +
              content.slice(beforeFunctionEnd);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${path.basename(filePath)} - SEO applied successfully`);
  return true;
}

// Main execution
console.log('🔍 Applying SEO to pages...\n');

let successCount = 0;
let skippedCount = 0;

Object.entries(pageSEOMap).forEach(([filename, seoInfo]) => {
  const filePath = path.join(pagesDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ ${filename} - File not found, skipping`);
    skippedCount++;
    return;
  }

  const success = applySEOToPage(filePath, seoInfo);
  if (success) {
    successCount++;
  } else {
    skippedCount++;
  }
});

console.log(`\n✅ Done! Applied SEO to ${successCount} pages, skipped ${skippedCount}`);
console.log('\nNext: Run `npm run build` to verify everything works');
