import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
} from "react-native";
import { YStack, ZStack } from "../../../ui/stack";
import { Text, TextButton, theme } from "../../../ui";
import Auth0 from "react-native-auth0";
import { jwtDecode } from "jwt-decode";
import { AUTH0_CLIENT_ID, AUTH0_CUSTOM_DOMAIN } from "@env";
import * as Burnt from "burnt";
import * as Haptics from "expo-haptics";
import { segmentClient } from "../../../config/segmentClient";
import { log } from "../../../config/logger";
import { Clickable } from "../../../ui/clickable";
import TextInputField from "../../../ui/textInput/TextInput";

const auth0 = new Auth0({
    domain: AUTH0_CUSTOM_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
});

const styles = StyleSheet.create({
    parent: {
        flex: 1,
    },
    body: {
        height: theme.dimensions.fullHeight * 0.4,
    },
    borderStyleBase: {
        width: 30,
        height: 45,
    },
    otpBody: {
        height: "90%",
        padding: 16,
        alignItems: "center",
    },
    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
    text_input_container: {
        width: theme.dimensions.fullWidth * 0.9,
        height: 60,
        marginTop: 8,
        marginBottom: 16,
        justifyContent: "center",
        paddingHorizontal: theme.spacing.$4,
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 9,
        borderColor: theme.colors.textInput_border,
        backgroundColor: theme.colors.textInput_background,
    },
    button_loader_container: {
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
        marginTop: theme.spacing.$3,
    },
    bodySmall: {
        opacity: 0.7,
        marginTop: theme.spacing.$4,
        textAlign: "center",
    },
});

const VerifyEmailComponent = ({ onDataReceived }: any) => {
    const [email, setEmail] = useState<string>("");
    const [btnText, setBtnText] = useState<string>("Get Code");
    const [otp, setOtp] = useState<string>("");
    const [emailTvShow, setEmailTvShow] = useState<boolean>(false);
    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [indicator, setIndicator] = useState<boolean>(false);

    function validateEmail(email: string) {
        var reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (reg.test(email) == false) {
            return false;
        }
        return true;
    }

    const sendDataToParent = (status: any) => {
        // Call the parent function and pass data
        onDataReceived(status);
    };

    const [time, setTime] = useState(0 * 60 + 30);
    const [resendTimeStart, setResendTimeStart] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    // Timer reached zero, you can handle this event as needed
                    clearInterval(intervalId);
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [resendTimeStart]);

    const sendVerificationOTP = () => {
        if (email === "test@dappstore.app") {
            segmentClient.track("Email OTP Requested");
            setBtnText("Confirm");
            setEmailTvShow(true);
            setIndicator(false);
        } else {
            // Trigger Auth0 passwordless authentication
            log.debug("Email:", email, "OTP:", otp);
            auth0.auth
                .passwordlessWithEmail({
                    email: email,
                    send: "code", // Specify the method (link or code)
                })
                .then((response) => {
                    segmentClient.track("Email OTP Requested");
                    setBtnText("Confirm");
                    setEmailTvShow(true);
                    log.debug("OTP sent successfully:", response);
                    setIndicator(false);
                    // Handle success (e.g., show a confirmation message to the user)
                })
                .catch((error) => {
                    log.error("Error sending otp:", error);
                    setIndicator(false);
                    // Handle error (e.g., display an error message)
                });
        }
    };

    useEffect(() => {
        setEmailValid(validateEmail(email));
    }, [email]);

    const handleVerifyCode = (code: string) => {
        setIndicator(true);
        if (email === "test@dappstore.app" && code === "7777") {
            setIndicator(false);
            segmentClient.track("Email OTP Verified");
            const data = {
                publicKey: "test",
                emailID: "test@dappstore.app",
                status: "creating-account",
            };
            sendDataToParent(data);
            return;
        } else {
            auth0.auth
                .loginWithEmail({
                    email: email,
                    code: code,
                    grantType:
                        "http://auth0.com/oauth/grant-type/passwordless/otp",
                })
                .then((response) => {
                    // Handle successful login
                    segmentClient.track("Email OTP Verified");
                    const details: any = jwtDecode(response.idToken);
                    log.debug("Login successful:", details);
                    const data = {
                        publicKey: response.idToken,
                        emailID: details?.name ?? null,
                        status: "creating-account",
                    };
                    sendDataToParent(data);
                })
                .catch((error) => {
                    log.error("Error verifying OTP:", error);
                    setIndicator(false);
                    // Handle verification failure
                    Burnt.toast({
                        title: "wrong OTP",
                        preset: "error",
                    });
                });
        }
    };

    const resendOTP = () => {
        segmentClient.track("Email OTP Resend Requested");
        auth0.auth
            .passwordlessWithEmail({
                email: email, // Replace with the user's email
                send: "code",
            })
            .then(() => {
                log.debug("RESEND OTP resent successfully");
            })
            .catch((error) => {
                log.error("RESEBD Error resending OTP:", error);
            });
    };

    const triggerEmailConfirm = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const regex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email.toLowerCase().match(regex)) {
            setIndicator(true);
            sendVerificationOTP();
            setTime(0 * 60 + 30);
            setResendTimeStart(true);
        } else {
            Burnt.toast({
                title: "Enter a valid email address",
                preset: "error",
            });
        }
    };

    const triggerOTP = (otp: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (otp.length === 4) {
            handleVerifyCode(otp);
        } else {
            Burnt.toast({
                title: "Enter a valid OTP",
                preset: "error",
            });
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
                {emailTvShow === false && (
                    <Text variant="heading_small" color="light">
                        Email
                    </Text>
                )}

                {emailTvShow === false ? (
                    <View style={{ alignItems: "center" }}>
                        <TextInputField
                            width={theme.dimensions.fullWidth * 0.9}
                            keyboardType={"email-address"}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            caretHidden={false}
                            autoFocus={true}
                        />
                    </View>
                ) : (
                    <View>
                        <Text
                            variant="heading_small"
                            color="light"
                            style={{ textAlign: "center" }}
                        >
                            Enter Code
                        </Text>
                        <Text
                            variant="body_small"
                            color="light"
                            style={styles.bodySmall}
                        >
                            {`Enter the 4 digit code sent to \n ${email}`}
                        </Text>
                    </View>
                )}

                {btnText === "Confirm" && (
                    <View style={{ alignItems: "center" }}>
                        <TextInputField
                            width={theme.dimensions.fullWidth * 0.6}
                            keyboardType={"numeric"}
                            value={otp}
                            onChangeText={setOtp}
                            placeholder=""
                            caretHidden={otp.length === 4 ? true : false}
                            autoFocus={true}
                            textAlign="center"
                            maxLength={4}
                            selection={2}
                            letterSpacing={20}
                        />
                    </View>
                )}
                <View style={{ alignItems: "center" }}>
                    <Text
                        variant="caption"
                        color="content_1"
                        style={{
                            opacity: 0.5,
                            textAlign: "center",
                            lineHeight: 20,
                            width: theme.dimensions.fullWidth * 0.8,
                        }}
                    >
                        By continuing, you agree to our{" "}
                        <Clickable
                            trackingName="Terms of Service Clicked At Email Verify"
                            onPress={() => {
                                Linking.openURL("http://dappstore.app/tos");
                            }}
                            containerStyle={{
                                height: Platform.OS === "android" ? 12 : "auto",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text variant="caption" color="color_green">
                                Terms of Service{" "}
                            </Text>
                        </Clickable>
                        and
                        <Clickable
                            trackingName="Privacy Policy Clicked At Email Verify"
                            containerStyle={{
                                height: Platform.OS === "android" ? 14 : "auto",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => {
                                Linking.openURL(
                                    "http://dappstore.app/privacy-policy"
                                );
                            }}
                        >
                            <Text variant="caption" color="color_green">
                                {" "}
                                Privacy Policy
                            </Text>
                        </Clickable>
                    </Text>
                    <ZStack
                        width={null}
                        height={null}
                        style={styles.button_loader_container}
                    >
                        {btnText === "Confirm" ? (
                            <TextButton
                                disabled={
                                    otp.length < 4 || indicator ? true : false
                                }
                                onPress={() => triggerOTP(otp)}
                                label={btnText}
                                buttonColor={theme.colors.color_green}
                                labelColor={theme.colors.dark}
                                trackingName="Email OTP Submit Clicked"
                            />
                        ) : (
                            <TextButton
                                disabled={
                                    email === "" || !emailValid || indicator
                                        ? true
                                        : false
                                }
                                onPress={() => triggerEmailConfirm()}
                                label={btnText}
                                buttonColor={theme.colors.color_green}
                                labelColor={theme.colors.dark}
                                trackingName="Email OTP Request Clicked"
                            />
                        )}

                        {indicator && (
                            <ActivityIndicator
                                size="small"
                                color={theme.colors.content_1}
                                style={{ position: "absolute" }}
                            />
                        )}
                    </ZStack>
                    {emailTvShow && (
                        <Clickable
                            trackingName="Resend OTP Clicked"
                            disabled={time > 0 ? true : false}
                            onPress={() => {
                                setTime(0 * 60 + 30);
                                setResendTimeStart(!resendTimeStart);
                                resendOTP();
                            }}
                        >
                            <Text
                                variant="body_small"
                                color="light"
                                style={[
                                    styles.bodySmall,
                                    {
                                        color:
                                            time === 0
                                                ? theme.colors.color_green
                                                : theme.colors.content_1,
                                        opacity: time === 0 ? 1 : 0.7,
                                        textDecorationLine:
                                            time === 0 ? "underline" : "none",
                                    },
                                ]}
                            >
                                {time > 0
                                    ? "Resend OTP in " + time + " seconds"
                                    : "Resend"}
                            </Text>
                        </Clickable>
                    )}
                </View>
            </YStack>
        </YStack>
    );
};

export default VerifyEmailComponent;
