"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, KeyRound, TriangleAlert } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { createProject, type CreatedProject } from "@/lib/control";
import { ApiKeyField } from "@/components/api-key-field";
import { validateUrls } from "@/utils/validate-urls";

function parseList(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function NewProjectPage() {
  const [name, setName] = React.useState("");
  const [origins, setOrigins] = React.useState("");
  const [targets, setTargets] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [created, setCreated] = React.useState<CreatedProject | null>(null);

  const originsValid = origins.trim().length === 0 || validateUrls(origins);
  const valid = name.trim().length > 0 && originsValid;

  const onCreate = () => {
    setBusy(true);
    createProject({
      name: name.trim(),
      allowedOrigins: parseList(origins),
      allowedTargets: parseList(targets),
    })
      .then(setCreated)
      .catch((e) => toast.error(e?.message ?? "Failed to create project"))
      .finally(() => setBusy(false));
  };

  if (created) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
            <KeyRound className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Project created
            </h1>
            <p className="text-sm text-muted-foreground">{created.name}</p>
          </div>
        </div>

        <Alert>
          <TriangleAlert className="size-4" />
          <AlertTitle>Save these keys now</AlertTitle>
          <AlertDescription>
            They&apos;re shown only once. You can reveal and copy them here, then
            from the project page later.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">API keys</CardTitle>
            <CardDescription>
              Use the live key in production (origin-pinned) and the test key
              locally.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ApiKeyField value={created.keys.live} keyType="live" defaultRevealed />
            <ApiKeyField value={created.keys.test} keyType="test" defaultRevealed />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button asChild>
            <Link href={`/console/${created.id}`}>Go to project</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/console">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
      >
        <Link href="/console">
          <ArrowLeft className="size-4" /> Back
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A project groups your keys and the origins allowed to use them.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              autoFocus
              placeholder="my-portfolio-website"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="origins">Allowed origins</Label>
            <Textarea
              id="origins"
              rows={3}
              placeholder={"http://localhost:3000\nhttps://my-site.com"}
              value={origins}
              onChange={(e) => setOrigins(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Comma or newline separated. Your{" "}
              <span className="font-mono">live_</span> key only works from these
              origins. Leave empty to decide later.
            </p>
            {!originsValid && (
              <p className="text-xs text-destructive">
                One or more origins isn&apos;t a valid URL.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targets">
              Allowed targets{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="targets"
              rows={2}
              placeholder={"https://api.example.com"}
              value={targets}
              onChange={(e) => setTargets(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Restrict which upstream hosts this key may proxy to. Empty = any.
            </p>
          </div>

          <Button
            className="h-9 w-full text-sm"
            disabled={!valid || busy}
            onClick={onCreate}
          >
            {busy ? "Creating…" : "Create Project"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
