describe("gatsby-source-storyblok", () => {
  it("Is loaded by default", () => {
    cy.visit("http://localhost:8000/");

    cy.get('[data-test="grid"]').should("exist");
    cy.get('[data-test="teaser"]').should("exist");
    cy.get('[data-test="feature"]').should("have.length", 2);
  });
});
