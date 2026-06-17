import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { safeStorageGet, safeStorageSet } from "@/utils/browserStorage";

/*Context type */
interface DarkModeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

/*Create context */
const DarkModeContext = createContext<DarkModeContextType | undefined>(
    undefined
);

/*Provider props type */
interface DarkModeProviderProps {
    children: ReactNode;
}

/*Provider */
export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
    children,
}) => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return safeStorageGet("local", "theme") === "dark";
    });

    /*Apply theme */
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            safeStorageSet("local", "theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            safeStorageSet("local", "theme", "light");
        }
    }, [darkMode]);

    /*Toggle function */
    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

/*Custom hook */
export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);

    if (!context) {
        throw new Error("useDarkMode must be used within DarkModeProvider");
    }

    return context;
};
