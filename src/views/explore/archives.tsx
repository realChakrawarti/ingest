import fetchApi from "~/shared/lib/api/fetch";
import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";

export default async function Archives() {
  const archives = await fetchApi("/archives/valid");

  return (
    <PublicMainContainer>
      <PublicHeaderTitle>
        <h1 className="text-2xl font-semibold tracking-tight">Archives</h1>
      </PublicHeaderTitle>
      <PublicContentContainer>
        <GridContainer>
          {archives?.data?.length ? (
            archives?.data?.map((pageData: any) => {
              if (pageData?.id) {
                return (
                  <DetailsCard
                    path={`/a/${pageData.id}`}
                    key={pageData.id}
                    pageData={pageData}
                  />
                );
              }
            })
          ) : (
            <div>No archives found.</div>
          )}
        </GridContainer>
      </PublicContentContainer>
    </PublicMainContainer>
  );
}
