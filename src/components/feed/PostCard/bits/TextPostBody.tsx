import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import Tooltip from "rn-tooltip";
import { Text, theme } from "../../../../ui";
import { YStack } from "../../../../ui/stack";
import PostTitle from "./PostTitle";

export interface TextPostBodyProps {
    summary: string | string[];
    glossary?: string[];
    bodyHeight: number;
    postData?: any;
}

export default function TextPostBody({
    summary,
    glossary,
    bodyHeight,
    postData,
}: TextPostBodyProps) {
    const parseAndStyleText = (text: string) => {
        const elements: (string | JSX.Element)[] = [];

        const segments = text
            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
            .filter((part) => part.length > 0);

        segments.forEach((segment, index) => {
            if (segment.startsWith("**") && segment.endsWith("**")) {
                // Italic text
                elements.push(
                    <Text
                        key={index}
                        variant={
                            Platform.OS === "android"
                                ? bodyHeight <= 500
                                    ? "body_small_italic"
                                    : "body_post_content_italic"
                                : bodyHeight <= 520
                                ? "body_small_italic"
                                : "body_post_content_italic"
                        }
                    >
                        {segment.replace(/\*/g, "")}
                    </Text>
                );
            } else if (segment.startsWith("*") && segment.endsWith("*")) {
                // Bold text
                elements.push(
                    <Text
                        key={index}
                        variant={
                            Platform.OS === "android"
                                ? bodyHeight <= 500
                                    ? "body_small_italic"
                                    : "body_post_content_italic"
                                : bodyHeight <= 520
                                ? "body_small_italic"
                                : "body_post_content_italic"
                        }
                    >
                        {segment.replace(/\*/g, "")}
                    </Text>
                );
            } else {
                // Regular text
                elements.push(segment.replace(/\*/g, ""));
            }
        });

        return elements;
    };

    const [summaryPoints, setSummaryPoints] = useState<string[]>([]);

    const [cleanedUpGlossary, setCleanedUpGlossary] = useState<
        { key: string; value: string }[]
    >([]);

    useEffect(() => {
        const parsedSummary = JSON.parse(summary as string);
        if (Array.isArray(parsedSummary)) {
            setSummaryPoints(parsedSummary);
        } else {
            setSummaryPoints([parsedSummary]);
        }

        if (Array.isArray(glossary)) {
            const glossaryList = glossary.map((item) => {
                const [key, value] = item.split(":");
                return { key: key.trim(), value: value.trim() };
            });
            setCleanedUpGlossary(glossaryList);
            console.log(glossaryList);
        }
    }, [glossary]);

    return (
        <YStack
            justifyContent={"center"}
            alignItems={"flex-start"}
            width={"100%"}
            gap={theme.spacing.$2}
            style={{
                maxWidth: "100%",
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                marginVertical: theme.spacing.$2,
            }}
        >
            <PostTitle
                external_url={postData?.values?.external_url ?? ""}
                title={postData?.values?.title ?? ""}
                postId={postData?.id}
                bodyHeight={bodyHeight}
            />
            {summaryPoints.map((text, index) => (
                <Text
                    key={index}
                    variant={
                        Platform.OS === "android"
                            ? bodyHeight <= 500
                                ? "body_small"
                                : "body_post_content"
                            : bodyHeight <= 520
                            ? "body_small"
                            : "body_post_content"
                    }
                    color="light"
                >
                    {parseAndStyleText(text).map((segment, segmentIndex) => {
                        const matchingGlossary = cleanedUpGlossary.find(
                            (item) =>
                                segment
                                    .toString()
                                    .toLowerCase()
                                    .includes(item.key.toLowerCase())
                        );

                        if (matchingGlossary) {
                            const parts = segment
                                .toString()
                                .toLowerCase()
                                .split(matchingGlossary.key.toLowerCase());
                            const elements: JSX.Element[] = [];

                            parts.forEach((part, index) => {
                                elements.push(
                                    <React.Fragment key={index}>
                                        {index > 0 && (
                                            // @ts-ignore
                                            <Tooltip
                                                backgroundColor={
                                                    theme.colors.base_1
                                                }
                                                overlayColor={
                                                    theme.colors.base_1 + "50"
                                                }
                                                width={
                                                    theme.dimensions.fullWidth *
                                                    0.75
                                                }
                                                height={"auto"}
                                                popover={
                                                    <Text
                                                        variant={
                                                            Platform.OS ===
                                                            "android"
                                                                ? bodyHeight <=
                                                                  500
                                                                    ? "body_small"
                                                                    : "body_post_content"
                                                                : bodyHeight <=
                                                                  520
                                                                ? "body_small"
                                                                : "body_post_content"
                                                        }
                                                        color="light"
                                                    >
                                                        {matchingGlossary.value}
                                                    </Text>
                                                }
                                                toggleWrapperProps={{
                                                    style: {
                                                        marginBottom: -3,
                                                    },
                                                }}
                                            >
                                                <Text
                                                    variant={
                                                        Platform.OS ===
                                                        "android"
                                                            ? bodyHeight <= 500
                                                                ? "body_small"
                                                                : "body_post_content"
                                                            : bodyHeight <= 520
                                                            ? "body_small"
                                                            : "body_post_content"
                                                    }
                                                    color="light"
                                                    style={{
                                                        textDecorationLine:
                                                            "underline",
                                                    }}
                                                >
                                                    {matchingGlossary.key}
                                                </Text>
                                            </Tooltip>
                                        )}
                                        {part}
                                    </React.Fragment>
                                );
                            });

                            return (
                                <Text
                                    key={segmentIndex}
                                    variant={
                                        Platform.OS === "android"
                                            ? bodyHeight <= 500
                                                ? "body_small"
                                                : "body_post_content"
                                            : "heading_large_italic"
                                    }
                                    color="light"
                                >
                                    {elements}
                                </Text>
                            );
                        }

                        return segment;
                    })}
                </Text>
            ))}
        </YStack>
    );
}
