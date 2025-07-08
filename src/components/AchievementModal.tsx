
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Award } from "lucide-react";
import { Achievement } from "@/utils/gamification";

interface AchievementModalProps {
  achievements: Achievement[];
  onComplete: () => void;
}

export const AchievementModal = ({ achievements, onComplete }: AchievementModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievements.length === 0) return;

    setIsVisible(true);
    const timer = setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsVisible(false);
        setTimeout(onComplete, 300);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [achievements, currentIndex, onComplete]);

  if (achievements.length === 0 || !isVisible) return null;

  const currentAchievement = achievements[currentIndex];

  const getIcon = () => {
    switch (currentAchievement.type) {
      case 'xp':
        return <Zap className="h-12 w-12 text-yellow-500" />;
      case 'badge':
        return <Award className="h-12 w-12 text-purple-500" />;
      case 'level_up':
        return <Trophy className="h-12 w-12 text-gold-500" />;
      default:
        return <Star className="h-12 w-12 text-blue-500" />;
    }
  };

  const getTitle = () => {
    switch (currentAchievement.type) {
      case 'xp':
        return "¡Experiencia Ganada!";
      case 'badge':
        return "¡Nueva Insignia!";
      case 'level_up':
        return "¡Nivel Alcanzado!";
      default:
        return "¡Logro Desbloqueado!";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      
      {/* Achievement Card */}
      <Card className="relative z-10 w-full max-w-md mx-4 animate-scale-in shadow-2xl border-2">
        <CardContent className="p-8 text-center">
          {/* Icon with animation */}
          <div className="mb-6 animate-pulse">
            {currentAchievement.type === 'badge' && currentAchievement.badge ? (
              <div className="text-6xl mb-2">{currentAchievement.badge.icon}</div>
            ) : (
              getIcon()
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {getTitle()}
          </h2>

          {/* Message */}
          <p className="text-lg text-gray-600 mb-6">
            {currentAchievement.message}
          </p>

          {/* XP or Badge Info */}
          {currentAchievement.type === 'xp' && (
            <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
              +{currentAchievement.xp} XP
            </Badge>
          )}

          {currentAchievement.type === 'badge' && currentAchievement.badge && (
            <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
              {currentAchievement.badge.rarity} · +{currentAchievement.badge.xpReward} XP
            </Badge>
          )}

          {currentAchievement.type === 'level_up' && (
            <Badge className="bg-gradient-to-r from-gold-400 to-yellow-500 text-white text-lg px-4 py-2">
              Nivel {currentAchievement.newLevel}
            </Badge>
          )}

          {/* Progress indicator */}
          {achievements.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {achievements.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
