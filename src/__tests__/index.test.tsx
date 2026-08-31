import { act, render, waitFor } from "@testing-library/react";

import LeadGenForm, { leadGenFormLoader } from "../index";

describe("LeadGenForm", () => {
  afterEach(() => {
    leadGenFormLoader.reset();
    jest.restoreAllMocks();
  });

  it("returns null when formId is empty", () => {
    const { container } = render(<LeadGenForm formId="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a placeholder before the script loads", () => {
    const { container } = render(<LeadGenForm formId="abc123" />);
    expect(container.querySelector("div")).toBeInTheDocument();
    expect(container.querySelector("leadgen-form-abc123")).toBeNull();
  });

  it("loads the script and renders the embed markup after interaction", async () => {
    render(<LeadGenForm formId="abc123" />);

    act(() => {
      document.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => {
      expect(document.querySelector("script[src*='forms.leadgenapp.io']")).toBeInTheDocument();
    });
  });

  // jsdom never fires a script element's onload for an external src (its
  // resource loader is disabled by default), so `.load()`'s promise never
  // settles and `isLoading` never flips -- these two stub the loader itself
  // to isolate the containerId/markup logic from real script-loading, which
  // belongs to the e2e suite against a real browser.
  it("scopes the embed container id to the formId by default", async () => {
    jest.spyOn(leadGenFormLoader, "load").mockResolvedValue(undefined);
    const { container } = render(<LeadGenForm formId="xyz789" />);

    act(() => {
      document.dispatchEvent(new Event("focus"));
    });

    await waitFor(() => {
      expect(container.innerHTML).toContain("leadgen-form-wrap-xyz789");
    });
  });

  it("honors a caller-supplied containerId", async () => {
    jest.spyOn(leadGenFormLoader, "load").mockResolvedValue(undefined);
    const { container } = render(<LeadGenForm formId="xyz789" containerId="custom-wrap" />);

    act(() => {
      document.dispatchEvent(new Event("focus"));
    });

    await waitFor(() => {
      expect(container.innerHTML).toContain("custom-wrap");
    });
  });
});
