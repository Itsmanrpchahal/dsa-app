import { Text, theme } from "../../ui";
import { YStack } from "../../ui/stack";

export interface AppMetricsProps {
    appVisits: number | string;
}

export default function AppMetrics({ appVisits }: AppMetricsProps) {
    return (
        <YStack
            justifyContent={"center"}
            alignItems={"center"}
            width={theme.dimensions.fullWidth * 0.9}
            gap={2}
        >
            <Text variant="heading_large" color={"content_1"}>
                {appVisits}
            </Text>
            <Text variant="body_small" color={"content_1"} opacity={0.5}>
                visits
            </Text>
        </YStack>
    );
}
