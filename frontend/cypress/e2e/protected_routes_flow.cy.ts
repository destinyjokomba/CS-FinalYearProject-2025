/// <reference types="cypress" />

describe("Protected Routes Flow", () => {
  it("redirects to login if visiting /dashboard without token", () => {
    cy.visit("/dashboard");
    cy.location("pathname").should("eq", "/login");

    // confirm login form is visible
    cy.get("form").within(() => {
      cy.get("input").should("exist");
    });
  });

  it("redirects to login if visiting /survey without token", () => {
    cy.visit("/survey");
    cy.location("pathname").should("eq", "/login");

    cy.get("form").within(() => {
      cy.get("input").should("exist");
    });
  });

  it("allows access to dashboard when token exists", () => {
    cy.visit("/dashboard", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "fake-token");
      },
    });

    cy.location("pathname").should("eq", "/dashboard");

    // check dashboard heading text
    cy.contains(/dashboard/i, { timeout: 10000 }).should("exist");
  });

  it("allows access to survey when token exists", () => {
    cy.visit("/survey", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "fake-token");
      },
    });

    cy.location("pathname").should("eq", "/survey");

    // confirm a visible button exists (don’t rely on “Submit” text)
    cy.get("button", { timeout: 10000 }).first().should("be.visible");
  });
});
