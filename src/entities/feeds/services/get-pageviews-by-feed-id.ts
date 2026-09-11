import { BetaAnalyticsDataClient, type protos } from "@google-analytics/data";

import isDevelopment from "~/shared/utils/is-development";
import Log from "~/shared/utils/terminal-logger";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    // TODO: Consider storing private key as encoded base64, then decode and use
    private_key: process.env.FIREBASE_PRIVATE_KEY.split(String.raw`\n`).join(
      "\n"
    ),
  },
});

function transformAnalyticsData(
  response: protos.google.analytics.data.v1beta.IRunReportResponse
) {
  // Check if response exists and has rows
  if (!response?.rows) {
    return [];
  }

  // Map through the rows and create an object with id and value of the feed
  return response.rows.map((row) => {
    if (row.dimensionValues && row.metricValues) {
      return {
        id: row?.dimensionValues[0]?.value,
        pageviews: Number.parseInt(row?.metricValues[0]?.value ?? "0", 10),
      };
    }
  });
}

export async function getPageviewByFeedId(feedId: string): Promise<number> {
  if (isDevelopment()) {
    return Math.ceil(100 * Math.random());
  }

  const request = {
    dateRanges: [
      {
        endDate: "today",
        startDate: "90daysAgo",
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "EXACT",
          value: `/c/${feedId}`,
        },
      },
    },
    dimensions: [
      {
        name: "pagePath",
      },
    ],
    metrics: [
      {
        name: "screenPageViews",
      },
    ],
    property: `properties/${process.env.GA_PROPERTY_ID}`,
  } as protos.google.analytics.data.v1beta.IRunReportRequest;

  Log.info(`Querying pageview of feed: ${feedId}`);

  // Refer: https://github.com/googleanalytics/nodejs-docs-samples/blob/e21670ab2c79a12c45bffa10ac26e0324279a718/google-analytics-data/run_report.js#L33-L93
  const [response] = await analyticsDataClient.runReport(request);

  const data = transformAnalyticsData(response);
  return data?.at(0)?.pageviews ?? 0;
}
