import type { NextPage } from "next";
import type { ErrorProps } from "next/error";
import NextError from "next/error";

import * as Sentry from "@sentry/nextjs";

const CustomErrorComponent: NextPage<ErrorProps> = (props) => {
  return <NextError statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return NextError.getInitialProps(contextData);
};

export default CustomErrorComponent;