/// <reference types="cypress" />

describe("Survey → Results → Dashboard → History Flow", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/predict*", {
      statusCode: 200,
      body: { party: "lab", confidence: 72 },
    }).as("predictRequest");

    cy.intercept("GET", "**/me/dashboard*", {
      statusCode: 200,
      body: {
        user: { id: 1, username: "destiny_user", chosenAlignment: "lab" },
        badges: [],
      },
    }).as("dashboardRequest");
  });

  it("completes survey, sees results, goes to dashboard, and verifies history", () => {
    cy.visit("/survey", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "fake-token");
      },
    });

    // Answer every question until Submit appears
    cy.log("Answering all survey questions");

    const answerLoop = () => {
      cy.get("select").first().select(1, { force: true });

      cy.get("button").then(($btns) => {
        if ($btns.text().includes("Next")) {
          cy.contains("Next").click();
          answerLoop(); // recurse until no "Next"
        }
      });
    };

    answerLoop();

    // Click Submit when it appears
    cy.contains("Submit", { timeout: 10000 }).click();

    // Wait for prediction API
    cy.wait("@predictRequest");

    // --- Results Page ---
    cy.url().should("include", "/results");
    cy.get("h1").should("contain.text", "Predicted Party:");
    cy.contains("Confidence:").should("exist");

    // --- Dashboard ---
    cy.contains("View Dashboard").click();
    cy.wait("@dashboardRequest");
    cy.url().should("include", "/dashboard");
    cy.contains("Your Alignment").should("exist");

    // --- History ---
    cy.visit("/history");
    cy.get("h1").should("contain.text", "Prediction History");

    // make sure at least one prediction row exists
    cy.get(".space-y-6").children().its("length").should("be.greaterThan", 0);

    // confirm timestamp looks like a date
    cy.get(".space-y-6 span")
      .last()
      .invoke("text")
      .should("match", /\d{1,2}\/\d{1,2}\/\d{2,4}/);
  });
});
