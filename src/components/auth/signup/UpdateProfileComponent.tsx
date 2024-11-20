import * as Burnt from "burnt";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { updateUserDetails } from "../../../helpers/auth/api/updateUserDetails";
import { Text, theme } from "../../../ui";
import { TextButton } from "../../../ui/button";
import { YStack, ZStack } from "../../../ui/stack";
import TextInputField from "../../../ui/textInput/TextInput";

const styles = StyleSheet.create({
    parent: {
        flex: 1,
    },
    body: {
        height: theme.dimensions.fullHeight * 0.4,
    },
    button_loader_container: {
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    text_input_container: {
        width: theme.dimensions.fullWidth * 0.9,
        height: 60,
        justifyContent: "center",
        alignItems: "flex-start",
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: theme.spacing.$2,
        borderColor: theme.colors.base_1,
        backgroundColor: theme.colors.textInput_background,
    },
});

type UpdateProfileComponentProps = {
    handleProfileUpdated: () => void;
};

export default function UpdateProfileComponent({
    handleProfileUpdated,
}: UpdateProfileComponentProps) {
    const [name, setName] = useState<string>("");
    const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);

    const inputRef = useRef<TextInput>(null);

    const updateName = async (name: string) => {
        setUpdatingProfile(true);
        const updateNameResponse = await updateUserDetails(name);

        if (updateNameResponse.success) {
            handleProfileUpdated();
            setUpdatingProfile(false);
        } else {
            console.log("error updating name", updateNameResponse);
            Burnt.toast({
                title: "error, please try again",
                preset: "error",
            });
            setUpdatingProfile(false);
        }
    };

    const triggerConfirm = () => {
        const regex = /^[a-zA-Z ]+$/;
        if (name.length > 3 && regex.test(name)) {
            updateName(name);
        } else {
            Alert.alert(
                "Invalid name",
                "Name should only contain letters and spaces, and be at least 4 characters long",
                [
                    {
                        text: "OK",
                        onPress: () => console.log("OK Pressed"),
                    },
                ]
            );
        }
    };

    return (
        <YStack
            justifyContent={"space-between"}
            alignItems={"center"}
            width={null}
            style={styles.parent}
        >
            <YStack
                style={styles.body}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={null}
            >
                <Text variant="heading_small" color="light">
                    Name
                </Text>
                <TextInputField
                    ref={inputRef}
                    width={theme.dimensions.fullWidth * 0.9}
                    keyboardType={"default"}
                    value={name}
                    onChangeText={setName}
                    placeholder="what can we call you as?"
                    caretHidden={false}
                    autoCorrect={false}
                    autoFocus={true}
                    textContentType="name"
                />
                <ZStack
                    width={null}
                    height={null}
                    style={styles.button_loader_container}
                >
                    <TextButton
                        label="That's my name"
                        labelColor={theme.colors.dark}
                        buttonColor={theme.colors.color_green}
                        onPress={triggerConfirm}
                        trackingName="Update Name Button Clicked in Update Profile Screen"
                        disabled={!(name.length > 3) || updatingProfile}
                    />
                    {updatingProfile && (
                        <ActivityIndicator
                            size="small"
                            color={theme.colors.content_1}
                            style={{ position: "absolute" }}
                        />
                    )}
                </ZStack>
            </YStack>
        </YStack>
    );
}
