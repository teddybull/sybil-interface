import { GovernanceInfo } from "state/governance/reducer";
// import { SerializedToken } from "state/user/actions";

export async function getUrl(
  twitterHandle: string,
  roughBaseUrl: string,
  id: string
): Promise<{utm: string, shortUtm: string | undefined} | undefined> {
  /**
   * https://hundred.finance/?utm_source=source&utm_medium=medium&utm_campaign=name&utm_id=twitter-ugm
   */
  //https://support.google.com/analytics/answer/10917952?hl=en#zippy=%2Cin-this-article
  let baseUrl : string = roughBaseUrl;
  if (roughBaseUrl.charAt(roughBaseUrl.length - 1) != '?' && roughBaseUrl.charAt(roughBaseUrl.length - 1) == '/') {
    baseUrl = roughBaseUrl + "?"
  } else if (roughBaseUrl.charAt(roughBaseUrl.length - 1) != '/'){
    baseUrl = roughBaseUrl + "/"
  }
  const campaignUrl = baseUrl;
  const utm_source = twitterHandle;
  const medium = twitterHandle;
  const utm_campaign = id; //todo- make id campaign specific rather than protocol specific
  const utm_id = id;
  //const utm_term = twitterHandle
  const domain = {
    id: "278c3d8b2f6d469e812bdddbf713a079",
    fullName: "link.cre8r.vip",
  };

  
  const campaignUrlComponents : any = [];
  campaignUrlComponents.push(`utm_source=${utm_source}`);
  campaignUrlComponents.push(`utm_medium=${medium}`);
  campaignUrlComponents.push(`utm_campaign=${utm_campaign}`);
  campaignUrlComponents.push(`utm_id=${utm_id}`);
  //campaignUrlComponents.push(`utm_term=${utm_term}`)

  function getLongLink() {
    return baseUrl?.replace("https://", "") + campaignUrlComponents.join("&");
  }
  if (!process.env.REACT_APP_REBRANDLY) {
    return {utm: getLongLink(), shortUtm: undefined}
  }

  const urlComponents = [];

  urlComponents.push(`domain[id]=${domain.id}`);
  urlComponents.push(`domain[fullName]=${domain.fullName}`);

  const options : any = {
    method: "GET",
    headers: {
      Accept: "application/json",
      apikey: process.env.REACT_APP_REBRANDLY,
    },
  };
  const response = await fetch(
    "https://api.rebrandly.com/v1/links/new?destination=" +
      encodeURIComponent(campaignUrl + campaignUrlComponents.join("&")) +
      "&" +
      urlComponents.join("&"),
    options
  );

  if (response.ok != true) {
    console.error('link shortening failed')
    return {utm: getLongLink(), shortUtm: undefined}
  }
  const res = await response.json();
  return {utm: getLongLink(), shortUtm: res.shortUrl}
}
