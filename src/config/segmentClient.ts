import { SEGMENT_API_KEY } from "@env";
import { createClient } from "@segment/analytics-react-native";

export const segmentClient = createClient({
    writeKey: !__DEV__ ? SEGMENT_API_KEY : "",
    // writeKey: SEGMENT_API_KEY,
    debug: false,
    proxy: "https://d3rsb7sardm8i2.cloudfront.net/v1/b",
});
