Feature: Parts deletion

  Background:
    Given the editor page is opened
      And I add a part

  Scenario: I want to delete this part
     When I click on the remove button of the added part
     Then the Confirm part deletion dialog should be visible

  Scenario: I want to delete this part and change my mind
     When I click on the remove button of the added part
      And I click on Cancel in the remove part dialog
     Then the Confirm part deletion dialog should not be visible
      And the part should exist

  Scenario: I want to delete this part and I confirm
     When I click on the remove button of the added part
      And I click on Confirm in the remove part dialog
     Then the Confirm part deletion dialog should not be visible
      And the part should not exist