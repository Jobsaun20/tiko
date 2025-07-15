// pages/datenschutz.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Datenschutz() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Datenschutzerklärung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            <b>1. Allgemeines</b><br />
            DESWG verpflichtet sich, die Privatsphäre der Nutzer zu schützen. Wir erheben und speichern nur Daten, die für die Nutzung der Plattform notwendig sind.
          </p>
          <p>
            <b>2. Datenerhebung und -verarbeitung</b><br />
            Es werden nur die von Ihnen bereitgestellten und für die Nutzung notwendigen Daten gespeichert (z.B. Name, E-Mail, Profilbild). Sie entscheiden selbst, welche Daten Sie angeben.
          </p>
          <p>
            <b>3. Zweck der Datenverarbeitung</b><br />
            Die Daten werden ausschliesslich für den Betrieb und die Verbesserung der Plattform verwendet und nicht an Dritte weitergegeben.
          </p>
          <p>
            <b>4. Externe Inhalte & Links</b><br />
            Die Plattform kann Inhalte Dritter oder Links zu anderen Webseiten enthalten. Für deren Datenschutzbestimmungen übernimmt DESWG keine Verantwortung.
          </p>
          <p>
            <b>5. Auskunfts- und Löschungsrecht</b><br />
            Sie haben jederzeit das Recht, Auskunft über Ihre gespeicherten Daten zu erhalten oder deren Löschung zu verlangen.
          </p>
          <p>
            <b>6. Änderungen</b><br />
            Änderungen dieser Datenschutzerklärung werden auf der Website veröffentlicht.
            
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
