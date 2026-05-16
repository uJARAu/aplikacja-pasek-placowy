"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PrintActions() {
  function printDocument() {
    window.print();
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <Button icon={Printer} onClick={printDocument}>
        Drukuj
      </Button>
      <Button icon={Download} onClick={printDocument} tone="primary">
        Zapisz jako PDF
      </Button>
    </div>
  );
}
