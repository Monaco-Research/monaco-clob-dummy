# Monaco CLOB Dummy - Contributor Workflow Guide

## 🎯 Purpose
This repository serves as a dummy implementation for Monaco's Central Limit Order Book (CLOB) - "The fastest CLOB on EVM, built on Sei". This guide provides step-by-step instructions for contributors to manage issues, kanban board workflow, and pull requests.

## 📋 Complete Contributor Workflow

### Step 1: One-Time Setup (Required Once Per Contributor)

#### A. GitHub CLI Authentication
```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Windows: winget install GitHub.cli
# Linux: See https://github.com/cli/cli#installation

# Authenticate with project permissions (required for kanban board access)
gh auth refresh -s project
```
**What this does:** Grants your GitHub CLI permission to manage organization project boards.

#### B. Clone Repository (if not done)
```bash
git clone https://github.com/Monaco-Research/monaco-clob-dummy.git
cd monaco-clob-dummy
```

### Step 2: Creating and Managing Issues

#### A. Create a New Feature/Bug Issue
```bash
# Basic issue creation
gh issue create --repo monaco-research/monaco-clob-dummy \
  --title "Your Feature Title" \
  --body "Detailed description of the feature or bug" \
  --assignee @me

# Example:
gh issue create --repo monaco-research/monaco-clob-dummy \
  --title "Implement Order Matching Algorithm" \
  --body "Add basic buy/sell order matching logic with price-time priority" \
  --assignee @me
```

**What this does:** 
- Creates a new issue in the repository
- Assigns it to yourself (@me)
- Returns a URL like: `https://github.com/Monaco-Research/monaco-clob-dummy/issues/X`

#### B. Find Your Project Board Number
```bash
gh project list --owner monaco-research
```
**Expected Output:**
```
NUMBER  TITLE                     STATE  ID                  
1       @ppitlehra's dummy board  open   PVT_kwDODMHapM4A6QFS
```

#### C. Add Issue to Kanban Board
```bash
# Replace X with your issue number from step 2A
gh project item-add 1 --owner monaco-research \
  --url "https://github.com/Monaco-Research/monaco-clob-dummy/issues/X"

# Example:
gh project item-add 1 --owner monaco-research \
  --url "https://github.com/Monaco-Research/monaco-clob-dummy/issues/4"
```

**What this does:** Adds your issue to the kanban board in the "Todo" column.

## 🤖 Automation Commands

### Assigning Issues
```bash
# Assign issue to yourself
gh issue edit ISSUE_NUMBER --add-assignee @me --repo monaco-research/monaco-clob-dummy

# Assign to specific user
gh issue edit ISSUE_NUMBER --add-assignee USERNAME --repo monaco-research/monaco-clob-dummy

# Assign to multiple users
gh issue edit ISSUE_NUMBER --add-assignee user1,user2,user3 --repo monaco-research/monaco-clob-dummy

# Example:
gh issue edit 4 --add-assignee @me --repo monaco-research/monaco-clob-dummy
```

### Moving Issues Across Kanban Board
```bash
# Get project information (run once to get IDs)
gh project field-list 1 --owner monaco-research
gh project item-list 1 --owner monaco-research --format json

# Move issue to different status (you'll need specific IDs from above commands)
# General format:
gh project item-edit --id ITEM_ID --field-id FIELD_ID --single-select-option-id STATUS_ID --project-id PROJECT_ID

# Practical workflow commands:
# 1. Get item ID for your issue
ITEM_ID=$(gh project item-list 1 --owner monaco-research --format json | jq -r '.items[] | select(.content.number == ISSUE_NUMBER) | .id')

# 2. Move to "In Progress" (replace with actual status option ID)
gh project item-edit --id $ITEM_ID --field-id PVTSSF_lADODMHapM4A6QFSzgu5oAI --text "In Progress" --project-id PVT_kwDODMHapM4A6QFS
```

### Complete Automated Workflow Scripts

#### Script 1: Create Issue + Auto-assign + Add to Board
```bash
#!/bin/bash
# create-and-assign.sh

# Usage: ./create-and-assign.sh "Issue Title" "Issue Description" "username"

TITLE="$1"
BODY="$2"
ASSIGNEE="${3:-@me}"  # Default to self if no assignee specified

echo "🚀 Creating issue..."
ISSUE_URL=$(gh issue create --repo monaco-research/monaco-clob-dummy \
  --title "$TITLE" \
  --body "$BODY" \
  --assignee "$ASSIGNEE")

echo "✅ Issue created: $ISSUE_URL"

echo "📋 Adding to kanban board..."
gh project item-add 1 --owner monaco-research --url "$ISSUE_URL"

echo "🎯 Issue successfully created and added to board!"
echo "🔗 URL: $ISSUE_URL"
```

#### Script 2: Move Issue Status
```bash
#!/bin/bash
# move-issue-status.sh

# Usage: ./move-issue-status.sh ISSUE_NUMBER STATUS
# STATUS options: "Todo", "In Progress", "In Review", "Done"

ISSUE_NUMBER="$1"
NEW_STATUS="$2"

echo "🔄 Moving issue #$ISSUE_NUMBER to '$NEW_STATUS'..."

# Get the item ID for the issue
ITEM_ID=$(gh project item-list 1 --owner monaco-research --format json | \
  jq -r ".items[] | select(.content.number == $ISSUE_NUMBER) | .id")

if [ -z "$ITEM_ID" ]; then
  echo "❌ Issue #$ISSUE_NUMBER not found on the board"
  exit 1
fi

# Update the status (you may need to adjust field IDs)
gh project item-edit --id "$ITEM_ID" \
  --field-id "PVTSSF_lADODMHapM4A6QFSzgu5oAI" \
  --text "$NEW_STATUS" \
  --project-id "PVT_kwDODMHapM4A6QFS"

echo "✅ Issue #$ISSUE_NUMBER moved to '$NEW_STATUS'"
```

#### Script 3: Full Development Workflow Automation
```bash
#!/bin/bash
# start-feature.sh

# Usage: ./start-feature.sh ISSUE_NUMBER

ISSUE_NUMBER="$1"

echo "🚀 Starting work on issue #$ISSUE_NUMBER..."

# 1. Move issue to "In Progress"
./move-issue-status.sh "$ISSUE_NUMBER" "In Progress"

# 2. Create feature branch
BRANCH_NAME="feature/issue-$ISSUE_NUMBER-$(date +%s)"
git checkout -b "$BRANCH_NAME"

echo "✅ Ready to work!"
echo "📋 Issue #$ISSUE_NUMBER moved to 'In Progress'"
echo "🌿 Created branch: $BRANCH_NAME"
echo "💡 Start coding, then run: git add . && git commit -m 'your message'"
```

### Advanced Automation: Issue Labels and Milestones
```bash
# Add labels to issue
gh issue edit ISSUE_NUMBER --add-label "enhancement,high-priority" --repo monaco-research/monaco-clob-dummy

# Set milestone
gh issue edit ISSUE_NUMBER --milestone "v1.0" --repo monaco-research/monaco-clob-dummy

# Bulk operations with GitHub CLI + jq
# Assign all unassigned issues to yourself
gh issue list --repo monaco-research/monaco-clob-dummy --json number | \
  jq -r '.[].number' | \
  xargs -I {} gh issue edit {} --add-assignee @me --repo monaco-research/monaco-clob-dummy
```

### Step 3: Kanban Board Workflow

#### Board Columns and Issue Progression:
1. **📝 Todo** - New issues, not yet started
2. **🚧 In Progress** - Actively being worked on
3. **👀 In Review** - Pull request submitted, awaiting review
4. **✅ Done** - Completed and merged

#### Moving Issues on the Board:
- **Via Web:** Go to the [project board](https://github.com/orgs/monaco-research/projects/1) and drag issues between columns
- **Via CLI:** Use the automation scripts above
- **Automated:** Set up GitHub Actions for automatic status changes

### Step 4: Development Workflow

#### A. Start Working on an Issue
```bash
# Manual approach
git checkout -b feature/issue-X-short-description

# Automated approach (using script above)
./start-feature.sh ISSUE_NUMBER
```

**Kanban Action:** Move issue from "Todo" to "In Progress" on the board.

#### B. Make Your Changes
```bash
# Make your code changes
# Follow the project structure:
# - /contracts/ - Smart contract code
# - /sdk/ - SDK implementation
# - /scripts/ - Utility scripts

# Commit your changes
git add .
git commit -m "feat: implement order matching algorithm

Addresses issue #4 by adding basic price-time priority matching logic.
- Add MatchingEngine contract
- Implement buy/sell order processing
- Add unit tests for matching scenarios"
```

### Step 5: Creating Pull Requests

#### A. Push Your Branch
```bash
git push origin feature/issue-X-short-description
```

#### B. Create Pull Request
```bash
# Create PR with auto-linking to issue
gh pr create --repo monaco-research/monaco-clob-dummy \
  --title "feat: implement order matching algorithm" \
  --body "Fixes #X

## Changes
- Added MatchingEngine contract
- Implemented price-time priority logic
- Added comprehensive unit tests

## Testing
- All existing tests pass
- New tests cover edge cases
- Manual testing completed"

# Alternative: Create PR via web interface
gh pr create --web

# Automated: Move issue to "In Review" status
./move-issue-status.sh ISSUE_NUMBER "In Review"
```

**Kanban Action:** Move issue from "In Progress" to "In Review" on the board.

#### C. PR Review Process
**What this does:**
- Notifies repository maintainers for review
- Runs automated CI/CD checks
- Allows for code review and discussion

**As a Contributor:**
- Respond to review comments
- Make requested changes
- Push updates to the same branch

### Step 6: Completion

#### After PR Approval and Merge:
```bash
# Automated: Move issue to "Done" status
./move-issue-status.sh ISSUE_NUMBER "Done"
```

#### Clean Up Local Branch:
```bash
git checkout main
git pull origin main
git branch -d feature/issue-X-short-description
```

## 🚀 Quick Reference Commands

### Create Issue + Add to Board (One Flow):
```bash
# 1. Create issue
ISSUE_URL=$(gh issue create --repo monaco-research/monaco-clob-dummy \
  --title "Your Title" \
  --body "Your description" \
  --assignee @me)

# 2. Extract issue number and add to board
ISSUE_NUM=$(echo $ISSUE_URL | grep -o '[0-9]*$')
gh project item-add 1 --owner monaco-research --url $ISSUE_URL

echo "✅ Created issue #$ISSUE_NUM and added to kanban board"
echo "🔗 Issue URL: $ISSUE_URL"
```

### Full Development Cycle:
```bash
# 1. Create and add issue to board (see above)
# 2. Create feature branch
git checkout -b feature/issue-X-description
# 3. Make changes and commit
git add . && git commit -m "feat: your changes"
# 4. Push and create PR
git push origin feature/issue-X-description
gh pr create --repo monaco-research/monaco-clob-dummy --web
```

### Get Project Information (for automation setup):
```bash
# Get project details
gh project list --owner monaco-research

# Get field information
gh project field-list 1 --owner monaco-research

# Get current items and their status
gh project item-list 1 --owner monaco-research --format json
```

## 📝 Issue Templates

### Feature Request:
```markdown
**Title:** Add [Feature Name]

**Description:**
Brief description of the feature and its purpose.

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Tests added
- [ ] Documentation updated
```

### Bug Report:
```markdown
**Title:** Fix [Bug Description]

**Bug Description:**
Clear description of the issue.

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Expected vs Actual behavior

**Acceptance Criteria:**
- [ ] Bug is fixed
- [ ] Regression tests added
```

## 🔄 Board Automation

The kanban board can be configured for automatic workflows:
- **Auto-add Issues:** New issues automatically appear in "Todo"
- **Auto-move on PR:** Issues move to "In Review" when PR is created
- **Auto-close:** Issues move to "Done" when PR is merged

## 🆘 Troubleshooting

### Common Issues:

**"Authentication token missing scopes"**
```bash
gh auth refresh -s project
```

**"Project not found"**
```bash
# Verify project exists
gh project list --owner monaco-research
```

**"Permission denied"**
- Ensure you have write access to the repository
- Verify you're a member of the Monaco-Research organization

**"Field ID not found"**
```bash
# Get current field IDs
gh project field-list 1 --owner monaco-research
```

## 📞 Getting Help

- **Repository Issues:** https://github.com/Monaco-Research/monaco-clob-dummy/issues
- **Project Board:** https://github.com/orgs/monaco-research/projects/1
- **GitHub CLI Docs:** https://cli.github.com/manual/

---

**Happy Contributing! 🚀** 