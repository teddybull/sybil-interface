import gql from "graphql-tag";
import { FETCHING_INTERVAL } from "../state/governance/reducer";

export const GLOBAL_DATA = gql`
  query governance {
    governances(first: 1) {
      delegatedVotes
      delegatedVotesRaw
      totalTokenHolders
      totalDelegates
    }
  }
`;
export const CASE_STUDY_ACF_FIELDS_CLIPS = gql`
  query ClipsFromCasestudies {
    caseStudies(first: 10, where: {}) {
      pageInfo {
        endCursor
        startCursor
      }
      edges {
        node {
          title
        }
      }
      nodes {
        caseStudyAcfFields {
          clipsRepeater {
            clipFile {
              mediaItemUrl
            }
            clipImage {
              id
            }
            clipTitle
          }
        }
      }
    }
  }
`;

// fetch top delegates by votes delegated at current time
export const TOP_DELEGATES = gql`
  query delegates {
    delegates(first: ${FETCHING_INTERVAL}, orderBy: delegatedVotes, orderDirection: desc) {
      id
      delegatedVotes
      delegatedVotesRaw
      tokenHoldersRepresentedAmount
      votes {
        id
        votes
        support
      }
    }
  }
`;

// fetch top delegates by votes delegated at current time
export const TOP_DELEGATES_OFFSET = gql`
  query delegates($skip: Int!) {
    delegates(first: ${FETCHING_INTERVAL}, skip: $skip, orderBy: delegatedVotes, orderDirection: desc) {
      id
      delegatedVotes
      delegatedVotesRaw
      tokenHoldersRepresentedAmount
      votes {
        id
        votes
        support
      }
    }
  }
`;

// fetch top delegates by votes delegated at current time
export const DELEGATES_FROM_LIST = gql`
  query delegates($list: [Bytes!]) {
    delegates(
      first: 500
      orderBy: delegatedVotes
      orderDirection: desc
      where: { id_in: $list }
    ) {
      id
      delegatedVotes
      delegatedVotesRaw
      tokenHoldersRepresentedAmount
      votes {
        id
        votes
        support
      }
    }
  }
`;

// all proposals
export const PROPOSALS = gql`
  query proposals {
    proposals(first: 100, orderBy: startBlock, orderDirection: desc) {
      id
      targets
      values
      signatures
      status
      calldatas
      description
      startBlock
      endBlock
      proposer {
        id
      }
      forVotes: votes(
        first: 1000
        orderBy: votesRaw
        orderDirection: desc
        where: { support: true }
      ) {
        support
        votes
        voter {
          id
        }
      }
      againstVotes: votes(
        first: 1000
        orderBy: votesRaw
        orderDirection: desc
        where: { support: false }
      ) {
        support
        votes
        voter {
          id
        }
      }
    }
  }
`;

export const PROPOSALS_SNAPSHOT = gql`
  query Proposals(
    $first: Int!
    $skip: Int!
    $state: String!
    $space: String
    $space_in: [String]
    $author_in: [String]
  ) {
    proposals(
      first: $first
      skip: $skip
      where: {
        space: $space
        state: $state
        space_in: $space_in
        author_in: $author_in
      }
    ) {
      id
      ipfs
      title
      body
      start
      end
      state
      author
      created
      choices
      space {
        id
        name
        members
        avatar
        symbol
      }
      scores_state
      scores_total
      scores
      votes
      quorum
      symbol
    }
  }
`;
export const ALL_VOTERS = gql`
  query voters($proposalID: String!, $support: Boolean!) {
    votes(
      first: 1000
      where: { support: $support, proposal: $proposalID, votes_gt: 1 }
      orderBy: votes
      orderDirection: desc
    ) {
      voter {
        id
      }
      votes
    }
  }
`;

export const DELEGATE_INFO = gql`
  query delegates($address: Bytes!) {
    delegates(where: { id: $address }) {
      id
      delegatedVotes
      delegatedVotesRaw
      tokenHoldersRepresentedAmount
      votes {
        proposal {
          id
        }
        support
        votes
      }
    }
  }
`;
