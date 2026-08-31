# @silverassist/leadgen-app

LeadGen App form embed integration for Next.js apps. Deferred-loading
`<LeadGenForm />` component built on `@silverassist/next-script-loader`.

## Status

Extracted from the fleet's near-identical hand-rolled implementations (part
of the fleet-wide third-party-integration package effort described in
`nextjs-boilerplate/docs/NEXTJS_CORE_PACKAGE_PLAN.md`). Not yet published.
Unlike the site implementations this was ported from, this package does
**not** bundle style isolation — see [Style isolation](#style-isolation)
below for why and how to pair it with a site's own isolator.

## Install

```bash
npm install @silverassist/leadgen-app
```

## Usage

```tsx
import LeadGenForm from "@silverassist/leadgen-app";

export function ContactSection() {
  return <LeadGenForm formId="abc123-def456" className="my-4" />;
}
```

The script loads only after the first user interaction (focus, mousemove,
scroll, touchstart) — a performance optimization, not a correctness
requirement.

### Props

| Prop          | Type     | Default                             | Description                                               |
| ------------- | -------- | ----------------------------------- | --------------------------------------------------------- |
| `formId`      | `string` | —                                   | Required. LeadGen form ID from LeadGenApp.io.             |
| `className`   | `string` | —                                   | CSS classes applied to the form container.                |
| `containerId` | `string` | `` `leadgen-form-wrap-${formId}` `` | Id of the wrapping container — see Style isolation below. |

## Style isolation

The site implementations this was extracted from each paired their LeadGen
embed with a project-local `StyleIsolator` component that scopes LeadGen's
injected CSS (Vuetify-based) to the form's container, preventing it from
leaking into the rest of the page. That isolator does real, site-tuned work
— detection patterns, cascade-layer wrapping — that's specific to each
site's own CSS setup, so it stays in each site rather than becoming a
bundled dependency of this package (per the fleet's third-party-package
design: a vendor integration wires up the vendor, it doesn't own style
corrections).

Pass `containerId` so your own isolator can target the same element:

```tsx
import StyleIsolator from "@/components/third-party/style-isolator";
import LeadGenForm from "@silverassist/leadgen-app";

export function ContactSection({ formId }: { formId: string }) {
  const containerId = `leadgen-form-wrap-${formId}`;

  return (
    <>
      <StyleIsolator containerId={containerId} />
      <LeadGenForm formId={formId} containerId={containerId} />
    </>
  );
}
```

If your site has no style-conflict problem, omit `containerId` — it
defaults to the same `leadgen-form-wrap-${formId}` shape and the form works
standalone.

## License

[PolyForm Noncommercial 1.0.0](./LICENSE)

---

Made with ❤️ by Silver Assist
