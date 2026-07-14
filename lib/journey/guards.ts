"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJourney } from "./JourneyProvider";

// Each guard redirects back to the start if a prerequisite step is missing -
// e.g. someone hits /proposal directly with no quote yet. The `hydrated`
// check is essential: without it, a page refresh would false-trigger a
// redirect in the instant before sessionStorage is read back in.

export function useRequireQuote() {
  const { state, hydrated } = useJourney();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && !state.quote) router.replace("/");
  }, [hydrated, state.quote, router]);
  return state.quote;
}

export function useRequirePlan() {
  const { state, hydrated } = useJourney();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && (!state.quote || !state.plan)) router.replace("/");
  }, [hydrated, state.quote, state.plan, router]);
  return state.plan;
}

export function useRequireProposal() {
  const { state, hydrated } = useJourney();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && (!state.quote || !state.plan || !state.proposal)) {
      router.replace("/");
    }
  }, [hydrated, state.quote, state.plan, state.proposal, router]);
  return state.proposal;
}

export function useRequirePolicy() {
  const { state, hydrated } = useJourney();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && (!state.proposal || !state.policy)) router.replace("/");
  }, [hydrated, state.proposal, state.policy, router]);
  return state.policy;
}
