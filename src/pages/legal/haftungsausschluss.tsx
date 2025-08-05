import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Haftungsausschluss() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Exención de Responsabilidad / Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            Tiko garantiza el funcionamiento técnico dentro de sus capacidades. No se responsabiliza por fallos externos o mal uso. <br />
            Tiko guarantees technical functionality within its capabilities. It is not responsible for external failures or misuse.
          </p>
          <p>
            El uso de la plataforma es responsabilidad del usuario. <br />
            Use of the platform is the responsibility of the user.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}