/// <reference types="cypress" />

import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mount } from "@cypress/react18";
import Dashboard from "../../src/pages/Dashboard";

describe("Dashboard Component", () => {
  beforeEach(() => {
    // fake login token
    localStorage.setItem("token", "fake-token");

    // stub backend
    cy.intercept("GET", "**/me/dashboard", {
      statusCode: 200,
      body: {
        user: { id: 1, username: "test_user", chosenAlignment: "lab" },
        badges: [],
      },
    }).as("getDashboard");
  });

  it("renders the profile section", () => {
    mount(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    cy.wait("@getDashboard");

    cy.contains(/Your Profile/i).should("exist");
    cy.contains("test_user").should("exist");
  });

  it("shows the alignment party", () => {
    mount(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    cy.wait("@getDashboard");

    // check PartyCard title
    cy.contains(/Your Alignment/i).should("exist");

    // check party name separately
    cy.contains("Labour").should("exist");
  });

  it("shows available actions", () => {
    mount(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    cy.wait("@getDashboard");

    cy.contains(/Retake Survey/i).should("exist");
    cy.contains(/Edit Profile/i).should("exist");
  });
});
