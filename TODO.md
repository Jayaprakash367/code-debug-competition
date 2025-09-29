# TODO

## Anti-Cheating Implementation in Workspace

- [x] Add state variables for anti-cheating (isWarningVisible, isDisqualified, warningReason) in Workspace.jsx
- [x] Add useRef for editor container to handle paste events
- [x] Implement visibilitychange event listener for detecting tab switches/minimizes
- [x] Implement paste event prevention and suspicious paste detection
- [x] Add warning modal UI component in Workspace.jsx
- [x] Implement disqualification logic (stop timer, navigate to /disqualified)
- [x] Disable editor and buttons during warning/disqualification
- [x] Update Disqualified.jsx to display disqualification reason
- [ ] Test anti-cheating features (tab switch, paste prevention, disqualification flow)

## Text Clipping Fix in Landing Page

- [x] Edit src/components/Landing.jsx: Add leading-[1.2] to h1 and h2 for increased line-height to prevent descender clipping.
- [x] Edit src/components/Landing.jsx: Add pb-4 class to the mb-6 div wrapping the headings for extra bottom padding.
- [x] Run the development server and verify the fix by checking the landing page headings ("Code Debugging" and "Competition") for proper rendering of letters like 'g', 'p', 'tt'.
- [x] Update TODO.md to mark steps as complete and confirm the task is done.

## Enhanced Text Clipping Fix in Landing Page

- [x] Edit src/components/Landing.jsx: Change main container class from "overflow-hidden" to "overflow-visible".
- [x] Edit src/components/Landing.jsx: Increase line-height on h1 and h2 from "leading-[1.2]" to "leading-[1.5]".
- [x] Edit src/components/Landing.jsx: Increase bottom padding on wrapper div from "pb-4" to "pb-8".
- [x] Run `npm run dev` and verify rendering of descenders ('g', 'p', etc.) in browser at <http://localhost:5173>.
- [x] Update TODO.md to mark steps complete.
