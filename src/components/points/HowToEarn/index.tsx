import {
    Action,
    useActionsForPointsState,
} from "../../../state/actionsForPointsState";
import { useUserState } from "../../../state/userState";
import { theme } from "../../../ui";
import { YStack } from "../../../ui/stack";
import HowToEarnCard from "./HowToEarnCard";

export default function HowToEarn() {
    const actionsForEarning: Action[] | null =
        useActionsForPointsState().actionsForPoints.actionsList;

    const userDetails = useUserState().userDetails;

    if (!actionsForEarning) {
        return null;
    }

    const liveActions = actionsForEarning.filter(
        (action) => action.status === "live"
    );

    const completedLiveActions = liveActions.filter((action) => {
        if (action.IsOneTime && action.user_table_column_name) {
            return userDetails[action.user_table_column_name] === true;
        }
        return false;
    });

    const liveActionsExclusive = liveActions.filter(
        (action) => !completedLiveActions.includes(action)
    );

    const comingSoonActions = actionsForEarning.filter(
        (action) => action.status === "coming_soon"
    );

    return (
        <YStack
            justifyContent={"flex-start"}
            alignItems={"center"}
            width={null}
            gap={theme.spacing.$2}
            style={{
                marginVertical: theme.spacing.$4,
            }}
        >
            {liveActionsExclusive.map((action) => (
                <HowToEarnCard
                    key={action.action_id}
                    label={action.name}
                    description={action.description}
                    points={action.points_award}
                    completed={false}
                    comingSoon={false}
                />
            ))}
            {completedLiveActions.map((action) => (
                <HowToEarnCard
                    key={action.action_id}
                    label={action.name}
                    description={action.description}
                    points={action.points_award}
                    completed={true}
                    comingSoon={false}
                />
            ))}
            {comingSoonActions.map((action) => (
                <HowToEarnCard
                    key={action.action_id}
                    label={action.name}
                    description={action.description}
                    points={action.points_award}
                    completed={action.status === "completed"}
                    comingSoon={true}
                />
            ))}
        </YStack>
    );
}
