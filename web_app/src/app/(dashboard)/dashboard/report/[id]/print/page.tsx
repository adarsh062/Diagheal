export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintReportClient from "@/components/features/dashboard/PrintReportClient";

interface PrintReportPageProps {
    params: { id: string };
}

export default async function PrintReportPage({ params }: PrintReportPageProps) {
    const { id } = await params;

    const record = await prisma.record.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!record) {
        return notFound();
    }

    const biomarkers = [
        { label: "Total Bilirubin", value: record.tb, unit: "mg/dL", normal: "0.1 - 1.2" },
        { label: "Direct Bilirubin", value: record.db, unit: "mg/dL", normal: "0 - 0.3" },
        { label: "Alkaline Phosphatase", value: record.alkphos, unit: "U/L", normal: "44 - 147" },
        { label: "SGPT (ALT)", value: record.sgpt, unit: "U/L", normal: "7 - 55" },
        { label: "SGOT (AST)", value: record.sgot, unit: "U/L", normal: "8 - 48" },
        { label: "Total Protein", value: record.tp, unit: "g/dL", normal: "6.0 - 8.3" },
        { label: "Albumin", value: record.alb, unit: "g/dL", normal: "3.4 - 5.4" },
        { label: "A/G Ratio", value: record.agRatio, unit: "", normal: "1.1 - 2.5" },
    ];

    return <PrintReportClient record={record} biomarkers={biomarkers} />;
}
