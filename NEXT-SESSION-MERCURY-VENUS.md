# 📋 Next Session: Add Mercury + Venus

## Quick Integration Guide (30 min)

### Step 1: Open File
src/frontend/src/pages/NatalChartPage.jsx

### Step 2: Find Location
After line 712 (after Rising block closes)
Before "Natal Chart Wheel Visualization"

### Step 3: Insert Code
Copy from mercury-venus-addition.jsx

### Step 4: Update Title
Change "Три ключевых точки" to "Пять ключевых точек"

### Step 5: Add CSS
```css
.fourth-point { border-left-color: #f39c12; }
.fifth-point { border-left-color: #e91e63; }
.sign-hierarchy-badge.fourth { background: #fff3e0; color: #e65100; }
.sign-hierarchy-badge.fifth { background: #fce4ec; color: #c2185b; }
.mercury-box { border-left-color: #f39c12; background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%); }
.venus-box { border-left-color: #e91e63; background: linear-gradient(135deg, #fce4ec 0%, #ffffff 100%); }
```

### Step 6: Test
npm run build
Open http://localhost:5174

### Step 7: Commit
git commit -m "feat: Add Mercury and Venus as 4th and 5th key points"

TOTAL TIME: 30 minutes
RESULT: 5 key points complete!
