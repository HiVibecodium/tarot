#!/usr/bin/env node

/**
 * Improved script to apply SEO components to pages
 * More robust approach that handles various component structures
 */

const fs = require('fs');
const path = require('path');

// Map page files to their SEO components
const pageSEOMap = {
  'LoveSpreadPage.jsx': { import: 'LoveSpreadSEO', component: '<LoveSpreadSEO />' },
  'CelticCrossPage.jsx': { import: 'CelticCrossSEO', component: '<CelticCrossSEO />' },
  'YearAheadPage.jsx': { import: 'YearAheadSEO', component: '<YearAheadSEO />' },
  'YearSpreadPage.jsx': { import: 'YearAheadSEO', component: '<YearAheadSEO />' },
  'CareerPathPage.jsx': { import: 'CareerSEO', component: '<CareerSEO />' },
  'FinanceSpreadPage.jsx': { import: 'FinanceSEO', component: '<FinanceSEO />' },
  'YesNoSpreadPage.jsx': { import: 'YesNoSEO', component: '<YesNoSEO />' },
  'BirthdaySpreadPage.jsx': { import: 'BirthdaySEO', component: '<BirthdaySEO />' },
  'RelationshipSpreadPage.jsx': { import: 'RelationshipSEO', component: '<RelationshipSEO />' },
  'PastPresentFuturePage.jsx': { import: 'DecisionSEO', component: '<DecisionSEO />' },
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
  const filename = path.basename(filePath);

  // Check if SEO is already imported
  if (content.includes(seoInfo.import)) {
    console.log(`✓ ${filename} already has SEO`);
    return false;
  }

  // Step 1: Add import
  const importRegex = /import .+ from .+/g;
  const imports = content.match(importRegex);

  if (!imports || imports.length === 0) {
    console.log(`⚠ ${filename} - No imports found, skipping`);
    return false;
  }

  const lastImport = imports[imports.length - 1];
  const lastImportIndex = content.lastIndexOf(lastImport);
  const afterLastImport = lastImportIndex + lastImport.length;

  const seoImport = `\nimport { ${seoInfo.import} } from '../components/SEO'`;
  content = content.slice(0, afterLastImport) + seoImport + content.slice(afterLastImport);

  // Step 2: Find the main component's return statement
  // Look for patterns like: return ( followed by opening tag
  const returnMatches = [];
  const returnRegex = /return\s*\(/g;
  let match;
  while ((match = returnRegex.exec(content)) !== null) {
    returnMatches.push(match.index);
  }

  if (returnMatches.length === 0) {
    console.log(`⚠ ${filename} - No return statement found`);
    return false;
  }

  // Use the FIRST return statement (likely the main component)
  const returnIndex = returnMatches[0];
  const afterReturn = content.substring(returnIndex);

  // Find the first opening JSX tag after return (
  const jsxMatch = afterReturn.match(/return\s*\(\s*\n?\s*(<[A-Za-z<>])/);
  if (!jsxMatch) {
    console.log(`⚠ ${filename} - Cannot find JSX after return`);
    return false;
  }

  const jsxStartRelative = jsxMatch.index + jsxMatch[0].length - 1; // Position of <
  const jsxStartAbsolute = returnIndex + jsxStartRelative;

  // Check what comes after the <
  const afterJSXStart = content.substring(jsxStartAbsolute);

  // Determine indentation
  const lineStart = content.lastIndexOf('\n', jsxStartAbsolute) + 1;
  const indentation = content.substring(lineStart, jsxStartAbsolute).match(/^\s*/)[0];

  // Strategy: Insert SEO component right after the first opening tag
  // Find the end of the first opening tag (either /> or >)
  const firstTagMatch = afterJSXStart.match(/^<([A-Za-z]+|>)[^>]*?(\/?>)/);
  if (!firstTagMatch) {
    console.log(`⚠ ${filename} - Cannot parse first tag`);
    return false;
  }

  const firstTagEnd = jsxStartAbsolute + firstTagMatch[0].length;

  // If it's a fragment <>, insert SEO right after it
  // If it's a regular tag, insert SEO as the first child
  const insertPosition = firstTagEnd;
  const seoLine = `\n${indentation}  ${seoInfo.component}`;

  content = content.slice(0, insertPosition) + seoLine + content.slice(insertPosition);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${filename} - SEO applied successfully`);
  return true;
}

// Main execution
console.log('🔍 Applying SEO to pages (improved)...\n');

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
