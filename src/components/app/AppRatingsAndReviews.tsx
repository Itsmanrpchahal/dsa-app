import { Text, theme } from "../../ui";
import { XStack, YStack, ZStack } from "../../ui/stack";
import { Divider } from "../../ui/divider";

export interface AppRatingsAndReviewsProps {
    appRating: number | string;
    appVisits: number | string;
}

export default function AppRatingsAndReviews({
    appRating,
    appVisits,
}: AppRatingsAndReviewsProps) {
    return (
        <XStack
            justifyContent={"center"}
            alignItems={"flex-start"}
            width={null}
            gap={50}
        >
            {appRating !== null && appRating !== 0 && (
                <YStack
                    justifyContent="center"
                    alignItems="center"
                    width={null}
                    gap={10}
                >
                    <Text
                        variant="heading_large"
                        color={"content_1"}
                        textAlign={"center"}
                        style={{
                            maxWidth: theme.dimensions.fullWidth * 0.9,
                        }}
                    >
                        {appRating}
                    </Text>
                    <Text
                        variant="body_small"
                        color={"content_1"}
                        textAlign={"center"}
                        style={{
                            maxWidth: theme.dimensions.fullWidth * 0.9,
                        }}
                    >
                        Rating
                    </Text>
                </YStack>
            )}
            {appRating !== null && appRating !== 0 && (
                <Divider
                    orientation="vertical"
                    color={theme.colors.content_primary}
                    thickness={1}
                    style={{ height: theme.spacing.$9 }}
                    opacity={0.6}
                ></Divider>
            )}
            <YStack
                justifyContent="center"
                alignItems="center"
                width={null}
                gap={10}
            >
                <Text
                    variant="heading_large"
                    color={"content_1"}
                    textAlign={"center"}
                    style={{
                        maxWidth: theme.dimensions.fullWidth * 0.9,
                    }}
                >
                    {appVisits}
                </Text>
                <Text
                    variant="body_small"
                    color={"content_1"}
                    textAlign={"center"}
                    style={{
                        maxWidth: theme.dimensions.fullWidth * 0.9,
                    }}
                >
                    Visits
                </Text>
            </YStack>
        </XStack>
    );
}
