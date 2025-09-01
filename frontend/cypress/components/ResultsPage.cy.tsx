import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react";
import ResultsPage from "../../src/pages/ResultsPage";

describe("ResultsPage Component", () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
  });

  it("renders with survey answers from localStorage", () => {
    // Fake survey answers to control prediction outcome
    localStorage.setItem("surveyAnswers", JSON.stringify({ age_bracket: "18-24" }));

    mount(
      <MemoryRouter>
        <ResultsPage />
      </MemoryRouter>
    );

    cy.contains(/Predicted Party/i).should("exist");
    cy.contains(/Confidence:/i).should("exist");
  });

  it("navigates when buttons clicked", () => {
    localStorage.setItem("surveyAnswers", JSON.stringify({ age_bracket: "18-24" }));

    mount(
      <MemoryRouter>
        <ResultsPage />
      </MemoryRouter>
    );

    cy.contains("Retake Survey").click();
    cy.contains("View Dashboard").should("exist"); 
  });
});
