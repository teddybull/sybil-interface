import React, { useEffect } from "react";
import styled from "styled-components";
import { useActivePopups } from "../../state/application/hooks";
import { AutoColumn } from "../Column";
import PopupItem from "./PopupItem";
import { useURLWarningVisible } from "../../state/user/hooks";
import { toast } from "react-toastify";

const MobilePopupWrapper = styled.div<{ height: string | number }>`
  position: relative;
  max-width: 100%;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? "0 auto;" : 0)};
  margin-bottom: ${({ height }) => (height ? "20px" : 0)}};

  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`;

const MobilePopupInner = styled.div`
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const FixedPopupColumn = styled(AutoColumn)<{ extraPadding: boolean }>`
  position: fixed;
  top: ${({ extraPadding }) => (extraPadding ? "108px" : "20px")};
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 3;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

export default function Popups(): JSX.Element {
  // get all popups
  const activePopups = useActivePopups();

  const urlWarningActive = useURLWarningVisible();

  //refactor to use other popup system
  useEffect(() => {
    if (toast && process.env.REACT_APP_TOAST) {
      toast.info(process.env.REACT_APP_TOAST);
    }
  }, [toast]);

  return (
    <>
      <FixedPopupColumn gap="20px" extraPadding={urlWarningActive}>
        {activePopups.map((item) => (
          <PopupItem
            key={item.key}
            content={item.content}
            popKey={item.key}
            removeAfterMs={item.removeAfterMs}
          />
        ))}
      </FixedPopupColumn>
      <MobilePopupWrapper height={activePopups?.length > 0 ? "fit-content" : 0}>
        <MobilePopupInner>
          {activePopups // reverse so new items up front
            .slice(0)
            .reverse()
            .map((item) => (
              <PopupItem
                key={item.key}
                content={item.content}
                popKey={item.key}
                removeAfterMs={item.removeAfterMs}
              />
            ))}
        </MobilePopupInner>
      </MobilePopupWrapper>
    </>
  );
}
