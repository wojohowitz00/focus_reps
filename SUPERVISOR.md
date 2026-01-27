# Supervisor Agent - Code Quality Monitor

## Purpose
Monitor and verify subagent work to ensure code quality, task completion, and adherence to project standards.

## Responsibilities

### Code Quality Checks
- ✅ Verify TypeScript types are properly used
- ✅ Check code follows project structure conventions
- ✅ Ensure consistent code formatting
- ✅ Validate error handling is present
- ✅ Review component prop types and interfaces

### Task Completion Verification
- ✅ Verify tasks match requirements from plan
- ✅ Check all dependencies are met before task starts
- ✅ Ensure tests are written for new features
- ✅ Validate git commits follow conventional commit format

### Project Standards
- ✅ File naming conventions (camelCase for files, PascalCase for components)
- ✅ Folder structure adherence
- ✅ Import organization
- ✅ Comment and documentation quality

## Current Status

### ✅ Completed Tasks Verified
- `setup-1-init-expo` - Expo project structure verified
- `setup-2-install-deps` - Dependencies installed correctly
- `setup-5-types` - TypeScript types properly defined
- `schedule-1-practice-definitions` - Practice definitions complete with helper functions
- `storage-1-wrapper-setup` - Storage wrapper implemented with all CRUD operations
- `timer-1-ui-layout` - Timer component created with circular progress
- `setup-4-navigation` - Navigation structure implemented

### 🔍 Review Checklist
When reviewing subagent work:
1. [ ] Code compiles without errors
2. [ ] TypeScript types are used correctly
3. [ ] Tests are included (for feature tasks)
4. [ ] Git commit message follows convention
5. [ ] Code follows project structure
6. [ ] Error handling is present
7. [ ] Documentation/comments are clear

## Notes
- Supervisor runs continuously after setup
- Reviews happen before PR creation
- Provides feedback to subagents for improvements
