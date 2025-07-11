
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardContent className="py-12">
              <AlertTriangle className="h-16 w-16 mx-auto text-gray-400 mb-6" />
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                404 - {t.common.error}
              </h1>
              <p className="text-gray-600 mb-8">
                Page not found.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {t.common.back}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
