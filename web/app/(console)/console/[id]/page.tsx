"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { getProject, updateProject, deleteProject, type ProjectDetail } from "@/lib/control";
import { formatNumber, humanizeBytes, formatDate } from "@/lib/format";
import { ApiKeyField } from "@/components/api-key-field";
import { CopyButton } from "@/components/copy-button";
import { UsageMeter } from "@/components/usage-meter";

function parseList(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Account-wide quota for context on the usage meters (Pro account in the stub).
const ACCOUNT_QUOTA = { requests: 500_000, bytes: 500 * 1024 ** 3 };

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const router = useRouter();

  const [project, setProject] = React.useState<ProjectDetail | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [origins, setOrigins] = React.useState("");
  const [targets, setTargets] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    getProject(id)
      .then((p) => {
        if (!active) return;
        setProject(p);
        setName(p.name);
        setOrigins(p.allowedOrigins.join("\n"));
        setTargets(p.allowedTargets.join("\n"));
      })
      .catch((e) => active && setError(e?.message ?? "Failed to load project"));
    return () => {
      active = false;
    };
  }, [id]);

  const dirty =
    !!project &&
    (name.trim() !== project.name ||
      parseList(origins).join("\n") !== project.allowedOrigins.join("\n") ||
      parseList(targets).join("\n") !== project.allowedTargets.join("\n"));

  const onSave = () => {
    setSaving(true);
    updateProject(id, {
      name: name.trim(),
      allowedOrigins: parseList(origins),
      allowedTargets: parseList(targets),
    })
      .then((r) => {
        setProject((prev) =>
          prev
            ? {
                ...prev,
                name: r.name ?? prev.name,
                allowedOrigins: r.allowedOrigins,
                allowedTargets: r.allowedTargets,
              }
            : prev,
        );
        toast.success("Saved");
      })
      .catch((e) => toast.error(e?.message ?? "Failed to save"))
      .finally(() => setSaving(false));
  };

  const onDelete = () => {
    setDeleting(true);
    deleteProject(id)
      .then(() => {
        toast.success("Project deleted");
        router.push("/console");
      })
      .catch((e) => {
        toast.error(e?.message ?? "Failed to delete");
        setDeleting(false);
      });
  };

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-destructive/40">
          <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
        <Link href="/console">
          <ArrowLeft className="size-4" /> Projects
        </Link>
      </Button>

      {!project ? (
        <div className="space-y-8">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="font-mono text-xs text-muted-foreground">{project.id}</span>
              <CopyButton
                value={project.id}
                size="icon"
                variant="ghost"
                className="size-6"
                toastMessage="Project ID copied"
              />
            </div>
          </div>

          {/* API keys */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">API keys</CardTitle>
              <CardDescription>
                <span className="font-mono">live_</span> is origin-pinned for production;{" "}
                <span className="font-mono">test_</span> works anywhere but is rate-capped.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.keys.length === 0 && (
                <p className="text-sm text-muted-foreground">No keys found for this project.</p>
              )}
              {project.keys.map((k) => (
                <ApiKeyField key={k.key} value={k.key} keyType={k.key_type} inactive={!k.active} />
              ))}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Settings</CardTitle>
              <CardDescription>
                Rename the project and control where its keys may be used.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origins">Allowed origins</Label>
                <Textarea
                  id="origins"
                  rows={3}
                  value={origins}
                  onChange={(e) => setOrigins(e.target.value)}
                  placeholder={"http://localhost:3000\nhttps://my-site.com"}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Comma or newline separated. The live key rejects any other origin.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targets">
                  Allowed targets <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="targets"
                  rows={2}
                  value={targets}
                  onChange={(e) => setTargets(e.target.value)}
                  placeholder={"https://api.example.com"}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Upstream hosts this project may proxy to. Empty = any.
                </p>
              </div>
              <Button onClick={onSave} disabled={!dirty || saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account usage</CardTitle>
              <CardDescription>
                Aggregate across all projects this period ({project.usage.period}
                ). Per-project breakdown is coming soon.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <UsageMeter
                label="Requests"
                used={project.usage.requests}
                total={ACCOUNT_QUOTA.requests}
                format={formatNumber}
              />
              <UsageMeter
                label="Bandwidth"
                used={project.usage.bytes}
                total={ACCOUNT_QUOTA.bytes}
                format={humanizeBytes}
              />
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base">Danger zone</CardTitle>
              <CardDescription>
                Deleting a project immediately revokes its keys. Created{" "}
                {formatDate(project.createdAt)}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={deleting}>
                    {deleting ? "Deleting…" : "Delete project"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete &ldquo;{project.name}&rdquo;?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently deletes the project and revokes its live and test keys. This
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
