import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Datenschutz() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Política de Privacidad / Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            Tiko respeta la privacidad de los usuarios y cumple con el RGPD y la LOPDGDD. <br />
            Tiko respects user privacy and complies with GDPR and LOPDGDD.
          </p>
          <p>
            Los datos personales se usan solo para operar y mejorar el servicio. <br />
            Personal data is used only to operate and improve the service.
          </p>
          <p>
            El usuario tiene derecho a acceder, rectificar, eliminar o portar sus datos. <br />
            Users have the right to access, correct, delete, or transfer their data.
          </p>
          <p>
            La responsabilidad sobre datos de terceros recae en el usuario. <br />
            Responsibility for third-party data lies with the user.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}