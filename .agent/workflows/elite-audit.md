---
description: Perform a high-confidence Elite Audit (Lighthouse + Visual + Compliance)
---

# Elite Audit Workflow (/elite-audit)

Execute this workflow to verify a 10/10 project state.

1. **Static Verification:**
   - Run `npm run check` to ensure zero TypeScript errors or hints in the beta environment.
// turbo
2. **Performance Verification:**
   - Run `python ..\.agent\skills\performance-profiling\scripts\lighthouse_audit.py http://localhost:4321`.
   - Goal: 100/100 in all simulated categories.
3. **Visual Regression:**
   - Run `/check-visual` to compare current UI against `.agent/baselines/`.
4. **Compliance Check:**
   - Auditor persona reviews all active components in the modified set against `smile-savers-mobile-ui-master-plan-by-rahul.md`.
5. **Final Reporting:**
   - Generate `audit_report.md` with atom-level data and Expert Council signatures.
