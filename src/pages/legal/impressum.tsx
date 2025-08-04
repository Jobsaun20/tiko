// pages/impressum.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Impressum() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Impressum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            <b>Betreiber dieser Plattform:</b><br />
            Tiko – Eine Plattform für soziale Unterhaltung<br />
            [info@Tiko-app.com]<br />
            Luzern, Schweiz
          </p>
          <p>
            <b>Kontakt:</b><br />
            E-Mail: info@Tiko-app.com
          </p>
          <p>
            <b>Verantwortlich für den Inhalt:</b><br />
            [Tiko Team]<br />
          </p>
          <p>
            <b>Haftungsausschluss:</b><br />
            Trotz sorgfältiger Prüfung übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.
          
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
