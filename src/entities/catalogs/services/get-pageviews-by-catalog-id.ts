import { BetaAnalyticsDataClient, protos } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    // TODO: Consider storing private key as encoded base64, then decode and use
    private_key: process.env
      .GOOGLE_ANALYTICS_PRIVATE_KEY!.split(String.raw`\n`)
      .join("\n"),
  },
});

function transformAnalyticsData(
  response: protos.google.analytics.data.v1beta.IRunReportResponse
) {
  // Check if response exists and has rows
  if (!response?.rows) {
    return [];
  }

  // Map through the rows and create an object with id and value of the catalog
  return response.rows.map((row) => {
    if (row.dimensionValues && row.metricValues) {
      return {
        id: row?.dimensionValues[0]?.value,
        pageviews: parseInt(row?.metricValues[0]?.value ?? "0", 10),
      };
    }
  });
}

export async function getPageviewByCatalogId(
  catalogId: string
): Promise<number> {
  // TODO: Make a function to check if the code is running on development or on production server
  if (process.env.NODE_ENV === "development") {
    return 69;
  }

  const request = {
    dateRanges: [
      {
        startDate: "90daysAgo",
        endDate: "today",
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "EXACT",
          value: `/c/${catalogId}`,
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
    property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
  } as protos.google.analytics.data.v1beta.IRunReportRequest;

  console.log(`Querying pageview of catalog: ${catalogId}`);

  // Refer: https://github.com/googleanalytics/nodejs-docs-samples/blob/e21670ab2c79a12c45bffa10ac26e0324279a718/google-analytics-data/run_report.js#L33-L93
  const [response] = await analyticsDataClient.runReport(request);

  const data = transformAnalyticsData(response);
  return data?.at(0)?.pageviews ?? 0;
}
