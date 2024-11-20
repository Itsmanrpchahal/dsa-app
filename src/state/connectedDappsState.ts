import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { log } from "../config/logger";

export type ConnectedDapp = {
    dappHostUrl: string;
    connected: boolean;
    chainId: string;
};

interface ConnectedDappsState {
    connectedDapps: ConnectedDapp[];
    setConnectedDapps: (connectedDapps: ConnectedDapp[]) => void;
    updateDappConnection: (
        dappHostUrl: string,
        connected: boolean,
        chainId: string
    ) => void;
    updateDappChainId: (dappHostUrl: string, chainId: string) => void;
    removeDappConnection: (dappHostUrl: string) => void;
    clearState: () => void;
}

export const useConnectedDappsState = create<ConnectedDappsState>()(
    devtools(
        persist(
            (set) => ({
                connectedDapps: [],
                setConnectedDapps: (connectedDapps: ConnectedDapp[]) =>
                    set({ connectedDapps }),
                updateDappConnection: (
                    dappHostUrl: string,
                    connected: boolean,
                    chainId: string
                ) => {
                    set((state) => {
                        let exists = false;
                        log.debug(
                            "Updating dapp connection:",
                            dappHostUrl,
                            connected,
                            chainId
                        );
                        const newConnectedDapps = state.connectedDapps.map(
                            (dapp) => {
                                if (dapp.dappHostUrl === dappHostUrl) {
                                    log.debug(
                                        "Updating dapp connection, host is not new:",
                                        dapp.dappHostUrl,
                                        dappHostUrl,
                                        connected,
                                        chainId
                                    );
                                    exists = true;
                                    return {
                                        dappHostUrl: dappHostUrl,
                                        connected: connected,
                                        chainId: chainId,
                                    };
                                }
                                return dapp;
                            }
                        );
                        if (!exists) {
                            log.debug(
                                "Updating dapp connection, host is new:",
                                dappHostUrl,
                                connected,
                                chainId
                            );
                            newConnectedDapps.push({
                                dappHostUrl: dappHostUrl,
                                connected: connected,
                                chainId: chainId,
                            });
                        }
                        return { connectedDapps: newConnectedDapps };
                    });
                },
                updateDappChainId: (dappHostUrl: string, chainId: string) => {
                    set((state) => {
                        log.debug(
                            "Updating dapp chain ID:",
                            dappHostUrl,
                            chainId
                        );

                        const existingDapp = state.connectedDapps.find(
                            (connectedDapp) =>
                                connectedDapp.dappHostUrl === dappHostUrl
                        );

                        if (existingDapp) {
                            log.debug(
                                "Updating dapp chain ID, host is not new:",
                                existingDapp.dappHostUrl,
                                dappHostUrl,
                                chainId
                            );
                            const updatedDapp = {
                                ...existingDapp,
                                chainId: chainId,
                            };

                            const newConnectedDapps = state.connectedDapps.map(
                                (connectedDapp) =>
                                    connectedDapp.dappHostUrl === dappHostUrl
                                        ? updatedDapp
                                        : connectedDapp
                            );

                            return { connectedDapps: newConnectedDapps };
                        } else {
                            log.debug(
                                "Updating dapp chain ID, host is new:",
                                dappHostUrl,
                                chainId
                            );

                            const newConnectedDapp = {
                                dappHostUrl: dappHostUrl,
                                connected: false,
                                chainId: chainId,
                            };

                            const newConnectedDapps = [
                                ...state.connectedDapps,
                                newConnectedDapp,
                            ];

                            return { connectedDapps: newConnectedDapps };
                        }
                    });
                },
                removeDappConnection: (dappHostUrl: string) => {
                    set((state) => {
                        log.debug("Removing dapp connection:", dappHostUrl);
                        const newConnectedDapps = state.connectedDapps.filter(
                            (dapp) => dapp.dappHostUrl !== dappHostUrl
                        );
                        return { connectedDapps: newConnectedDapps };
                    });
                },
                clearState: () => set({ connectedDapps: [] }),
            }),
            {
                name: "connected-dapps",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
