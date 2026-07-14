"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  EMPTY_JOURNEY_STATE,
  JourneyStateSchema,
  type JourneyState,
  type QuoteInput,
  type PlanSelection,
  type Proposal,
  type Policy,
} from "./schema";
import {
  readStoredJourney,
  writeStoredJourney,
  clearStoredJourney,
} from "./storage";

type Action =
  | { type: "HYDRATE"; state: JourneyState }
  | { type: "SET_QUOTE"; quote: QuoteInput }
  | { type: "SET_PLAN"; plan: PlanSelection }
  | { type: "SET_PROPOSAL"; proposal: Proposal }
  | { type: "SET_POLICY"; policy: Policy }
  | { type: "RESET" };

function reducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "SET_QUOTE":
      // A changed quote invalidates everything downstream.
      return { quote: action.quote, plan: null, proposal: null, policy: null };
    case "SET_PLAN":
      return { ...state, plan: action.plan, policy: null };
    case "SET_PROPOSAL":
      return { ...state, proposal: action.proposal };
    case "SET_POLICY":
      return { ...state, policy: action.policy };
    case "RESET":
      return EMPTY_JOURNEY_STATE;
  }
}

type JourneyContextValue = {
  state: JourneyState;
  hydrated: boolean;
  setQuote: (quote: QuoteInput) => void;
  setPlan: (plan: PlanSelection) => void;
  setProposal: (proposal: Proposal) => void;
  setPolicy: (policy: Policy) => void;
  reset: () => void;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, EMPTY_JOURNEY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = readStoredJourney();
    if (raw) {
      try {
        dispatch({
          type: "HYDRATE",
          state: JourneyStateSchema.parse(JSON.parse(raw)),
        });
      } catch {
        clearStoredJourney();
      }
    }
    // One-time hydration from sessionStorage, which isn't available
    // during SSR - not derived-from-props state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredJourney(JSON.stringify(state));
  }, [state, hydrated]);

  const value: JourneyContextValue = {
    state,
    hydrated,
    setQuote: (quote) => dispatch({ type: "SET_QUOTE", quote }),
    setPlan: (plan) => dispatch({ type: "SET_PLAN", plan }),
    setProposal: (proposal) => dispatch({ type: "SET_PROPOSAL", proposal }),
    setPolicy: (policy) => dispatch({ type: "SET_POLICY", policy }),
    reset: () => {
      dispatch({ type: "RESET" });
      clearStoredJourney();
    },
  };

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within a JourneyProvider");
  return ctx;
}
