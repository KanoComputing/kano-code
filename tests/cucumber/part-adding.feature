Feature: Adding parts

  Background:
    Given the editor page is opened

  Scenario: I want to access the dialog to add parts
     When I click on Add Parts
     Then the Add Parts Dialog should be visible

  Scenario: I want to close the add parts dialog
     When I click on Add Parts
      And I click on done in the Add Parts Dialog
     Then the Add Parts Dialog should not be visible

  Scenario: I want to a part to be added when I click on it
     When I click on Add Parts
      And I click on a part in the Add Parts Dialog
     Then the part should exist
