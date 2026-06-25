"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, FolderPlus, Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  listProjects,
  getUsage,
  type Project,
  type Usage,
} from "@/lib/control";
import { formatNumber, humanizeBytes, formatRelative } from "@/lib/format";
import { UsageMeter } from "@/components/usage-meter";

export default function DashboardPage() {
  const [projects, setProjects] = React.useState<Project[] | null>(null);
  const [usage, setUsage] = React.useState<Usage | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    Promise.all([listProjects(), getUsage().catch(() => null)])
      .then(([list, u]) => {
        if (!active) return;
        setProjects(list.projects);
        setUsage(u);
      })
      .catch((e) => active && setError(e?.message ?? "Failed to load projects"));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your CORS.SH projects, keys, and allowed origins.
          </p>
        </div>
        <Button asChild>
          <Link href="/console/new">
            <Plus className="size-4" /> New project
          </Link>
        </Button>
      </div>

      {/* Account usage */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium">Account usage</h2>
            {usage && (
              <Badge variant="secondary" className="font-mono text-[10px]">
                {usage.period}
              </Badge>
            )}
          </div>
          {usage ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <UsageMeter
                label="Requests"
                used={usage.requests}
                total={usage.quota.requests}
                format={formatNumber}
              />
              <UsageMeter
                label="Bandwidth"
                used={usage.bytes}
                total={usage.quota.bytes}
                format={humanizeBytes}
              />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      {error && (
        <Card className="border-destructive/40">
          <CardContent className="py-6 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {!error && projects === null && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      )}

      {projects && projects.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl border bg-muted/50">
              <FolderPlus className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No projects yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first project to get a live and a test API key.
              </p>
            </div>
            <Button asChild>
              <Link href="/console/new">
                <Plus className="size-4" /> Create project
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {projects && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/console/${project.id}`} className="group">
              <Card className="h-full transition-colors hover:border-foreground/20 hover:bg-accent/40">
                <CardContent className="flex h-full flex-col gap-4 pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-medium">{project.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Created {formatRelative(project.createdAt)}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <Badge variant="secondary" className="font-normal">
                      {project.allowedOrigins.length} origin
                      {project.allowedOrigins.length === 1 ? "" : "s"}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      {project.allowedTargets.length
                        ? `${project.allowedTargets.length} target${project.allowedTargets.length === 1 ? "" : "s"}`
                        : "any target"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
