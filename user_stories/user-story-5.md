# User Story: Manage Training Programs
As an operations lead, I want to manage the available training programs so that I can keep the training catalog up-to-date and relevant for employees.

# Acceptance Criteria (BDD Format)
## Scenario 1: View Training Program List
Given an operations lead is logged into the HR system
When they navigate to the "Training Management" section
Then they should see a list of all available training programs
And each program should display its title, description, duration, and category
And they should see options to edit or delete each program

## Scenario 2: Add New Training Program
Given an operations lead is in the Training Management section
When they click "Add New Training"
Then a form dialog should appear
And they should be able to enter:
  - Title
  - Description
  - Duration
  - Category (from predefined list)
And the form should validate that all fields are filled
And upon saving, the new program should appear in the list
And the program should be immediately available to employees

## Scenario 3: Edit Existing Training Program
Given an operations lead is viewing the training programs
When they click the edit icon on a program
Then a form dialog should appear with the program's current details
And they should be able to modify any of the fields
And upon saving, the changes should be reflected immediately
And any enrolled employees should still maintain their progress in the program

## Scenario 4: Delete Training Program
Given an operations lead is viewing the training programs
When they click the delete icon on a program
Then they should see a confirmation prompt
And if they confirm, the program should be removed from the list
And it should no longer be visible to employees
And enrolled employees' progress should be preserved if the program is later reinstated

## Scenario 5: Category Management
Given an operations lead is adding or editing a training program
When they select the category field
Then they should see a predefined list of categories including:
  - Technical
  - Soft Skills
  - Management
  - Professional Development
  - Industry Specific

## Scenario 6: Data Persistence During Session
Given an operations lead has made changes to training programs
When an employee logs in during the same session
Then they should see the updated list of training programs
And any previous enrollment or progress data should be preserved
And the changes should persist until the session ends 