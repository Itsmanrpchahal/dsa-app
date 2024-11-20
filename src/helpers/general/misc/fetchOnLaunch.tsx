import { getTrendingApps } from "../../browser/api/getTrendingApps";
import { getTrendingAppsPlaylist } from "../../browser/api/getTrendingAppsPlaylist";
import { getFeed } from "../../feed";
import { fetchInviteCodes } from "../../invites/api/fetchInviteCodes";
import { getActionsForPoints } from "../../points";
import { getUserDetails } from "../../user/api/getUserDetails";
import { getNfts } from "../../wallet/api/getNfts";
import { getSupportedChains } from "../../wallet/api/getSupportedChains";
import { getTokenBalance } from "../../wallet/api/getTokenBalance";
import { getTransactionHistory } from "../../wallet/api/getTransactionHistory";

export async function fetchOnLanch() {
    getUserDetails();
    getFeed();
    getTrendingApps();
    fetchInviteCodes();
    getActionsForPoints();
    getSupportedChains();
    getTokenBalance();
    getNfts();
    getTransactionHistory();
    getTrendingAppsPlaylist();
}
