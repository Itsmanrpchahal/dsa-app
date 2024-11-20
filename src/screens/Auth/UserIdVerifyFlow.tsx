import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { v4 as uuidv4 } from "uuid";
import AuthFailureComponent from "../../components/auth/landing/AuthFailureComponent";
import CreatingAccountFailure from "../../components/auth/landing/CreatingAccountFailure";
import CreatingAccountSuccess from "../../components/auth/landing/CreatingAccountSuccess";
import VerifyEmailComponent from "../../components/auth/landing/VerifyEmailComponent";
import { AuthHeader } from "../../components/headers/Header";
import { log } from "../../config/logger";
import { directUserSignUp } from "../../helpers/auth";
import { useLandingStackNavigation } from "../../navigation/types";
import { PlainStackScreen } from "../../ui/screens";
import { useAuthState } from "../../state";

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
});

export default function UserIdVerifyFlow() {
    const navigation = useLandingStackNavigation();

    // const [status, setStatus] = useState<
    //     | "notStarted"
    //     | "auth-failure"
    //     | "creating-account"
    //     | "creating-account-success"
    //     | "creating-account-failure"
    // >("notStarted");

    const [uuid, setUuid] = useState<string | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [emailId, setEmailId] = useState<string | null>(null);

    const [newUserOrNot, setNewUserOrNot] = useState<boolean | null>(null);
    // Function to receive data from the child
    const handleChildData = (data: any) => {
        setUuid(uuidv4());
        setPublicKey(data.publicKey);
        setEmailId(data?.emailID ?? null);
    };

    useEffect(() => {
        if (uuid && publicKey && emailId) {
            const handleSigningUp = async () => {
                const signUpResponse = await directUserSignUp(
                    "not-invited",
                    uuid,
                    [],
                    emailId
                );
                if (signUpResponse.error === null) {
                    console.log("sign up success", signUpResponse);
                    setNewUserOrNot(signUpResponse.newUser);
                } else {
                    console.log("error signing up", signUpResponse.error);
                }
            };

            setTimeout(() => {
                // timeout so state updates happen on slower devices
                handleSigningUp();
            }, 1000);
        }
    }, [uuid, publicKey, emailId]);

    const handleAuth = async () => {
        log.debug("handle auth called");
        try {
            useAuthState.getState().setAuthDetails({
                name: "",
                loggedIn: false,
                onboardingState: newUserOrNot
                    ? "signUpProcess"
                    : "signInProcess",
            });
        } catch (e) {
            log.debug("auth0 error", e);
        }
    };

    useEffect(() => {
        if (__DEV__) {
            setUuid(uuidv4());
            setPublicKey("devpublicKey");
            setEmailId(
                Platform.OS === "ios"
                    ? "dev-ios@email.com"
                    : "dev-android@email.com"
            );
        }
    }, []);

    useEffect(() => {
        newUserOrNot !== null ? handleAuth() : null;
    }, [newUserOrNot]);

    return (
        <PlainStackScreen trackingName="UserIdVerifyFlow">
            <AuthHeader navigationStack={navigation} />
            <VerifyEmailComponent onDataReceived={handleChildData} />
        </PlainStackScreen>
    );
}
