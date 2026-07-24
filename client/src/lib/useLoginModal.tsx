import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoginModalContextType {
    isOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
}

const LoginModalContext = createContext<LoginModalContextType>({
    isOpen: false,
    openLogin: () => {},
    closeLogin: () => {},
});

export const useLoginModal = () => useContext(LoginModalContext);

export const LoginModalProvider = ({
    children,
    modal,
}: {
    children: ReactNode;
    modal: (isOpen: boolean, onClose: () => void) => ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const openLogin = () => setIsOpen(true);
    const closeLogin = () => setIsOpen(false);

    return (
        <LoginModalContext.Provider value={{ isOpen, openLogin, closeLogin }}>
            {children}
            {modal(isOpen, closeLogin)}
        </LoginModalContext.Provider>
    );
};
