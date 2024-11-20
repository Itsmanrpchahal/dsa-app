import {
    DdSdkReactNative,
    DdSdkReactNativeConfiguration,
} from "@datadog/mobile-react-native";
import {
    DATADOG_CLIENT_TOKEN,
    DATADOG_ENVIRONMENT_NAME,
    DATADOG_RUM_APPLICATION_ID,
} from "@env";

// datadog setup
const config = new DdSdkReactNativeConfiguration(
    DATADOG_CLIENT_TOKEN,
    DATADOG_ENVIRONMENT_NAME,
    DATADOG_RUM_APPLICATION_ID,
    true, // track User interactions (e.g.: Tap on buttons).
    true, // track XHR Resources
    true // track Errors
);

config.site = "EU1";
config.nativeCrashReportEnabled = true;
config.sessionSamplingRate = 80;
config.trackFrustrations = true;

export const datadogClient = async () => {
    await DdSdkReactNative.initialize(config);
};
