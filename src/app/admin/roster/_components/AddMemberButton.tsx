"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MemberForm } from "./MemberForm";

export function AddMemberButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <PlusCircle className="h-4 w-4" />
        Tambah Anggota
      </Button>
      <MemberForm open={open} onOpenChange={setOpen} />
    </>
  );
}
