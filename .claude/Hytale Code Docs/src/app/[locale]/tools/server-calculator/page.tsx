"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, Server, Cpu, HardDrive, Wifi, Info } from "lucide-react";

interface ServerRequirements {
  ram: { min: number; recommended: number };
  cpu: { cores: number; speed: string };
  storage: { min: number; recommended: number };
  network: { upload: number };
  tier: string;
  notes: string[];
}

function calculateRequirements(players: number, viewDistance: number): ServerRequirements {
  // Base requirements
  let baseRam = 2; // GB
  let baseCores = 2;
  let baseStorage = 20; // GB
  let baseNetwork = 50; // Mbps

  // Player scaling (roughly 150-200MB per player)
  const playerRam = players * 0.18;

  // View distance scaling (quadratic - doubling view distance = 4x load)
  // Base is 192 blocks, each doubling quadruples requirements
  const viewDistanceMultiplier = Math.pow(viewDistance / 192, 2);

  // Calculate RAM
  const calculatedRam = (baseRam + playerRam) * Math.max(1, viewDistanceMultiplier * 0.5);
  const minRam = Math.ceil(calculatedRam);
  const recommendedRam = Math.ceil(calculatedRam * 1.5);

  // Calculate CPU cores
  let cores = baseCores;
  if (players > 20) cores = 4;
  if (players > 40) cores = 6;
  if (players > 60) cores = 8;
  if (viewDistance > 384) cores = Math.max(cores, 6);

  // Calculate storage
  const storagePerPlayer = 0.5; // GB per player for world data
  const minStorage = Math.ceil(baseStorage + (players * storagePerPlayer));
  const recommendedStorage = Math.ceil(minStorage * 2);

  // Calculate network
  let network = baseNetwork;
  if (players > 10) network = 100;
  if (players > 30) network = 500;
  if (players > 50) network = 1000;

  // Determine tier
  let tier = "Small";
  if (players > 15) tier = "Medium";
  if (players > 35) tier = "Large";
  if (players > 60) tier = "Enterprise";

  // Generate notes
  const notes: string[] = [];
  if (viewDistance > 384) {
    notes.push("High view distance significantly increases server load. Consider lowering if experiencing lag.");
  }
  if (players > 50) {
    notes.push("For large servers, consider using NVMe SSDs for better world loading performance.");
  }
  if (viewDistanceMultiplier > 2) {
    notes.push("View distance is the biggest performance factor. Current setting requires extra resources.");
  }
  notes.push("These are estimates based on official Hytale documentation. Actual requirements may vary.");

  return {
    ram: { min: Math.max(4, minRam), recommended: Math.max(6, recommendedRam) },
    cpu: { cores, speed: cores >= 6 ? "3.5GHz+" : "3.0GHz+" },
    storage: { min: Math.max(50, minStorage), recommended: Math.max(100, recommendedStorage) },
    network: { upload: network },
    tier,
    notes,
  };
}

export default function ServerCalculatorPage() {
  const [players, setPlayers] = useState(20);
  const [viewDistance, setViewDistance] = useState(192);

  const requirements = useMemo(
    () => calculateRequirements(players, viewDistance),
    [players, viewDistance]
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/tools"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tools
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gradient mb-4">
          Server Requirements Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Estimate the hardware requirements for your Hytale server based on player count and view distance.
        </p>
      </div>

      {/* Input Section */}
      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">Server Configuration</CardTitle>
          <CardDescription className="text-muted-foreground">
            Adjust the sliders to match your expected server load
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Players Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-foreground">
                Expected Players
              </label>
              <span className="text-2xl font-bold text-primary">{players}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>

          {/* View Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-foreground">
                View Distance (blocks)
              </label>
              <span className="text-2xl font-bold text-primary">{viewDistance}</span>
            </div>
            <input
              type="range"
              min="64"
              max="512"
              step="64"
              value={viewDistance}
              onChange={(e) => setViewDistance(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>64</span>
              <span>192</span>
              <span>320</span>
              <span>448</span>
              <span>512</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Doubling view distance quadruples server load
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {/* RAM */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Server className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-muted-foreground">RAM</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Minimum</span>
                <span className="text-lg font-semibold text-foreground">{requirements.ram.min} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Recommended</span>
                <span className="text-lg font-semibold text-primary">{requirements.ram.recommended} GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CPU */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Cpu className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-muted-foreground">CPU</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cores</span>
                <span className="text-lg font-semibold text-foreground">{requirements.cpu.cores}+ cores</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Clock Speed</span>
                <span className="text-lg font-semibold text-primary">{requirements.cpu.speed}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <HardDrive className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-muted-foreground">Storage (NVMe SSD)</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Minimum</span>
                <span className="text-lg font-semibold text-foreground">{requirements.storage.min} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Recommended</span>
                <span className="text-lg font-semibold text-primary">{requirements.storage.recommended} GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Wifi className="h-5 w-5 text-orange-400" />
              </div>
              <span className="text-muted-foreground">Network</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Upload Speed</span>
                <span className="text-lg font-semibold text-primary">{requirements.network.upload} Mbps+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Server Tier</span>
                <span className="text-lg font-semibold text-foreground">{requirements.tier}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card className="bg-muted/50 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Notes & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {requirements.notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">-</span>
                {note}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Source */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Based on{" "}
        <a
          href="https://hytale.com/news/2019/1/an-overview-of-hytales-server-technology"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          official Hytale server documentation
        </a>
      </div>
    </div>
  );
}
