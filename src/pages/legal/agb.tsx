// pages/agb.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AGB() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Allgemeine Geschäftsbedingungen (AGB)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            <b>1. Geltungsbereich</b><br />
            Diese AGB gelten für die Nutzung der Online-Plattform Pic. Durch die Nutzung der Plattform akzeptieren Sie diese Bedingungen.
          </p>
          <p>
            <b>2. Plattformzweck</b><br />
            Pic ist eine Plattform für Unterhaltung und soziale Interaktion. Pic übernimmt keine Verantwortung für Inhalte, Bilder oder Daten, die von Nutzern erstellt oder hochgeladen werden.
          </p>
          <p>
            <b>3. Nutzungsrechte & Pflichten</b><br />
            Nutzer sind für die Einhaltung aller geltenden Gesetze und Vorschriften verantwortlich. Jede missbräuchliche oder rechtswidrige Nutzung der Plattform ist untersagt.
          </p>
          <p>
            <b>4. Haftungsausschluss</b><br />
            Pic übernimmt keine Haftung für Schäden, die durch die Nutzung der Plattform oder durch Inhalte Dritter entstehen. Die Nutzung erfolgt auf eigene Gefahr.
          </p>
          <p>
            <b>5. Änderung der AGB</b><br />
            Pic behält sich das Recht vor, diese Bedingungen jederzeit anzupassen. Änderungen werden auf der Website veröffentlicht.
          </p>
          <p>
            <b>6. Anwendbares Recht und Gerichtsstand</b><br />
            Es gilt Schweizer Recht. Gerichtsstand ist Luzern, Schweiz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
