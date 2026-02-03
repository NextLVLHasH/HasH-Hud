"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Parameter {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}

interface ApiEndpointProps {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  parameters?: Parameter[];
  requestBody?: string;
  responseExample?: string;
  authentication?: boolean;
}

const methodColors: Record<string, string> = {
  GET: "bg-[--color-hytale-green] text-white",
  POST: "bg-[--color-hytale-cyan] text-white",
  PUT: "bg-[--color-hytale-gold] text-black",
  PATCH: "bg-[--color-hytale-violet] text-white",
  DELETE: "bg-destructive text-white",
};

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export function ApiEndpoint({
  method,
  path,
  description,
  parameters,
  requestBody,
  responseExample,
  authentication = false,
}: ApiEndpointProps) {
  return (
    <Card className="my-6">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={cn("font-mono", methodColors[method])}>
            {method}
          </Badge>
          <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
            {path}
          </code>
          {authentication && (
            <Badge variant="outline" className="text-xs">
              Requires Auth
            </Badge>
          )}
        </div>
        <CardTitle className="mt-3 text-base font-normal text-muted-foreground">
          {description}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={parameters ? "parameters" : "response"}>
          <TabsList>
            {parameters && parameters.length > 0 && (
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
            )}
            {requestBody && (
              <TabsTrigger value="request">Request Body</TabsTrigger>
            )}
            {responseExample && (
              <TabsTrigger value="response">Response</TabsTrigger>
            )}
          </TabsList>

          {parameters && parameters.length > 0 && (
            <TabsContent value="parameters" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parameters.map((param) => (
                    <TableRow key={param.name}>
                      <TableCell className="font-mono text-sm">
                        {param.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {param.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {param.required ? (
                          <Badge variant="default">Required</Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            Optional
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{param.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          )}

          {requestBody && (
            <TabsContent value="request" className="mt-4">
              <CodeBlock code={requestBody} language="json" />
            </TabsContent>
          )}

          {responseExample && (
            <TabsContent value="response" className="mt-4">
              <CodeBlock code={responseExample} language="json" />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
