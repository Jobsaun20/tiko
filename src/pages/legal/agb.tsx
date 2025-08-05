import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AGB() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Términos y Condiciones / Terms of Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            <b>1. Ámbito de aplicación / Scope</b><br />
            Estas condiciones se aplican al uso de la app web Tiko. Al usar la app, el usuario acepta estas condiciones. <br />
            These terms apply to the use of the Tiko web application. By using the app, you agree to these terms.
          </p>
          <p>
            <b>2. Uso de la plataforma / Use of the Platform</b><br />
            Tiko proporciona una plataforma para la interacción entre usuarios. Los usuarios son responsables de los contenidos compartidos. <br />
            Tiko offers a platform for user interaction. Users are responsible for the content they share.
          </p>
          <p>
            <b>3. Responsabilidad del usuario / User Responsibility</b><br />
            El usuario es responsable de usar la app de forma legal y ética. Está prohibido el uso abusivo o ilegal. <br />
            Users are responsible for legal and ethical use of the app. Abusive or illegal use is prohibited.
          </p>
          <p>
            <b>4. Cambios en los Términos / Changes to Terms</b><br />
            Tiko puede modificar estas condiciones en cualquier momento. Los cambios se publicarán en la web. <br />
            Tiko may change these terms at any time. Changes will be published on the website.
          </p>
          <p>
            <b>5. Ley aplicable / Applicable Law</b><br />
            Se aplica la ley española. Jurisdicción: sede de la empresa. <br />
            Spanish law applies. Jurisdiction: the company's registered office.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}