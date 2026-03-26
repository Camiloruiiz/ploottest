import { Database, FlaskConical, Rocket, ShieldCheck } from "lucide-react";
import { EnvSummary } from "@/components/system/env-summary";
import { SeedProductsButton } from "@/components/system/seed-products-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const checkpoints = [
  {
    title: "Stack base",
    description: "Next.js App Router, TypeScript, React Query and shadcn/ui primitives are wired.",
    icon: Rocket,
  },
  {
    title: "Supabase",
    description: "Server and browser clients are split, with env validation and seed flow ready.",
    icon: Database,
  },
  {
    title: "Contracts",
    description: "Shared Zod schemas cover products, orders and API response helpers.",
    icon: ShieldCheck,
  },
  {
    title: "Testing",
    description: "Vitest, Playwright and visual snapshot coverage start from the home screen.",
    icon: FlaskConical,
  },
];

export function HomeStatus() {
  return (
    <main style={{ padding: "48px 20px 80px" }}>
      <div
        style={{
          margin: "0 auto",
          maxWidth: 1080,
          display: "grid",
          gap: 24,
        }}
      >
        <section
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "calc(var(--radius) * 1.5)",
            padding: 32,
            boxShadow: "0 30px 80px rgba(23, 18, 15, 0.08)",
          }}
        >
          <Badge>PlootTest MVP Base</Badge>
          <h1 style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", margin: "16px 0 12px" }}>
            The repo is now an executable platform, not only a roadmap.
          </h1>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.6, maxWidth: 760, color: "var(--muted)" }}>
            This first delivery keeps the e-commerce scope intentionally narrow: boot the stack, validate the runtime
            contracts, connect Supabase, prepare seeds and prove the pipeline with automated tests.
          </p>
          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Badge variant="outline">Next.js 15</Badge>
            <Badge variant="outline">Supabase</Badge>
            <Badge variant="outline">Zod</Badge>
            <Badge variant="outline">React Query</Badge>
            <Badge variant="outline">Playwright</Badge>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {checkpoints.map(({ title, description, icon: Icon }) => (
            <Card key={title}>
              <CardHeader>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(212, 111, 77, 0.12)",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={20} />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>{description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 0.9fr)",
            gap: 16,
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Environment checkpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <EnvSummary />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bootstrap path</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ marginTop: 0, color: "var(--muted)", lineHeight: 1.5 }}>
                Seed products from the bundled JSON source once your Supabase project is configured.
              </p>
              <SeedProductsButton />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
