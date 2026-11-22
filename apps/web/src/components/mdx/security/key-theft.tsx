"use client";

import { type ReactNode, useState } from "react";
import { ControlBar, Segmented } from "@/components/mdx/controls";
import { Narration } from "@/components/mdx/figure";
import { cn } from "@/lib/utils";

type Storage = "plain" | "passphrase" | "hardware";
type Verdict = { safe: boolean; title: string; detail: string };

const OPTIONS: { value: Storage; label: ReactNode }[] = [
  { value: "plain", label: <Label short="Plain file" full="Plain key file" /> },
  {
    value: "passphrase",
    label: <Label short="Passphrase" full="Passphrase + Keychain" />,
  },
  {
    value: "hardware",
    label: <Label short="Hardware" full="Hardware / Secure Enclave" />,
  },
];

/** Full labels don't fit three across on a phone. */
function Label({ short, full }: { short: string; full: string }) {
  return (
    <>
      <span className="sm:hidden">{short}</span>
      <span className="hidden sm:inline">{full}</span>
    </>
  );
}

const OUTCOME: Record<
  Storage,
  { copy: Verdict; malware: Verdict; story: string }
> = {
  plain: {
    copy: {
      safe: false,
      title: "Key works anywhere, forever",
      detail: "Until you remove it from every server and service.",
    },
    malware: {
      safe: false,
      title: "Uses key silently",
      detail: "No prompt, and the logs say it was you.",
    },
    story:
      "A plain key file is the key itself: a stealer copies it and signs in from anywhere until you revoke it, and malware on your laptop uses it without asking.",
  },
  passphrase: {
    copy: {
      safe: true,
      title: "Useless file without passphrase",
      detail: "Encrypted on disk; only a weak passphrase cracks offline.",
    },
    malware: {
      safe: false,
      title: "Can use the unlocked agent",
      detail:
        "Keychain unlocks it at login, so ssh-agent signs for anything running as you.",
    },
    story:
      "The passphrase encrypts the file, so a copied key is useless unless it can be cracked; but once Keychain has unlocked it into the agent, malware running as you can still use it.",
  },
  hardware: {
    copy: {
      safe: true,
      title: "Nothing to copy",
      detail:
        "The private key never leaves the chip; at most a handle that needs the device.",
    },
    malware: {
      safe: true,
      title: "Needs your touch or Touch ID for each use",
      detail: "A prompt you didn't start is the alarm; don't approve it.",
    },
    story:
      "The private key lives in a security key or the Secure Enclave and never leaves it, so there is nothing to steal, and every signature waits for your touch or Touch ID.",
  },
};

const W = 300;
const H = 112;
const BOX = { y: 22, h: 82, w: 116 };
const LEFT = 2;
const RIGHT = W - BOX.w - 2;
const MID = BOX.y + BOX.h / 2;

const fade = "transition-opacity duration-300 motion-reduce:transition-none";
const show = (on: boolean) => cn(fade, on ? "opacity-100" : "opacity-0");

/** 24×12 key, bow on the left. */
function KeyGlyph({
  x,
  y,
  className,
}: {
  x: number;
  y: number;
  className?: string;
}) {
  return (
    <path
      d="M11 6a5 5 0 1 1 0-.01M11 6h13M20 6v4M23 6v3"
      transform={`translate(${x} ${y})`}
      fill="none"
      strokeWidth={1.4}
      strokeLinecap="round"
      className={className}
    />
  );
}

/** 10×12 padlock. */
function Lock({ x, y }: { x: number; y: number }) {
  return (
    <path
      d="M1 5.5h8v6H1zM2.75 5.5V3.5a2.25 2.25 0 0 1 4.5 0v2"
      transform={`translate(${x} ${y})`}
      strokeWidth={1.2}
      strokeLinejoin="round"
      className="fill-site-card stroke-site-text-secondary"
    />
  );
}

/** 22×22 chip with pins. */
function Chip({ x, y }: { x: number; y: number }) {
  return (
    <path
      d="M5 5h12v12H5zM8.5 8.5h5v5h-5zM8 1v4M14 1v4M8 17v4M14 17v4M1 8h4M1 14h4M17 8h4M17 14h4"
      transform={`translate(${x} ${y})`}
      fill="none"
      strokeWidth={1.2}
      strokeLinecap="round"
      className="stroke-site-text-secondary"
    />
  );
}

function Box({ x, label }: { x: number; label: string }) {
  return (
    <>
      <text
        x={x + BOX.w / 2}
        y={12}
        textAnchor="middle"
        className="fill-site-text-secondary font-mono text-3xs"
      >
        {label}
      </text>
      <rect
        x={x}
        y={BOX.y}
        width={BOX.w}
        height={BOX.h}
        rx={8}
        strokeWidth={1}
        className="fill-site-bg-secondary stroke-site-border-hover"
      />
    </>
  );
}

/** What sits in ~/.ssh for each option, drawn centred on (cx, cy). */
function StoredKey({
  storage,
  cx,
  cy,
}: {
  storage: Storage;
  cx: number;
  cy: number;
}) {
  return (
    <>
      <g className={show(storage === "plain")}>
        <KeyGlyph x={cx - 12} y={cy - 6} className="stroke-site-text" />
      </g>
      <g className={show(storage === "passphrase")}>
        <KeyGlyph
          x={cx - 16}
          y={cy - 6}
          className="stroke-site-text-secondary"
        />
        <Lock x={cx + 8} y={cy - 4} />
      </g>
      <g className={show(storage === "hardware")}>
        <Chip x={cx - 11} y={cy - 11} />
      </g>
    </>
  );
}

function Arrow({
  hot,
  dashed,
  x1,
  x2,
}: {
  hot: boolean;
  dashed?: boolean;
  x1: number;
  x2: number;
}) {
  return (
    <path
      d={`M${x1} ${MID}H${x2}M${x2 - 5} ${MID - 4}l5 4-5 4`}
      fill="none"
      strokeWidth={hot ? 1.5 : 1}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "3 3" : undefined}
      className={hot ? "stroke-site-accent" : "stroke-site-text-tertiary"}
    />
  );
}

const A1 = LEFT + BOX.w + 6;
const A2 = RIGHT - 6;

/** (a) The ~/.ssh folder is copied off the machine. */
function CopyScene({ storage }: { storage: Storage }) {
  const v = OUTCOME[storage].copy;
  const lx = LEFT + BOX.w / 2;
  const rx = RIGHT + BOX.w / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
      <title>{`Stealer copies ~/.ssh: ${v.title}.`}</title>
      <Box x={LEFT} label="your laptop" />
      <Box x={RIGHT} label="attacker's machine" />
      <text
        x={lx}
        y={BOX.y + 22}
        textAnchor="middle"
        className="fill-site-text-secondary font-mono text-3xs"
      >
        ~/.ssh
      </text>
      <StoredKey storage={storage} cx={lx} cy={MID + 8} />

      <Arrow hot={!v.safe} dashed={storage === "hardware"} x1={A1} x2={A2} />
      <text
        x={(A1 + A2) / 2}
        y={MID - 8}
        textAnchor="middle"
        className="fill-site-text-tertiary font-mono text-3xs"
      >
        copy
      </text>

      <g className={show(storage === "plain")}>
        <KeyGlyph x={rx - 12} y={MID - 2} className="stroke-site-accent" />
      </g>
      <g className={show(storage === "passphrase")}>
        <KeyGlyph
          x={rx - 16}
          y={MID - 2}
          className="stroke-site-text-tertiary"
        />
        <Lock x={rx + 8} y={MID} />
      </g>
      <text
        x={rx}
        y={MID + 8}
        textAnchor="middle"
        className={cn(
          "fill-site-text-tertiary font-mono text-3xs",
          show(storage === "hardware"),
        )}
      >
        nothing
      </text>
    </svg>
  );
}

/** (b) Malware on the laptop signs in to your servers as you. */
function MalwareScene({ storage }: { storage: Storage }) {
  const v = OUTCOME[storage].malware;
  const lx = LEFT + BOX.w / 2;
  const rx = RIGHT + BOX.w / 2;
  const touch = storage === "hardware";
  const gate = (A1 + A2) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
      <title>{`Malware running as you: ${v.title}.`}</title>
      <Box x={LEFT} label="your laptop" />
      <Box x={RIGHT} label="your servers" />
      <rect
        x={lx - 26}
        y={BOX.y + 10}
        width={52}
        height={18}
        rx={9}
        strokeWidth={1}
        className="fill-site-card stroke-site-text-tertiary"
      />
      <text
        x={lx}
        y={BOX.y + 22}
        textAnchor="middle"
        className="fill-site-text font-mono text-3xs"
      >
        malware
      </text>
      <StoredKey storage={storage} cx={lx} cy={MID + 18} />

      <g className={show(!touch)}>
        <Arrow hot x1={A1} x2={A2} />
      </g>
      <g className={show(touch)}>
        <path
          d={`M${A1} ${MID}H${gate - 10}`}
          fill="none"
          strokeWidth={1}
          strokeLinecap="round"
          className="stroke-site-text-tertiary"
        />
        <Arrow hot={false} dashed x1={gate + 10} x2={A2} />
        {/* Fingertip: the signature waits here for you. */}
        <circle
          cx={gate}
          cy={MID}
          r={6}
          strokeWidth={1.2}
          className="fill-site-card stroke-site-text-secondary"
        />
        <circle
          cx={gate}
          cy={MID}
          r={10}
          strokeWidth={1}
          strokeDasharray="2 2.5"
          fill="none"
          className="stroke-site-text-tertiary"
        />
        <text
          x={gate}
          y={MID + 24}
          textAnchor="middle"
          className="fill-site-text-secondary font-mono text-3xs"
        >
          touch
        </text>
      </g>
      <text
        x={gate}
        y={MID - 14}
        textAnchor="middle"
        className="fill-site-text-tertiary font-mono text-3xs"
      >
        ssh
      </text>

      <text
        x={rx}
        y={MID + 4}
        textAnchor="middle"
        className={cn("fill-site-accent-text font-mono text-2xs", show(!touch))}
      >
        signed in
      </text>
      <text
        x={rx}
        y={MID + 4}
        textAnchor="middle"
        className={cn(
          "fill-site-text-tertiary font-mono text-2xs",
          show(touch),
        )}
      >
        locked out
      </text>
    </svg>
  );
}

function VerdictGlyph({ safe }: { safe: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="mt-0.5 size-4 shrink-0"
    >
      {safe ? (
        <path
          d="M3 8.5l3.25 3L13 4.5"
          fill="none"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-site-success"
        />
      ) : (
        <path
          d="M8 1.5L15 14H1zM8 6v3.5M8 11.75v.01"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="fill-site-accent-subtle stroke-site-accent"
        />
      )}
    </svg>
  );
}

function Scenario({
  title,
  verdict,
  children,
}: {
  title: string;
  verdict: Verdict;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <p className="mb-3 font-mono text-2xs text-site-text-secondary leading-5 sm:min-h-10">
        {title}
      </p>
      {children}
      <div className="mt-3 flex gap-2">
        <VerdictGlyph safe={verdict.safe} />
        <div>
          <p
            className={cn(
              "font-display font-medium text-base leading-snug",
              verdict.safe ? "text-site-text" : "text-site-accent-text",
            )}
          >
            {verdict.title}
          </p>
          <p className="mt-1 text-site-text-secondary text-xs leading-relaxed">
            {verdict.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

/** What an attacker gets from your SSH key, by how it's stored. SSR shows the plain file: both attacks win. */
export function KeyTheft() {
  const [storage, setStorage] = useState<Storage>("plain");
  const o = OUTCOME[storage];

  return (
    <div>
      <ControlBar className="mb-5">
        <Segmented
          label="How the SSH key is stored"
          value={storage}
          options={OPTIONS}
          onChange={setStorage}
        />
      </ControlBar>
      <div className="grid gap-8 sm:grid-cols-2">
        <Scenario title="(a) Stealer copies ~/.ssh and leaves" verdict={o.copy}>
          <CopyScene storage={storage} />
        </Scenario>
        <Scenario
          title="(b) Malware runs as you while you're logged in"
          verdict={o.malware}
        >
          <MalwareScene storage={storage} />
        </Scenario>
      </div>
      <Narration>{o.story}</Narration>
    </div>
  );
}
