import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

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
        return localStorage.getItem("theme") === "dark";
    });

    /*Apply theme */
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
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
