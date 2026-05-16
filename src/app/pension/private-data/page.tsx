import { Save, Trash2 } from "lucide-react";
import { ModulePage } from "@/components/layout/ModulePage";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName, textareaClassName } from "@/components/ui/Field";
import { formatMoney } from "@/lib/formatters";
import { mockDb } from "@/lib/mock-db";

export default function PrivatePensionDataPage() {
  const privateData = mockDb.privatePensionData[0];

  return (
    <ModulePage
      title="Dane emerytalne"
      eyebrow="Dane prywatne"
      description="Kapital poczatkowy jest widoczny tylko dla wlasciciela danych. Kadry i administrator nie powinny miec do niego dostepu."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <Card>
          <CardHeader title="Aktualny stan" description="Dane wykorzystywane w symulacji." />
          <CardBody>
            <p className="text-sm text-slate-600 dark:text-slate-400">Kapital poczatkowy</p>
            <p className="mt-2 text-3xl font-semibold">{formatMoney(privateData.initialCapital)}</p>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{privateData.notes}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Formularz danych prywatnych" />
          <CardBody>
            <form className="space-y-4">
              <Field label="Kapital poczatkowy" htmlFor="initialCapital" hint="Kwota w PLN.">
                <input
                  id="initialCapital"
                  className={inputClassName}
                  defaultValue={privateData.initialCapital}
                  inputMode="decimal"
                />
              </Field>
              <Field label="Notatki prywatne" htmlFor="notes">
                <textarea
                  id="notes"
                  className={textareaClassName}
                  defaultValue={privateData.notes ?? ""}
                />
              </Field>
              <div className="flex flex-wrap gap-2">
                <Button icon={Save} tone="primary">Zapisz</Button>
                <Button icon={Trash2}>Usun dane</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </ModulePage>
  );
}
