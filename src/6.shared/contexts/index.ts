import { PageSizes } from "@shared/enums";
import { createContext, useContext } from "react";

const pageSizeContext = createContext(PageSizes.ExtraSmall)
const PageSizeProvider = pageSizeContext.Provider
const usePageSize = () => useContext(pageSizeContext)

export { pageSizeContext, PageSizeProvider, usePageSize }
