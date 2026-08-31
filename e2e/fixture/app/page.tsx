// NOTE: no "use client" here, deliberately. This page is a Server Component
// that imports the package -- if `LeadGenForm` shipped without its own
// "use client" directive, `next build` would fail right here, a defect no
// unit test can see.
import LeadGenForm from "@silverassist/leadgen-app";

export default function Page() {
  return (
    <main>
      <h1>leadgen-app fixture</h1>
      <LeadGenForm formId="test-form-id" />
    </main>
  );
}
