// @ts-ignore
import * as recombee from "recombee-js-api-client";
import { RECOMBEE_DB_ID, RECOMBEE_TOKEN } from "@env";

export var recombeeClient = new recombee.ApiClient(
    RECOMBEE_DB_ID,
    RECOMBEE_TOKEN,
    { region: "eu-west" }
);
