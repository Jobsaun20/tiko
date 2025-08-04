// pages/disclaimer.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Disclaimer() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Haftungsausschluss</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            Tiko ist eine reine Unterhaltungsplattform. Alle Daten, Inhalte und Bilder werden von den Nutzern selbst erstellt. Für die Inhalte, Bilder oder Handlungen der Nutzer übernimmt Tiko keinerlei Verantwortung oder Haftung. Die Nutzer sind allein für den korrekten und rechtmässigen Gebrauch der Plattform verantwortlich.
          </p>
          <p>
            Tiko haftet nicht für Schäden oder Verluste, die durch die Nutzung der Plattform entstehen. Im Zweifelsfall wenden Sie sich bitte an unseren Support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
