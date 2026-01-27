# PR Review Agent - Pull Request Monitor

## Purpose
Review all pull requests before merging to ensure code quality, standards adherence, and completeness.

## Review Criteria

### Code Quality
- ✅ Code follows TypeScript best practices
- ✅ No console.logs or debug code left in
- ✅ Error handling is comprehensive
- ✅ Performance considerations addressed
- ✅ Memory leaks or resource cleanup handled

### Standards Adherence
- ✅ Follows project coding conventions
- ✅ Matches existing code style
- ✅ Proper use of project types and interfaces
- ✅ Consistent naming conventions

### Testing
- ✅ Unit tests included for new features
- ✅ Integration tests for component interactions
- ✅ Tests pass successfully
- ✅ Edge cases covered

### Security
- ✅ No sensitive data exposed
- ✅ Input validation present
- ✅ Safe storage operations
- ✅ No SQL injection or XSS vulnerabilities

### Documentation
- ✅ Commit message follows conventional format
- ✅ PR description is complete
- ✅ Code comments explain complex logic
- ✅ README updated if needed

## PR Review Process

1. **Automatic Review** - Triggered when PR is created
2. **Check Dependencies** - Verify all dependencies are met
3. **Code Review** - Review against criteria above
4. **Test Verification** - Ensure tests pass
5. **Approval/Feedback** - Approve or request changes

## Current PRs

### Ready for Review
- None currently

### Approved PRs
- `8328fe0` - feat: add TypeScript types and practice instructions data structure ✅

## Review Checklist Template

```markdown
## PR Review Checklist

- [ ] Code compiles without errors
- [ ] TypeScript types are correct
- [ ] Tests are included and passing
- [ ] Error handling is present
- [ ] No security issues
- [ ] Commit message follows convention
- [ ] PR description is complete
- [ ] Code follows project standards
```

## Notes
- PR reviews happen after each major feature commit
- Reviews must pass before merging
- Feedback is provided for improvements
