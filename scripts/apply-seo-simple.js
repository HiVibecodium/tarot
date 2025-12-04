#!/usr/bin/env node

/**
 * Simple and reliable script to apply SEO components
 * Inserts SEO right after the main container opening tag
 */

const fs = require('fs');
const path = require('path');

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
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);

  // Check if SEO is already applied
  if (content.includes(seoInfo.import)) {
    console.log(`✓ ${filename} already has SEO`);
    return false;
  }

  // Split into lines for easier manipulation
  const lines = content.split('\n');
  const newLines = [];
  let importAdded = false;
  let seoAdded = false;
  let inMainReturn = false;
  let returnDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Add import after last import statement
    if (!importAdded && line.match(/^import .+ from .+/) &&
        (i === lines.length - 1 || !lines[i + 1].match(/^import .+ from .+/))) {
      newLines.push(line);
      newLines.push(`import { ${seoInfo.import} } from '../components/SEO'`);
      importAdded = true;
      continue;
    }

    newLines.push(line);

    // Detect main return statement
    if (!inMainReturn && line.includes('return (')) {
      inMainReturn = true;
      returnDepth = 0;
    }

    // Once in main return, find the first line with an opening tag that has content after it
    if (inMainReturn && !seoAdded && returnDepth === 0) {
      // Check if this line has an opening tag like <div className="...">
      if (line.trim().match(/^<\w+[^>]*>$/)) {
        // Get indentation from current line
        const indent = line.match(/^(\s*)/)[1];
        // Add SEO component with proper indentation
        newLines.push(`${indent}  ${seoInfo.component}`);
        seoAdded = true;
        inMainReturn = false; // Stop looking
      }
    }
  }

  if (!importAdded) {
    console.log(`⚠ ${filename} - Could not add import`);
    return false;
  }

  if (!seoAdded) {
    console.log(`⚠ ${filename} - Could not add SEO component`);
    return false;
  }

  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  console.log(`✓ ${filename} - SEO applied`);
  return true;
}

// Main execution
console.log('🔍 Applying SEO to pages (simple approach)...\n');

let successCount = 0;
let skippedCount = 0;

Object.entries(pageSEOMap).forEach(([filename, seoInfo]) => {
  const filePath = path.join(pagesDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ ${filename} - File not found`);
    skippedCount++;
    return;
  }

  try {
    const success = applySEOToPage(filePath, seoInfo);
    if (success) {
      successCount++;
    } else {
      skippedCount++;
    }
  } catch (error) {
    console.log(`❌ ${filename} - Error: ${error.message}`);
    skippedCount++;
  }
});

console.log(`\n✅ Done! Applied SEO to ${successCount} pages, skipped ${skippedCount}`);
