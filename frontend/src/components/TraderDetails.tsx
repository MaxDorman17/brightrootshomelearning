import { SUPPORT_EMAIL, TRADER_ADDRESS, TRADER_NAME, TRADING_NAME } from "@/lib/site";

/** "Who we are" line shared by the legal pages. */
export default function TraderDetails() {
  return (
    <p>
      {TRADING_NAME} (&quot;Bright Roots&quot;, &quot;we&quot;, &quot;us&quot;) is based in Scotland
      {TRADER_NAME ? <> and is run by {TRADER_NAME}</> : null}.{" "}
      {TRADER_ADDRESS ? <>Our postal address is {TRADER_ADDRESS}. </> : null}
      You can email us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
    </p>
  );
}
