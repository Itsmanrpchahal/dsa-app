import { Image } from "expo-image";
import { Text, theme } from "../../../../ui";
import { XStack } from "../../../../ui/stack";
import { images } from "../../../../config/constants/images";

interface SearchResultComponentProps {
    isURL?: boolean;
    search: string;
}

export default function SearchResultComponent({
    isURL,
    search,
}: SearchResultComponentProps) {
    return (
        <XStack
            alignItems="flex-start"
            justifyContent={"flex-start"}
            width={theme.dimensions.fullWidth * 0.85}
            style={{ padding: theme.spacing.$2 }}
        >
            <Image
                source={
                    isURL
                        ? images.browserOutlineIcon
                        : images.googleIcon
                }
                style={{
                    width: theme.spacing.$6,
                    height: theme.spacing.$6,
                    borderRadius: theme.spacing.$3,
                }}
            />
            <Text
                variant="body_small"
                color={"light"}
                textAlign={"right"}
                style={{
                    marginTop: theme.spacing.$1,
                    paddingHorizontal: theme.spacing.$2,
                }}
            >
                {isURL ? `go to "${search}"` : `search for "${search ?? ""}"`}
            </Text>
        </XStack>
    );
}
