/// <reference types="cypress" />

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import SurveyContainer from "../../src/components/survey/SurveyContainer";
import { QUESTIONS } from "../../src/data/surveyOptions";

describe("SurveyContainer Component", () => {
  it("renders survey with first question", () => {
    mount(
      <MemoryRouter>
        <SurveyContainer />
      </MemoryRouter>
    );

    cy.contains(QUESTIONS[0].text).should("exist");

    // Select element should be visible
    cy.get("select").first().should("be.visible");
  });

  it("allows answering a question and moving to next", () => {
    mount(
      <MemoryRouter>
        <SurveyContainer />
      </MemoryRouter>
    );

    // Select first option
    cy.get("select").first().select(1, { force: true });
    cy.contains(/next/i).click();

    // Should either show next question or a Submit button
    cy.get("h2").should("be.visible");
    cy.get("body").then(($body) => {
      if ($body.find("button:contains('Submit')").length) {
        cy.contains("Submit").should("exist");
      } else {
        cy.contains(/next/i).should("exist");
      }
    });
  });
});
