# User Story: Document all Standard Operating Procedures
As an operations lead, I want all SOPs documented so that tasks can be performed consistently even when someone is absent.

# Acceptance Criteria (BDD Format)
## Scenario 1: SOP can be created for a specific task
Given a user with the appropriate permissions is logged into the HR system
When the user navigates to the "SOP Management" section and selects "Create SOP"
And fills in the required fields including title, department, task description, and step-by-step instructions
Then the SOP should be saved
And it should be associated with the relevant task and department

## Scenario 2: SOPs are visible to authorized team members
Given an SOP has been created and published
When a team member with access rights searches for or navigates to the relevant task or department
Then the associated SOP should be displayed clearly
And be available for viewing and downloading

## Scenario 3: SOP version control and updates
Given an existing SOP needs updating
When an authorized user edits the SOP and saves the changes
Then a new version should be created
And the system should log the date, editor, and version number

## Scenario 4: SOP access during employee absence
Given a team member is absent
When another employee attempts to perform the absent member’s tasks
Then they should be able to access the relevant SOP from the HR system
And follow the documented steps to complete the task consistently

## Scenario 5: Notifications for incomplete or missing SOPs
Given a new task or department is added to the system
When no SOP has been created for it
Then the system should notify the operations lead to create and assign an SOP
