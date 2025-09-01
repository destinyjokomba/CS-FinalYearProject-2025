/// <reference types="cypress" />

describe("Landing Page Flow", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.removeItem("token");
      },
    });
  });

  it("shows main landing page elements", () => {
    // Should show heading + CTA buttons/links
    cy.contains("Welcome").should("exist");
    cy.contains(/Survey/i).should("exist");  // matches "Start Survey"
    cy.contains(/Login/i).should("exist");
    cy.contains(/Register/i).should("exist");
  });

  it("navigates to Login from Landing Page", () => {
    cy.contains(/Login/i).click();
    cy.url().should("include", "/login");
  });

  it("navigates to Register from Landing Page", () => {
    cy.contains(/Register/i).click();
    cy.url().should("include", "/register");
  });

  it("navigates to Survey from Landing Page (with token)", () => {
    // Pretend user is logged in
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "fake-token");
      },
    });

    cy.contains(/Survey/i).click();
    cy.url().should("include", "/survey");
  });

  it("redirects to Login if not logged in and clicks Survey", () => {
    // Ensure no token
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.removeItem("token");
      },
    });

    cy.contains(/Survey/i).click();
    cy.url().should("include", "/login");
  });
});
