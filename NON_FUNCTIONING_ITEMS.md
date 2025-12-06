# Non-Functioning Features & Issues

## 🔴 CRITICAL - Completely Broken

### 1. **Feedback API Route** (Email Functionality)
**Location**: `/app/api/feedback/route.ts`

**Issue**: 
- Email sending functionality exists but is NOT ACCESSIBLE from UI
- Requires `RESEND_API_KEY` environment variable (not configured)
- Requires `FEEDBACK_EMAIL` environment variable (not configured)
- No feedback form/button exists in the UI to trigger this endpoint

**Why it doesn't work**:
- Missing `.env` file with API keys
- No UI component to collect user feedback
- Resend API integration needs valid API key from resend.com

**To fix**:
1. Sign up at resend.com and get API key
2. Create `.env.local` file with:
   ```
   RESEND_API_KEY=your_key_here
   FEEDBACK_EMAIL=your_email@example.com
   ```
3. Create a feedback form component in UI
4. Add feedback button to layout/header

---

### 2. **Multilevel Feedback Queue Algorithm - Missing Implementation**
**Location**: `/app/api/feedback/` directory

**Issue**:
- Route file exists (`route.ts`) but it's for EMAIL feedback, NOT the scheduling algorithm
- No `feedback.js` algorithm implementation file exists
- Algorithm is NOT listed in the SelectAlgorithm dropdown
- API endpoint doesn't handle MLFQ scheduling logic

**Why it doesn't work**:
- Confusion between "feedback" (email) and "feedback queue" (algorithm)
- Algorithm logic completely missing
- No UI option to select this algorithm

**To fix**:
1. Create `/app/api/multilevel_feedback_queue/` directory
2. Implement MLFQ algorithm in `multilevel_feedback_queue.js`
3. Create `route.ts` for the algorithm endpoint
4. Add "Multilevel Feedback Queue" option to SelectAlgorithm dropdown
5. Add input fields for queue levels and time quantum per level

---

## 🟠 MAJOR - Partially Broken or Missing Critical Features

### 3. **Reset Button - Not Visible in UI**
**Location**: `handleReset()` function exists in `/app/algorithms/page.tsx`

**Issue**:
- Reset functionality is coded but NO button exists in the UI
- Users cannot clear data without refreshing the page
- Function exists at line 52-63 but never rendered

**Why it doesn't work**:
- Button not added to JSX return statement
- Only "Submit" and "Export results" buttons are visible

**To fix**:
1. Add Reset button next to Submit button:
   ```tsx
   <Button onClick={handleReset} variant="outline">Reset</Button>
   ```

---

### 4. **Missing Favicon Images**
**Location**: Referenced in `/app/layout.tsx` but missing from `/public/`

**Issue**:
- `og-image.png` referenced in OpenGraph metadata (line 100+) - **DOES NOT EXIST**
- Results in 404 errors when sharing links
- Affects social media previews

**Files that exist**:
- ✅ favicon.ico, favicon.svg
- ✅ favicon-16x16.png, favicon-32x32.png, favicon-96x96.png
- ✅ apple-touch-icon.png

**Files missing**:
- ❌ og-image.png (Open Graph image for social sharing)

**To fix**:
1. Create 1200x630px image named `og-image.png`
2. Save in `/public/` directory
3. Should contain app name and preview

---

### 5. **Environment Variables Not Configured**
**Location**: Root directory

**Issue**:
- No `.env.local` or `.env` file exists
- Feedback API will fail if accessed
- Missing required configuration

**Required but missing**:
```env
RESEND_API_KEY=re_xxxxxxxxx
FEEDBACK_EMAIL=your-email@example.com
ALLOWED_ORIGINS=* (or specific domains)
```

**To fix**:
1. Create `.env.local` file in root
2. Add required environment variables
3. Restart development server

---

## 🟡 MINOR - UI/UX Issues

### 6. **Error Display Mechanism**
**Location**: `/app/algorithms/page.tsx`

**Issue**:
- `error` state variable exists but NOT displayed to user
- Errors logged to console but user sees nothing
- `setError()` called but no UI element shows the error

**Current behavior**:
- Silent failures for API errors
- User doesn't know what went wrong

**To fix**:
1. Add error alert component above submit button:
   ```tsx
   {error && (
     <div className="text-red-600 bg-red-50 p-3 rounded-md">
       {error}
     </div>
   )}
   ```

---

### 7. **Loading State Not Visible**
**Location**: `/app/algorithms/page.tsx`

**Issue**:
- `isLoading` state exists but no loading indicator shown
- User can't tell if algorithm is processing
- Button doesn't show loading state

**To fix**:
1. Add loading state to Submit button:
   ```tsx
   <Button onClick={handleSubmit} disabled={isLoading}>
     {isLoading ? "Processing..." : "Submit"}
   </Button>
   ```
2. Add spinner/loader animation

---

### 8. **Time Quantum Reset Issue**
**Location**: `/app/(components)/processInserter.tsx`

**Issue**:
- `handleReset()` sets `timeQuantum` to 0 instead of default value 2
- Time quantum of 0 will cause Round Robin to fail
- Inconsistent with initial state (default: 2 in store.ts)

**To fix**:
1. Change reset to set time quantum to 2:
   ```tsx
   setTimeQuantum(2); // instead of setTimeQuantum(0)
   ```

---

### 9. **Validation Gaps**
**Location**: `/app/algorithms/page.tsx` & `/app/(components)/processInserter.tsx`

**Issue**:
- No validation for Round Robin time quantum (can be 0 or negative)
- No validation for maximum number of processes
- No validation for algorithm selection before adding processes
- Alert-based validation (poor UX)

**Problems**:
- Can add processes without selecting algorithm
- Can run Round Robin with time quantum = 0
- Can add unlimited processes (performance issue)

**To fix**:
1. Add inline validation messages
2. Disable add process button until algorithm selected
3. Validate time quantum > 0 for Round Robin
4. Add max process limit (e.g., 50 processes)

---

## 🟢 WORKING BUT COULD BREAK

### 10. **PDF Export - Canvas Dependency**
**Location**: `handleExportResults()` function

**Issue**:
- Uses `html2canvas` which can fail with complex DOM
- No error handling for canvas rendering failures
- Large Gantt charts may exceed canvas size limits

**Potential failures**:
- Charts not rendering in PDF
- PDF generation timeout for many processes
- Memory issues with large datasets

**To fix**:
1. Add try-catch around html2canvas calls
2. Add timeout handling
3. Add fallback for failed chart captures
4. Consider SVG export as alternative

---

### 11. **Comparison Chart - Algorithm Limitations**
**Location**: `handleComparison()` function

**Issue**:
- Only works for specific algorithm groups:
  - Group 1: fcfs, sjf_*, round_robin
  - Group 2: priority_* algorithms
- No comparison if wrong algorithm selected
- Silent failure - no message shown

**To fix**:
1. Show message: "Comparison not available for this algorithm"
2. Explain which algorithms can be compared
3. Add "Compare All" option

---

## 📊 Summary Count

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 CRITICAL | 2 | Features completely broken/missing |
| 🟠 MAJOR | 5 | Missing features or partial functionality |
| 🟡 MINOR | 4 | UI/UX issues affecting usability |
| 🟢 WARNING | 2 | Working but fragile/could break |
| **TOTAL** | **13** | **Issues identified** |

---

## Priority Fix Order

### **Immediate (Do First)**
1. Add Reset button to UI
2. Fix Time Quantum reset to default value 2
3. Display error messages to users
4. Add loading states to buttons
5. Add inline validation for inputs

### **Important (Do Soon)**  
6. Create og-image.png for social sharing
7. Improve validation (time quantum, process limits)
8. Add error handling for PDF export
9. Add comparison unavailable message

### **Optional (Can Wait)**
10. Implement Multilevel Feedback Queue algorithm
11. Add feedback form to UI
12. Configure environment variables for email

---

## Testing Checklist

To verify fixes:
- [ ] Can click Reset button and all data clears
- [ ] Error messages appear when issues occur
- [ ] Loading spinner shows during processing
- [ ] Time quantum defaults to 2 after reset
- [ ] Round Robin validates time quantum > 0
- [ ] Cannot submit without processes
- [ ] Cannot add processes without algorithm
- [ ] PDF export handles errors gracefully
- [ ] Comparison shows message when unavailable
- [ ] Social sharing shows proper image

---

**Last Updated**: December 6, 2025
