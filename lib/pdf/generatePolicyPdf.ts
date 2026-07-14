import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { PolicyDocument, type PolicyDocumentProps } from "./PolicyDocument";

export async function generatePolicyPdf(
  data: PolicyDocumentProps
): Promise<Buffer> {
  // PolicyDocument wraps <Document>, but renderToBuffer's type demands a
  // literal Document element - react-pdf has no typed escape hatch for a
  // component that merely renders one.
  const element = createElement(PolicyDocument, data) as unknown as ReactElement<DocumentProps>;
  return renderToBuffer(element);
}
