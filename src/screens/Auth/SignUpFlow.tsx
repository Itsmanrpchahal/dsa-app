import { useEffect, useState } from "react";
import { ImageBackground, Platform, StyleSheet, View } from "react-native";
import { segmentClient } from "../../config/segmentClient";
import { useAuth0 } from "react-native-auth0";
import { useUserState } from "../../state/userState";
import { useAuthState } from "../../state";
import InviteAcceptComponent from "../../components/auth/signup/InviteAcceptComponent";
import UpdateProfileComponent from "../../components/auth/signup/UpdateProfileComponent";
import HandoffExplanation from "../../components/auth/signup/HandoffExplanation";
import { AuthHeader } from "../../components/headers/Header";
import { useSignUpStackNavigation } from "../../navigation/types";
import { images } from "../../config/constants/images";
import { PlainStackScreen } from "../../ui/screens";

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
});

export default function SignUpFlow() {
    const navigation = useSignUpStackNavigation();

    const { user } = useAuth0();
    const userDetails = useUserState().userDetails;
    const authState = useAuthState().authDetails;

    const [status, setStatus] = useState<
        "not-invited" | "invite-accepted" | "update-profile-success"
    >("not-invited");

    const handleInviteAccept = () => {
        setStatus("invite-accepted");
    };

    const handleProfileUpdated = () => {
        setStatus("update-profile-success");
    };

    return (
        <PlainStackScreen trackingName="SignUpFlow">
            <AuthHeader />
            <View style={styles.body}>
                {status == "not-invited" && (
                    <InviteAcceptComponent
                        handleInviteAccept={handleInviteAccept}
                    />
                )}

                {status == "invite-accepted" && (
                    <UpdateProfileComponent
                        handleProfileUpdated={handleProfileUpdated}
                    />
                )}

                {status == "update-profile-success" && <HandoffExplanation />}
            </View>
        </PlainStackScreen>
    );
}
