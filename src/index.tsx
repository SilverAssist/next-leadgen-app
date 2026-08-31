/**
 * @packageDocumentation
 * LeadGen App form embed integration for Next.js — a deferred-loading
 * `LeadGenForm` component built on `@silverassist/next-script-loader`.
 */

"use client";

import { ScriptLoader } from "@silverassist/next-script-loader";
import { useEffect, useMemo, useRef, useState } from "react";

const LEADGEN_SCRIPT_BASE_URL = "https://forms.leadgenapp.io/js/lf.min.js";

/**
 * Module-level singleton: every `LeadGenForm` instance on the page shares
 * one loader, keyed by `formId` as the variant — switching to a different
 * form tears down the previous one's script the same way `ScriptLoader`
 * does for any other variant change. Exported so tests (and advanced
 * consumers) can call `.reset()` directly.
 */
export const leadGenFormLoader = new ScriptLoader();

export interface LeadGenFormProps {
  /** LeadGen form ID from LeadGenApp.io. */
  formId: string;

  /** Optional CSS classes to apply to the form container. */
  className?: string;

  /**
   * Id of the container element wrapping the embed markup. This package
   * doesn't bundle style isolation itself — if your site needs to scope
   * LeadGen's injected CSS (e.g. against a Vuetify conflict), pass this same
   * id to your own style-isolator component alongside `<LeadGenForm />`.
   *
   * @defaultValue `leadgen-form-wrap-${formId}`
   */
  containerId?: string;
}

/**
 * LeadGenForm — renders a LeadGen App embed, loading its script only after
 * the first user interaction (focus, mousemove, scroll, touchstart) via
 * `@silverassist/next-script-loader`.
 *
 * @example
 * ```tsx
 * <LeadGenForm formId="abc123-def456" className="my-4" />
 * ```
 *
 * @example Pairing with a site's own style isolator
 * ```tsx
 * <StyleIsolator containerId="leadgen-form-wrap-abc123" />
 * <LeadGenForm formId="abc123" containerId="leadgen-form-wrap-abc123" />
 * ```
 */
export default function LeadGenForm({ formId, className, containerId }: LeadGenFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const loadedByThisInstanceRef = useRef(false);

  const resolvedContainerId = containerId ?? `leadgen-form-wrap-${formId}`;

  const formMarkup = useMemo(
    () => ({
      __html: `<div id="${resolvedContainerId}" class="block border-0 w-full max-w-full my-auto mx-0 p-0 ${className ? className : ""}"><leadgen-form-${formId}></leadgen-form-${formId}></div>`,
    }),
    [formId, className, resolvedContainerId],
  );

  useEffect(() => {
    setIsLoading(true);
    loadedByThisInstanceRef.current = false;

    leadGenFormLoader.configure({
      urls: { [formId]: `${LEADGEN_SCRIPT_BASE_URL}/${formId}` },
    });

    const events = ["focus", "mousemove", "scroll", "touchstart"] as const;
    const loadOnce = () => {
      leadGenFormLoader
        .load(formId)
        .then(() => {
          loadedByThisInstanceRef.current = true;
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
      events.forEach((event) => document.removeEventListener(event, loadOnce));
    };

    events.forEach((event) => {
      document.addEventListener(event, loadOnce, { once: true });
    });

    return () => {
      events.forEach((event) => document.removeEventListener(event, loadOnce));
      if (loadedByThisInstanceRef.current) {
        leadGenFormLoader.unload();
      }
    };
  }, [formId]);

  if (!formId) return null;

  return isLoading ? (
    <div className="min-h-[530px] max-w-lg md:min-h-[360px]" />
  ) : (
    <div dangerouslySetInnerHTML={formMarkup} />
  );
}
