// Note: Process URL
// Processing a string, and returns an object with a url with protocol, hostname and other details.

import { BrowserUrlType } from "../../../types";

export const processUrl = (urlString: string): BrowserUrlType => {
    try {
        let urlWithProtocol;

        if (!urlString.match(/^http[s]?:\/\//)) {
            urlWithProtocol = "https://" + urlString;
        } else {
            urlWithProtocol = urlString;
        }

        const newUrl = new URL(urlWithProtocol);

        if (!newUrl.hostname.includes(".")) {
            throw new Error("Invalid URL");
        }

        const hostname = newUrl.hostname
            .replace(/^www\./, "")
            .split(".")
            .slice(0, -1)
            .join(".");

        const hostNameUrl = `${hostname}.${newUrl.hostname.split(".").pop()}`;

        return {
            url: urlWithProtocol,
            hostname: hostname,
            hostNameUrl: hostNameUrl,
        };
    } catch (error) {
        const createSearchUrl = `https://www.google.com/search?q=${urlString}`;

        const newUrl = new URL(createSearchUrl);
        const hostname = newUrl.hostname
            .replace(/^www\./, "")
            .split(".")
            .slice(0, -1)
            .join(".");

        const hostNameUrl = `${hostname}.${newUrl.hostname.split(".").pop()}`;

        return {
            url: createSearchUrl,
            hostname: hostname,
            hostNameUrl: hostNameUrl,
        };
    }
};
