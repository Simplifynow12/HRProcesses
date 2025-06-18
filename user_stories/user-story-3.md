# User Story: Formal Recruitment Processes
As an HR manager, I want a documented recruitment process so that I can ensure consistent and fair hiring across all departments.

# Acceptance Criteria (BDD Format)
## Scenario 1 – View Standard Recruitment Workflow
Given I am logged in as an HR manager
When I navigate to the “Recruitment Process” section of the HR system
Then I should see a documented step-by-step recruitment workflow
And it should include stages such as job requisition, posting, shortlisting, interviewing, background checks, selection, offer, onboarding

## Scenario 2 – Conduct Background and Verification Checks
Given a user is at the “Verification” stage of recruitment
When I initiate checks
Then I should be able to request and upload documents for:
- DBS/background check
- Employment references
- Home address verification And I should be able to mark each check as “Passed”, “Pending”, or “Failed”

## Scenario 3 – Upload Evidence of Checks
Given I have completed a candidate’s checks
When I upload evidence to their recruitment profile
Then the uploaded documents should be stored securely under their candidate record
And the system should timestamp each upload and indicate who uploaded it

## Scenario 4 – Access and Manage Standby Staff Pool
Given I am managing potential staff shortages
When I access the “Standby Staff Pool” section
Then I should be able to view a list of pre-screened candidates available for immediate recruitment
And I should see key information like availability, role, and readiness status

## Scenario 5 – Store and Use Signature Templates
Given I am at the onboarding stage of recruitment
When I generate onboarding documents
Then I should be able to select from pre-uploaded signature templates
And the system should include standard documents like company handbook, background check form, and trial period form
And candidates should be able to e-sign and return them within the system
