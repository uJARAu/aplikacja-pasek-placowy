import { Save, SlidersHorizontal } from "lucide-react";
import { ModulePage } from "@/components/layout/ModulePage";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { mockDb } from "@/lib/mock-db";

export default function AdminSettingsPage() {
  return (
    <ModulePage
      title="Konfiguracja"
      eyebrow="Administracja"
      description="Parametry systemowe widoczne dla administratora. Wersja demonstracyjna pokazuje konfiguracje stawek uzywanych w naliczaniu."
      actions={<Button icon={Save} tone="primary">Zapisz zmiany</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader
            title="Parametry naliczania"
            description="Mockowe wartosci zgodne z potrzeba prezentacji widokow."
          />
          <CardBody>
            <form className="space-y-4">
              {mockDb.systemSettings.map((setting) => (
                <Field key={setting.id} label={setting.key} htmlFor={setting.id} hint={setting.description ?? undefined}>
                  <input id={setting.id} className={inputClassName} defaultValue={setting.value} />
                </Field>
              ))}
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Zakres konfiguracji" />
          <CardBody>
            <div className="flex gap-3 rounded-lg border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/35">
              <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" />
              <div>
                <h3 className="font-semibold text-slate-950 dark:text-slate-50">Zakres zaliczeniowy</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Konfiguracja obejmuje stawki skladkowe i podatkowe uzywane przy mockowym
                  naliczaniu. Historyczne paski zachowuja wartosci zapisane w momencie naliczenia.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-400">
              Administrator nie ma z tego miejsca dostepu do kwot wyplat pracownikow, co zachowuje
              ograniczenie bezpieczenstwa z PDF-a.
            </div>
          </CardBody>
        </Card>
      </div>
    </ModulePage>
  );
}
