import React from "react";
import Loader from "components/Loader";
import Tabs from "components/Tabs";
import { useCampaign } from "hooks/useCampaign";
import { useEffect } from "react";
import { ChevronRight } from "react-feather";
import { useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import { BodyWrapper } from "../../pages/AppBody";
import { AppDispatch } from "../../state";
import { useActiveProtocol } from "../../state/governance/hooks";
import { SUPPORTED_PROTOCOLS } from "../../state/governance/reducer";
import { TYPE } from "../../theme";
import { AutoColumn } from "../Column";
import { ProposalStatus } from "../governance/styled";
import { RowBetween, RowFixed } from "../Row";
import CampaignContent from "./CampaignContent";
import CampaignOverview from "./CampaignOverview";

const Wrapper = styled.div<{ backgroundColor?: string }>``;

const ProposalInfo = styled(AutoColumn)`
  border-radius: 12px;
  position: relative;
`;

const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text1};

  a {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
  :hover {
    text-decoration: none;
    cursor: pointer;
  }
`;

export const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ disabled }) => disabled && "0.4"};
`;

function CampaignDetails({
  location: { pathname },
  match: {
    params: { protocolID, campaignID },
  },
  history,
}: RouteComponentProps<{
  protocolID: string;
  campaignID: string;
  tabID?: string;
}>) {
  // if valid protocol id passed in, update global active protocol
  const dispatch = useDispatch<AppDispatch>();
  const [, setActiveProtocol] = useActiveProtocol();
  useEffect(() => {
    if (protocolID && Object.keys(SUPPORTED_PROTOCOLS).includes(protocolID)) {
      setActiveProtocol(SUPPORTED_PROTOCOLS[protocolID]);
    }
  }, [dispatch, protocolID, setActiveProtocol]);

  const {
    amplifiCampaignsTabData,
    uriToRouteMap,
    page: { data, tabUri, useCampaignACFsInstead },
  } = useCampaign(protocolID, pathname, campaignID);

  return (
    <BodyWrapper>
      <Wrapper>
        <ProposalInfo gap="lg" justify="start">
          <RowBetween style={{ width: "100%", alignItems: "flex-start" }}>
            <RowFixed>
              <ArrowWrapper
                onClick={() => {
                  history?.length === 1 ? history.push("/") : history.goBack();
                }}
                style={{ alignItems: "flex-start" }}
              >
                <TYPE.body fontWeight="600">Campaigns</TYPE.body>
              </ArrowWrapper>
              <ChevronRight size={16} />
              <TYPE.body>{campaignID}</TYPE.body>
            </RowFixed>

            {true && (
              <ProposalStatus status={"" ?? ""}>{"Status here"}</ProposalStatus>
            )}
          </RowBetween>
          <AutoColumn gap="10px" style={{ width: "100%" }}>
            <TYPE.largeHeader style={{ marginBottom: ".5rem" }}>
              {data && data.data.title ? data.data.title : ""}
            </TYPE.largeHeader>
            <RowBetween>{/* <TYPE.main>Date here</TYPE.main> */}</RowBetween>
            {amplifiCampaignsTabData.length > 0 && (
              <Tabs
                data={amplifiCampaignsTabData}
                value={tabUri}
                onChange={(value) => {
                  //optional
                }}
                onClick={(value: any) => {
                  history.replace(uriToRouteMap[value]);
                }}
              />
            )}
            {/* <Break /> */}
            {useCampaignACFsInstead ? (
              <CampaignOverview />
            ) : (
              <>
                {/* <Break /> */}
                {!data ? (
                  <Loader />
                ) : (
                  <CampaignContent content={data.data.content} />
                )}
              </>
            )}
            {data && data.error && <div>Error loading content</div>}
          </AutoColumn>
          {/* Auto column
          <AutoColumn gap="md">
            Auto column
          </AutoColumn>
          <AutoColumn gap="md">
            Auto column
          </AutoColumn>
          <AutoColumn gap="md">
            Auto column
          </AutoColumn> */}
        </ProposalInfo>
      </Wrapper>
    </BodyWrapper>
  );
}

export default withRouter(CampaignDetails);
