import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import type { Theme } from "@/lib/theme/schema";
import {
  RELATION_LABELS,
  type QuoteInput,
  type PlanSelection,
  type Proposal,
  type Policy,
} from "@/lib/journey/schema";
import { ADDON_CATALOG } from "@/lib/pricing/addons";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export type PolicyDocumentProps = {
  theme: Theme;
  quote: QuoteInput;
  plan: PlanSelection;
  proposal: Proposal;
  policy: Policy;
};

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#171717" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 16,
  },
  logo: { width: 32, height: 32, marginRight: 10, objectFit: "contain" },
  brandName: { fontSize: 16, fontWeight: 700 },
  tagline: { fontSize: 9, color: "#666666" },
  headerRight: { marginLeft: "auto", textAlign: "right" },
  policyLabel: { fontSize: 8, color: "#666666" },
  policyNumber: { fontSize: 12, fontWeight: 700 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginTop: 16, marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eeeeee",
  },
  label: { color: "#666666" },
  value: { fontWeight: 700 },
  table: { marginTop: 4 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: "#f5f5f5", padding: 6 },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eeeeee",
  },
  col: { flex: 1 },
  disclaimer: { marginTop: 24, fontSize: 8, color: "#999999", lineHeight: 1.4 },
});

export function PolicyDocument({
  theme,
  quote,
  plan,
  proposal,
  policy,
}: PolicyDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          {theme.logoDataUrl && (
            // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML img
            <Image src={theme.logoDataUrl} style={styles.logo} />
          )}
          <View>
            <Text style={styles.brandName}>{theme.brandName}</Text>
            {theme.tagline && <Text style={styles.tagline}>{theme.tagline}</Text>}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.policyLabel}>POLICY NUMBER</Text>
            <Text style={[styles.policyNumber, { color: theme.colors.primary }]}>
              {policy.policyNumber}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Policy summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Issued on</Text>
          <Text style={styles.value}>{formatDate(policy.issuedAt)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sum insured</Text>
          <Text style={styles.value}>{formatCurrency(plan.sumInsured)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Annual premium</Text>
          <Text style={styles.value}>{formatCurrency(plan.premium.total)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment method</Text>
          <Text style={styles.value}>{policy.paymentMethod.toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pincode</Text>
          <Text style={styles.value}>{quote.pincode}</Text>
        </View>

        <Text style={styles.sectionTitle}>Insured members</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.col}>Name</Text>
            <Text style={styles.col}>Relation</Text>
            <Text style={styles.col}>DOB</Text>
            <Text style={styles.col}>Gender</Text>
          </View>
          {proposal.members.map((m) => {
            const quoteMember = quote.members.find((qm) => qm.id === m.memberId);
            return (
              <View style={styles.tableRow} key={m.memberId}>
                <Text style={styles.col}>{m.fullName}</Text>
                <Text style={styles.col}>
                  {quoteMember ? RELATION_LABELS[quoteMember.relation] : "-"}
                </Text>
                <Text style={styles.col}>{m.dob}</Text>
                <Text style={styles.col}>{m.gender}</Text>
              </View>
            );
          })}
        </View>

        {plan.addons.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Add-ons</Text>
            {plan.addons.map((id) => (
              <View style={styles.row} key={id}>
                <Text style={styles.value}>{ADDON_CATALOG[id].label}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>Contact & address</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{proposal.contact.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{proposal.contact.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>
            {[
              proposal.address.line1,
              proposal.address.line2,
              proposal.address.city,
              proposal.address.state,
              proposal.address.pincode,
            ]
              .filter(Boolean)
              .join(", ")}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Nominee</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{proposal.nominee.fullName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Relation</Text>
          <Text style={styles.value}>{proposal.nominee.relation}</Text>
        </View>

        <Text style={styles.disclaimer}>
          This is a system-generated document for a DEMO insurance journey
          only. {theme.brandName} is a fictitious brand created for
          illustrative purposes. This is not a real insurance policy, no
          premium was actually charged, and this document has no legal or
          financial validity.
        </Text>
      </Page>
    </Document>
  );
}
