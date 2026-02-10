import { createContext, useContext } from "react";

type SpacePortalSearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  clearQuery: () => void;
};

const SpacePortalSearchContext =
  createContext<SpacePortalSearchContextValue | undefined>(undefined);

export const SpacePortalSearchProvider = SpacePortalSearchContext.Provider;

export const useSpacePortalSearch = () => {
  const context = useContext(SpacePortalSearchContext);

  if (!context) {
    throw new Error(
      "useSpacePortalSearch must be used within SpacePortalSearchProvider"
    );
  }

  return context;
};
