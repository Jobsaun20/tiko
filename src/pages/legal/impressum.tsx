import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Impressum() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Aviso Legal / Legal Notice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            <b>Nombre / Name:</b> Tiko<br />
            <b>Correo electrónico / Email:</b> info.tikoes@gmail.com<br />
          </p>
          <p>
            Responsable del contenido: Tiko. El contenido es meramente informativo y no constituye relación contractual. <br />
            Content responsibility: Tiko. The content is for informational purposes and does not constitute a contractual relationship.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}