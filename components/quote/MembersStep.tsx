"use client";

import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import type { CoveredMember, Relation } from "@/lib/journey/schema";

function makeId() {
  return crypto.randomUUID();
}

function AgeInput({
  value,
  min,
  max,
  ariaLabel,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  ariaLabel: string;
  onChange: (age: number) => void;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={value}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
      }}
      className="h-10 w-16 rounded-lg border border-black/15 px-2 text-center text-sm outline-none focus:border-brand"
      aria-label={ariaLabel}
    />
  );
}

export function MembersStep({
  members,
  onChange,
}: {
  members: CoveredMember[];
  onChange: (members: CoveredMember[]) => void;
}) {
  const self = members.find((m) => m.relation === "self");
  const spouse = members.find((m) => m.relation === "spouse");
  const kids = members.filter(
    (m) => m.relation === "son" || m.relation === "daughter"
  );
  const father = members.find((m) => m.relation === "father");
  const mother = members.find((m) => m.relation === "mother");

  function setAge(id: string, age: number) {
    onChange(members.map((m) => (m.id === id ? { ...m, age } : m)));
  }

  function toggle(relation: Relation, checked: boolean, defaultAge: number) {
    if (checked) {
      onChange([...members, { id: makeId(), relation, age: defaultAge }]);
    } else {
      onChange(members.filter((m) => m.relation !== relation));
    }
  }

  function remove(id: string) {
    onChange(members.filter((m) => m.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4">
        <div className="flex items-center justify-between">
          <Checkbox
            label="Myself"
            checked={!!self}
            onChange={(e) => toggle("self", e.target.checked, 30)}
          />
          {self && (
            <AgeInput
              value={self.age}
              min={18}
              max={99}
              ariaLabel="Your age"
              onChange={(age) => setAge(self.id, age)}
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <Checkbox
            label="Spouse"
            checked={!!spouse}
            onChange={(e) => toggle("spouse", e.target.checked, 28)}
          />
          {spouse && (
            <AgeInput
              value={spouse.age}
              min={18}
              max={99}
              ariaLabel="Spouse age"
              onChange={(age) => setAge(spouse.id, age)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4">
        <p className="text-sm font-medium">Children</p>
        {kids.map((kid) => (
          <div key={kid.id} className="flex items-center gap-2">
            <select
              value={kid.relation}
              onChange={(e) =>
                onChange(
                  members.map((m) =>
                    m.id === kid.id
                      ? { ...m, relation: e.target.value as Relation }
                      : m
                  )
                )
              }
              className="h-10 flex-1 rounded-lg border border-black/15 px-2 text-sm outline-none focus:border-brand"
            >
              <option value="son">Son</option>
              <option value="daughter">Daughter</option>
            </select>
            <AgeInput
              value={kid.age}
              min={0}
              max={25}
              ariaLabel="Child age"
              onChange={(age) => setAge(kid.id, age)}
            />
            <button
              type="button"
              onClick={() => remove(kid.id)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-black/[.03]"
              aria-label="Remove child"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {kids.length < 4 && (
          <Button
            type="button"
            variant="outline"
            className="h-10 self-start px-3 text-sm"
            onClick={() =>
              onChange([...members, { id: makeId(), relation: "son", age: 8 }])
            }
          >
            <Plus className="h-4 w-4" /> Add child
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4">
        <p className="text-sm font-medium">Parents</p>
        <div className="flex items-center justify-between">
          <Checkbox
            label="Father"
            checked={!!father}
            onChange={(e) => toggle("father", e.target.checked, 58)}
          />
          {father && (
            <AgeInput
              value={father.age}
              min={30}
              max={99}
              ariaLabel="Father age"
              onChange={(age) => setAge(father.id, age)}
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <Checkbox
            label="Mother"
            checked={!!mother}
            onChange={(e) => toggle("mother", e.target.checked, 55)}
          />
          {mother && (
            <AgeInput
              value={mother.age}
              min={30}
              max={99}
              ariaLabel="Mother age"
              onChange={(age) => setAge(mother.id, age)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
