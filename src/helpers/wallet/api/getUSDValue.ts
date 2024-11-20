import { log } from "../../../config/logger";

export async function getUSDValue() {
    try {
        const data = {
            value: "0x2c2ad68fd9000",
            to: "0x000000000001A36777f9930aAEFf623771b13e70",
            from:'0x20132c85646e5fef0486d9883c2bc12d427b459f',
        };

        return data;
    } catch (error) {
        log.error(error);
        throw new Error("Failed to get gas usd values");
    }
}
