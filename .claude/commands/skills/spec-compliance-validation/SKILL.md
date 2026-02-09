---
name: spec-compliance-validation
description: Ensures strict adherence to Spec-Driven Development using Spec-Kit Plus. Validates that all implementations are mapped to explicit specs, rejecting ambiguous or incomplete requirements. Mandatory before any coding.
---

# Spec Compliance & Validation

## Purpose
Ensure all implementations strictly follow Spec-Driven Development using Spec-Kit Plus. This skill acts as a gatekeeper to prevent coding without clear, written requirements.

## Responsibilities
- **Read Specs**: actively consult specs in `/specs/features`, `/specs/api`, and `/specs/database`.
- **Validate Criteria**: Check for concrete acceptance criteria before starting implementation.
- **Gatekeeping**: Reject incomplete, ambiguous, or unwritten requirements.
- **Traceability**: Ensure every code change maps directly to a specific section of a spec.

## Rules
1. **No Spec, No Code**: Do not generate code without a referenced spec file.
2. **Missing Criteria = Block**: If acceptance criteria are missing or vague, request a spec update immediately.
3. **No Inference**: Never infer requirements not explicitly written in the specs. Clarify instead.
4. **Mandatory Check**: This validation must be performed before writing any implementation code.

## Workflow
1. **Read Relevant Spec**: Locate and read the `specs/` file corresponding to the task.
2. **Validate Completeness**: Check for:
   - Clear Description
   - Acceptance Criteria (Pass/Fail conditions)
   - Data Contract definitions (if API/DB involved)
3. **Decision**:
   - **Approve**: If all checks pass, proceed to coding plan.
   - **Block**: If checks fail, stop and ask user to update the spec.

## Validation Checklist (Pre-Implementation)
Before writing code, verify:
- [ ] A corresponding spec file exists in `/specs/`.
- [ ] The spec containing the feature is read into context.
- [ ] Acceptance Criteria are explicitly listed.
- [ ] No ambiguous terms ("fast", "better", "Standard") are used without definition.
- [ ] Every planned code change references a line/section in the spec.
